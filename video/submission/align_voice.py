#!/usr/bin/env python3
"""Align the generated narration to the scene plan using returned word timings."""
import argparse,json,re,subprocess
from pathlib import Path
import numpy as np
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parent
p=argparse.ArgumentParser(description=__doc__);p.add_argument('--audio',type=Path,default=ROOT/'output/narration.mp3');p.add_argument('--words',type=Path,default=ROOT/'output/voice-words.json');p.add_argument('--manifest',type=Path,default=ROOT/'timeline.json');a=p.parse_args()
manifest=json.loads(a.manifest.read_text());words=json.loads(a.words.read_text())['words'];shots=manifest['shots'];fps=manifest['fps']
norm=lambda s:re.sub('[^a-z0-9]','',s.lower())
script=[norm(t) for s in shots for t in s['narration'].split()];spoken=[norm(w['text']) for w in words]
if script!=spoken:raise ValueError('Transcript differs from the script; review and align it before rendering')
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe();sr=48000
raw=subprocess.run([ffmpeg,'-v','error','-i',str(a.audio),'-f','f32le','-ac','1','-ar',str(sr),'-'],capture_output=True,check=True).stdout
pcm=np.frombuffer(raw,dtype='<f4');cursor=0;segments=[]
for shot in shots:
 n=len(shot['narration'].split());selected=words[cursor:cursor+n];cursor+=n
 start=max(0,selected[0]['start']-.10);end=min(len(pcm)/sr,selected[-1]['end']+.18)
 segments.append((start,end,selected))
# Keep 175 seconds overall, but allow an individual line a little more room.
original=[round(s['duration']*fps) for s in shots];minimum=[int(np.ceil((end-start+.55)*fps)) for start,end,_ in segments]
frames=[max(o,m) for o,m in zip(original,minimum)];extra=sum(frames)-sum(original)
while extra>0:
 idx=max(range(len(frames)),key=lambda i:frames[i]-minimum[i])
 if frames[idx]<=minimum[idx]:raise ValueError('Narration is too long for the film; revise the script')
 frames[idx]-=1;extra-=1
mix=np.zeros(round(sum(frames)/fps*sr),dtype=np.float32);cues=[];timeline=0.0
for i,(shot,(start,end,ws)) in enumerate(zip(shots,segments)):
 duration=frames[i]/fps;shot['duration']=duration;shot['voice_source_start']=start;shot['voice_source_end']=end
 offset=timeline+.25;chunk=pcm[int(start*sr):int(end*sr)];dest=int(offset*sr);mix[dest:dest+len(chunk)]=chunk
 group=[]
 for word in ws:
  group.append(word)
  if len(' '.join(w['text'] for w in group))>=36 or len(group)>=7 or word is ws[-1]:
   cues.append((offset+group[0]['start']-start,offset+group[-1]['end']-start,' '.join(w['text'] for w in group)));group=[]
 timeline+=duration
out=ROOT/'output';out.mkdir(exist_ok=True)
subprocess.run([ffmpeg,'-y','-v','error','-f','f32le','-ac','1','-ar',str(sr),'-i','-','-c:a','pcm_s16le',str(out/'narration-aligned.wav')],input=mix.astype('<f4').tobytes(),check=True)
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}'
(out/'captions.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(start)} --> {stamp(end)}\n{text}' for i,(start,end,text) in enumerate(cues))+'\n')
(out/'timeline-aligned.json').write_text(json.dumps(manifest,indent=2))
print(f'{len(cues)} caption cues; {timeline:.2f} seconds; audio aligned without changing voice speed')
