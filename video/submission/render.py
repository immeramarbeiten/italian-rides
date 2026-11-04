#!/usr/bin/env python3
"""Assemble real screen clips, or an explicitly labelled still-capture animatic.

Final mode requires real clips. Animatic mode uses captured app screenshots;
missing captures are visibly marked instead of fabricating a product scene.
"""
from __future__ import annotations
import argparse,json,subprocess,tempfile
from pathlib import Path
import imageio.v2 as imageio
import imageio_ffmpeg
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageOps

ROOT=Path(__file__).resolve().parent
INK=(22,24,27);GREY=(110,116,124)

def font(size,bold=False):
    candidates=['/System/Library/Fonts/Supplemental/Arial Bold.ttf' if bold else '/System/Library/Fonts/Supplemental/Arial.ttf','/System/Library/Fonts/Helvetica.ttc']
    for p in candidates:
        try:return ImageFont.truetype(p,size)
        except OSError:pass
    return ImageFont.load_default()

def wrap(draw,text,f,maxwidth):
    lines=[];line=''
    for word in text.split():
        test=f'{line} {word}'.strip()
        if line and draw.textlength(test,font=f)>maxwidth:lines.append(line);line=word
        else:line=test
    return lines+[line] if line else lines

def card(shot,w,h,missing=False):
    im=Image.new('RGB',(w,h),(239,241,243));d=ImageDraw.Draw(im)
    d.text((w*.08,h*.12),'ITALIAN RIDES',font=font(round(w*.016),True),fill=GREY)
    title='CAPTURE NEEDED' if missing else shot['title']
    lines=wrap(d,title,font(round(w*.044),True),w*.78)
    y=h*.34
    for line in lines:d.text((w*.08,y),line,font=font(round(w*.044),True),fill=INK);y+=h*.09
    if shot.get('kind')=='system':
        labels=['Photo + concern','Focus + mask','Close-up','Evidence','Request + record']
        gap=w*.018;bw=(w*.84-gap*4)/5;x=w*.08;y=h*.62
        for i,label in enumerate(labels):
            d.rounded_rectangle((x,y,x+bw,y+h*.12),radius=8,fill='white',outline=(205,210,216),width=2)
            ls=wrap(d,label,font(round(w*.016),True),bw-24)
            for j,line in enumerate(ls):d.text((x+12,y+18+j*30),line,font=font(round(w*.016),True),fill=INK)
            x+=bw+gap
    if missing:d.text((w*.08,h*.7),shot['id'],font=font(round(w*.018)),fill=GREY)
    return im

def label(im,shot,preview=False):
    im=im.copy();w,h=im.size;d=ImageDraw.Draw(im,'RGBA')
    if preview:
        text='STORYBOARD PREVIEW · STILL CAPTURES'
        f=font(round(w*.012));tw=d.textlength(text,font=f)
        d.rounded_rectangle((w-tw-42,12,w-14,46),radius=8,fill=(255,255,255,238));d.text((w-tw-28,18),text,font=f,fill=(90,96,103,255))
    return im

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--out',required=True);p.add_argument('--manifest',default=str(ROOT/'timeline.json'));p.add_argument('--animatic',action='store_true');p.add_argument('--clips',type=Path);p.add_argument('--voice',type=Path);p.add_argument('--shots',help='comma-separated shot ids for a style proof');p.add_argument('--width',type=int,default=1920);p.add_argument('--fps',type=int,default=30)
    a=p.parse_args();manifest=json.loads(Path(a.manifest).read_text());shots=manifest['shots'];wanted=a.shots.split(',') if a.shots else None
    if wanted:shots=[s for s in shots if s['id'] in wanted]
    if not shots:p.error('No matching shots')
    if not a.animatic and not a.clips:p.error('Final mode needs --clips with actual screen recordings')
    if a.voice and wanted:p.error('Use a separately timed voice file for a selected-shots proof')
    w=a.width;h=round(w*9/16);h+=h%2
    out=Path(a.out).resolve();out.parent.mkdir(parents=True,exist_ok=True)
    if out.exists():p.error('Output exists; choose a new filename')
    ffmpeg=imageio_ffmpeg.get_ffmpeg_exe();missing=[]
    for shot in shots:
        if shot.get('kind') in ('system','end'):continue
        if not a.animatic and not (a.clips/f"{shot['id']}.mp4").exists():missing.append(shot['id'])
    if missing:p.error('Missing real clips: '+', '.join(missing))
    log=[]
    with tempfile.TemporaryDirectory(prefix='italian-rides-film-') as tmp:
        silent=Path(tmp)/'silent.mp4'
        writer=imageio.get_writer(str(silent),fps=a.fps,codec='libx264',quality=8,macro_block_size=2)
        for shot in shots:
            n=round(shot['duration']*a.fps);kind=shot.get('kind');print(f"Rendering {shot['id']} ({shot['duration']}s)",flush=True)
            if kind in ('system','end'):
                still=label(card(shot,w,h),shot,a.animatic);arr=np.asarray(still)
                for _ in range(n):writer.append_data(arr)
                source='editorial card'
            elif a.animatic:
                path=ROOT/'captures'/shot.get('capture','')
                if path.is_file():
                    raw=Image.open(path).convert('RGB');still=ImageOps.contain(raw,(w,h),Image.Resampling.LANCZOS)
                    base=Image.new('RGB',(w,h),(230,233,237));base.paste(still,((w-still.width)//2,(h-still.height)//2));still=label(base,shot,True);source=str(path)
                else:still=label(card(shot,w,h,True),shot,True);source='MISSING CAPTURE (visible slate)'
                # The image is held honestly; no invented clicks, typing or returned results.
                arr=np.asarray(still)
                for _ in range(n):writer.append_data(arr)
            else:
                clip=a.clips/f"{shot['id']}.mp4";reader=imageio.get_reader(str(clip));meta=reader.get_meta_data();fps=meta.get('fps',30);frames=reader.count_frames()
                if frames/fps<shot['duration']-.1:raise ValueError(f'{clip}: shorter than the assigned slot; edit the manifest or provide a longer take')
                for i in range(n):
                    raw=Image.fromarray(reader.get_data(min(frames-1,round(i*fps/a.fps)))).convert('RGB');scaled=ImageOps.contain(raw,(w,h),Image.Resampling.LANCZOS);base=Image.new('RGB',(w,h),(230,233,237));base.paste(scaled,((w-scaled.width)//2,(h-scaled.height)//2));writer.append_data(np.asarray(base))
                reader.close();source=str(clip)
            log.append({'shot':shot['id'],'seconds':shot['duration'],'source':source})
        writer.close()
        total=sum(s['duration'] for s in shots)
        if a.voice:
            subprocess.run([ffmpeg,'-y','-i',str(silent),'-i',str(a.voice),'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-af','apad','-t',str(total),'-movflags','+faststart',str(out)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
        else:
            subprocess.run([ffmpeg,'-y','-i',str(silent),'-c','copy','-movflags','+faststart',str(out)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    out.with_suffix('.sources.json').write_text(json.dumps({'preview':a.animatic,'width':w,'height':h,'fps':a.fps,'seconds':total,'voice':str(a.voice) if a.voice else None,'shots':log},indent=2))
    print(out,flush=True)
if __name__=='__main__':main()
