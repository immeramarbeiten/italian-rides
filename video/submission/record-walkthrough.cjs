#!/usr/bin/env node
/* Records real interactions in an isolated browser context; never stubs model responses. */
const fs = require('node:fs/promises');
const path = require('node:path');
const {createRequire} = require('node:module');
const load = createRequire(process.env.VIDEO_TOOLS_PACKAGE || '/private/tmp/italian-rides-video-tools/package.json');
const {chromium} = load('playwright');
const root=path.resolve(__dirname,'../..');
const out=path.join(__dirname,'clips','raw');
const base=process.env.DEMO_BASE || 'http://localhost:3000';
const concern='The mirror glass is cracked. Can it be repaired, or do I need a replacement?';
const log={created:new Date().toISOString(),events:[],mode:'live endpoints; simulated fixture',status:'running'};
let start=0;
function mark(name,extra={}) {let time=(Date.now()-start)/1000;log.events.push({name,time,...extra});console.log(`${time.toFixed(2)} ${name}`,extra)}
async function run(){
 await fs.mkdir(out,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
 const context=await browser.newContext({viewport:{width:1440,height:810},deviceScaleFactor:1,recordVideo:{dir:out,size:{width:1440,height:810}}});
 const page=await context.newPage(); const video=page.video(); start=Date.now();
 const pause=(ms=900)=>page.waitForTimeout(ms);
 const f=()=>page.frameLocator('iframe[title="Italian Rides interactive demo"]');
 const visit=async route=>{await page.goto(`${base}/presentation?start=${encodeURIComponent(route)}`,{waitUntil:'domcontentloaded'});await f().locator('body').waitFor();await pause(900)};
 const click=async loc=>{await loc.scrollIntoViewIfNeeded();let b=await loc.boundingBox();if(!b)throw Error('Target has no box');await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:25});await pause(350);await page.mouse.click(b.x+b.width/2,b.y+b.height/2);await pause(600)};
 try {
  await visit('/');mark('home');await pause(3200);
  await visit('/models/vespa-gts-granturismo/viewer');mark('assembly');
  await f().getByText('Mirror and handlebar',{exact:true}).first().waitFor();
  let canvas=f().locator('canvas').first();await canvas.waitFor();await pause(1600);
  let box=await canvas.boundingBox();if(!box)throw Error('3D canvas unavailable');
  await page.mouse.move(box.x+box.width*.48,box.y+box.height*.5,{steps:20});await page.mouse.down();await page.mouse.move(box.x+box.width*.62,box.y+box.height*.53,{steps:55});await page.mouse.up();await pause(900);
  const slider=f().getByRole('slider',{name:'Separate the assembly'});await slider.scrollIntoViewIfNeeded();await click(slider);await slider.focus();await page.keyboard.press('Home');for(let i=0;i<12;i++){await page.keyboard.press('ArrowRight');await pause(65)}await pause(1500);
  await click(f().getByRole('button',{name:'Instruments',exact:true}));await pause(1800);
  await click(f().getByRole('button',{name:'Assembly',exact:true}));await pause(500);
  await visit('/inspect');mark('inspect-entry');
  await click(f().getByText('Try a demo image',{exact:true}));await click(f().getByRole('button',{name:'Mirror · cracked glass'}));
  await f().getByRole('combobox',{name:'Model family'}).selectOption({label:'GTS'});await f().getByRole('combobox',{name:'Engine (cc)'}).selectOption({label:'125 cc'});
  const field=f().getByLabel('Something wrong? (optional)');await click(field);await field.pressSequentially(concern,{delay:16});await pause(900);mark('inspect-submit');await click(f().getByRole('button',{name:'Continue to inspection'}));
  await f().getByRole('button',{name:'Inspect with agent'}).waitFor({timeout:180000});mark('agent-ready');await pause(700);await click(f().getByRole('button',{name:'Inspect with agent'}));mark('agent-run');
  await f().getByRole('button',{name:'Confirm part & continue'}).waitFor({timeout:180000});
  const status=await f().getByLabel('Agent inspection').innerText();
  if(!status.includes('outline available'))throw Error('SAM returned no visible outline; refusing to label this take successful');
  mark('agent-result',{status:status.slice(-400)});await pause(2600);
  await click(f().getByRole('button',{name:'Confirm part & continue'}));await f().getByRole('heading',{name:'Mirror',exact:true}).waitFor();mark('confirm');await pause(900);
  await click(f().getByText('Mirror check',{exact:false}).first());mark('evidence');await pause(3200);
  await click(f().getByRole('button',{name:'Prepare a workshop request'}));mark('request');await pause(3600);
  await click(f().getByRole('link',{name:'Record in My Garage'}));await f().getByText('DRAFT FROM INSPECTION',{exact:false}).waitFor();mark('garage-draft');
  await f().getByRole('combobox',{name:'Scooter',exact:true}).selectOption({label:'＋ Park a new scooter'});
  await f().getByPlaceholder('Model, e.g. GTS 300').fill('Vespa GTS/Granturismo');
  await f().getByRole('combobox',{name:'Outcome',exact:true}).selectOption({label:'Planned'});
  await f().getByPlaceholder('What did you actually do or decide?').fill('Demo: ask a workshop to inspect the mirror and advise on repair or replacement. Exact fitment to confirm.');
  await pause(1200);await click(f().getByRole('button',{name:'Save record'}));
  await f().getByText('[Planned] Mirror',{exact:false}).waitFor();mark('garage-saved');await pause(1600);
  await click(f().getByRole('link',{name:'Open passport →'}).first());await f().getByRole('heading',{name:'Maintenance timeline (1)'}).waitFor();mark('passport');await pause(3500);
  await visit('/inspect');mark('tyre-entry');await click(f().getByText('Try a demo image',{exact:true}));await click(f().getByRole('button',{name:'Front tyre · worn tread'}));
  await f().getByRole('combobox',{name:'Model family'}).selectOption({label:'GTS'});await f().getByRole('combobox',{name:'Engine (cc)'}).selectOption({label:'125 cc'});
  await f().getByLabel('Something wrong? (optional)').fill('I would like to check my front tyre for wear.');await click(f().getByRole('button',{name:'Continue to inspection'}));
  await f().getByRole('button',{name:'Inspect with agent'}).waitFor({timeout:180000});await click(f().getByRole('button',{name:'Inspect with agent'}));mark('tyre-agent');
  await f().getByRole('button',{name:'Confirm part & continue'}).waitFor({timeout:180000});const tyre=await f().getByLabel('Agent inspection').innerText();
  if(!tyre.includes('outline available'))throw Error('Tyre outline unavailable');mark('tyre-result',{status:tyre.slice(-400)});await pause(1800);
  await click(f().getByRole('button',{name:'Confirm part & continue'}));await click(f().getByText('Tyre pressure + wear check',{exact:false}).first());mark('tyre-guidance');await pause(4000);
  log.status='success';mark('end');
 } catch(err){log.status='failed';log.error=String(err.stack||err);console.error(log.error);try { await page.screenshot({path:path.join(out,'failure.png')}); log.visible=await page.locator('iframe').first().contentFrame().locator('body').innerText({timeout:3000}); } catch {} }
 finally {await context.close();let raw=await video.path();await browser.close();log.video=raw;await fs.writeFile(path.join(out,'capture-log.json'),JSON.stringify(log,null,2));await fs.writeFile(raw+'.json',JSON.stringify(log,null,2));console.log('RAW VIDEO:',raw);}
 if(log.status!=='success')process.exitCode=1;
}
run().catch(e=>{console.error(e);process.exitCode=1});
