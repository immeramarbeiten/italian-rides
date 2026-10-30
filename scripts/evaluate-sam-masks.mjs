/**
 * Visual SAM evaluation. Start the app with META_API_KEY configured, then run:
 * node scripts/evaluate-sam-masks.mjs /absolute/path/manifest.json /absolute/path/output
 * Manifest: [{"id":"mirror-side","image":"/absolute/path/photo.jpg","x":100,"y":100}].
 * Images are sent to the local app's /api/sam and then Meta. Use only consented/licensed
 * images; API requests may incur charges. Outputs contain the input images and masks.
 * The script does not assign pass/fail: a reviewer must inspect each output.
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import sharp from 'sharp';
const [manifest, outArg] = process.argv.slice(2);
if (!manifest || !outArg) throw new Error('Supply manifest.json and output directory.');
const tests=JSON.parse(await readFile(resolve(manifest),'utf8'));
const out=resolve(outArg); await mkdir(out,{recursive:true});
const results=[];
for (const item of tests) {
  if (!/^[a-z0-9_-]+$/i.test(item.id)) throw new Error('Invalid test id');
  const input=await readFile(resolve(item.image));
  const normalized=await sharp(input).rotate().jpeg({quality:90}).toBuffer({resolveWithObject:true});
  const {width,height}=normalized.info;
  if (![item.x,item.y].every(Number.isInteger)||item.x<0||item.y<0||item.x>=width||item.y>=height) throw new Error(`${item.id}: point outside oriented image`);
  try {
    const res=await fetch('http://localhost:3000/api/sam',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:'data:image/jpeg;base64,'+normalized.data.toString('base64'),mode:'point',x:item.x,y:item.y,width,height})});
    const data=await res.json();
    if (!res.ok) { results.push({id:item.id,status:'request_failed',http:res.status}); continue; }
    const matches=(data.matches??[]).filter(m=>m.svgPath);
    if (!matches.length) { results.push({id:item.id,status:'no_decodable_mask'}); continue; }
    const paths=matches.map(m=>`<g transform="translate(${m.box.x1} ${m.box.y1}) scale(${(m.box.x2-m.box.x1)/m.raster.w} ${(m.box.y2-m.box.y1)/m.raster.h})"><path d="${m.svgPath}" fill="#ef3535" fill-opacity="0.45" stroke="#fff" stroke-width="2"/></g>`).join('');
    const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${paths}<circle cx="${item.x}" cy="${item.y}" r="7" fill="#00ff00"/></svg>`);
    await sharp(normalized.data).composite([{input:svg}]).png().toFile(join(out,`${item.id}-mask.png`));
    await writeFile(join(out,`${item.id}-response.json`),JSON.stringify({matches},null,2));
    results.push({id:item.id,status:'mask_rendered',objects:matches.length,review:'pending'});
  } catch (e) {results.push({id:item.id,status:'failed',error:String(e)});}
}
await writeFile(join(out,'results.json'),JSON.stringify(results,null,2));
console.log(`Saved ${results.length} outcomes to ${out}. Inspect masks and record findings manually.`);
