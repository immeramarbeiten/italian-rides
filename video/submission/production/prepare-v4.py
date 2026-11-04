#!/usr/bin/env python3
"""Reframe the real opening, keep all prior model footage, and retime the soundtrack."""
from pathlib import Path
import json,subprocess,shutil,imageio_ffmpeg,imageio.v2 as imageio
root=Path(__file__).resolve().parents[1]; work=Path('/private/tmp/italian-rides-video-tools'); public=work/'film-public'; ff=imageio_ffmpeg.get_ffmpeg_exe()
log=json.loads((root/'clips/raw/home-v4-log.json').read_text()); src=Path(log['video']); ev={e['name']:e['time'] for e in log['events']}; reader=imageio.get_reader(str(src)); duration=reader.get_meta_data()['duration']; reader.close(); offset=max(0,ev['end']-duration); ev={k:max(0,v-offset) for k,v in ev.items()}
scenes=json.loads((work/'film-scenes-v3.json').read_text()); scenes[1]['frames']+=60; scenes[2]['frames']+=150
out=public/'clips-v4';out.mkdir(exist_ok=True)
for name,a,b in [('home',ev['home'],ev['carousel']),('carousel',ev['carousel'],ev['end'])]:
 target=next(s['frames'] for s in scenes if s['id']==name)/30
 # Preserve natural timing. Hold the last frame only if there is remaining narration space.
 hold=max(0,target-(b-a)); vf=f'crop=1360:730:40:40,setsar=1,tpad=stop_mode=clone:stop_duration={hold+0.2},fps=30,format=yuv420p'
 subprocess.run([ff,'-y','-v','error','-ss',str(a),'-t',str(b-a),'-i',str(src),'-vf',vf,'-t',str(target),'-an','-c:v','libx264','-preset','veryfast','-crf','18',str(out/f'{name}.mp4')],check=True)
for s in scenes:
 if s['kind']=='screen' and s['id'] not in ('home','carousel'):shutil.copy2(public/'clips-v3'/f"{s['id']}.mp4",out/f"{s['id']}.mp4")
(work/'film-scenes-v4.json').write_text(json.dumps(scenes,indent=2))
shutil.copy(root/'production/Film-v4.jsx',work/'Film-v4.jsx')
# Insert a seven-second instrumental breath between complete sentences (12.10 s).
voice=root/'output/narration-v3-normalized.wav'; score=root/'output/score-v3.wav'; dest=root/'output/score-and-voice-v4.wav'
graph="[0:a]asplit=2[v1][v2];[v1]atrim=0:12.1,asetpts=PTS-STARTPTS[a];anullsrc=r=48000:cl=mono,atrim=0:7[s];[v2]atrim=start=12.1,asetpts=PTS-STARTPTS[b];[a][s][b]concat=n=3:v=0:a=1,apad=pad_dur=8[voice];[1:a]atrim=0:157,volume='0.42+0.18*clip((t-152.5)/2,0,1)':eval=frame,afade=t=out:st=154:d=3[bed];[voice][bed]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.79,aresample=48000,atrim=0:157,volume=0.8[mix]"
subprocess.run([ff,'-y','-v','error','-i',str(voice),'-i',str(score),'-filter_complex',graph,'-map','[mix]','-c:a','pcm_s16le',str(dest)],check=True)
(root/'output/film-v4-edit-manifest.json').write_text(json.dumps({'source_v3':'film-v3-edit-manifest.json','home_recording':str(src),'events':ev,'opening_added_seconds':7,'narration_pause_at_seconds':12.1,'duration':157,'zoom':'agent, mask, guidance and request panels; editorial zoom on recorded footage','outro':'animated sticker based on existing AI-generated representative GTS illustration'},indent=2))
# Retain the sidecar captions and shift every complete caption after the pause.
import re
def shift_time(match):
 h,m,sec,ms=map(int,match.groups()); t=((h*60+m)*60+sec)*1000+ms
 if t>=12100:t+=7000
 return f"{t//3600000:02d}:{t//60000%60:02d}:{t//1000%60:02d},{t%1000:03d}"
(root/'output/captions-v4.srt').write_text(re.sub(r"(\d\d):(\d\d):(\d\d),(\d\d\d)",shift_time,(root/'output/captions-v3.srt').read_text()))
print('v4 media and mix ready',flush=True)
