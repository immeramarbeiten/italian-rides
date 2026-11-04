#!/usr/bin/env python3
"""Make editable Remotion assets from a successful live capture and intact voice passages."""
import json,math,re,shutil,subprocess
from pathlib import Path
import imageio_ffmpeg
import imageio.v2 as imageio
root=Path(__file__).resolve().parents[1]; log=json.loads((root/'clips/raw/capture-log.json').read_text())
if log['status']!='success':raise SystemExit('Last capture was not successful; preserve it and record a successful take.')
e={x['name']:x['time'] for x in log['events']};raw=Path(log['video']);ff=imageio_ffmpeg.get_ffmpeg_exe()
if not raw.is_file():raise SystemExit('Raw capture is missing.')
reader=imageio.get_reader(str(raw)); video_duration=reader.get_meta_data()['duration']; reader.close()
# Playwright starts writing the video after the page is created, so wall-clock
# markers lead the media timeline. Calibrate against the final recorded mark.
offset=max(0,e['end']-video_duration)
e={key:max(0,value-offset) for key,value in e.items()}
print('Capture clock offset:',round(offset,3),'seconds',flush=True)
workspace=Path('/private/tmp/italian-rides-video-tools');public=workspace/'film-public';(public/'clips').mkdir(parents=True,exist_ok=True);(public/'voice').mkdir(exist_ok=True)
voice=json.loads((root/'voice-scenes.json').read_text()); specs={x['id']:x for x in voice}
# Cuts remove wait time, not results. All UI footage comes from the unaltered raw take.
ranges={
 'opening':[(e['home'],e['assembly']-.3)],
 'assembly':[(e['assembly']+1,min(e['assembly']+13,e['inspect-entry']-1)),(max(e['assembly']+14,e['inspect-entry']-18),e['inspect-entry']-.5)],
 'entry':[(e['inspect-entry'],e['inspect-submit']+1)],
 'analysis':[(e['agent-ready'],e['agent-run']+1),(max(e['agent-run']+1,e['agent-result']-2),e['agent-result']+2)],
 'confirm':[(e['confirm'],e['request']-.25)],
 'request':[(e['request'],e['garage-draft']-.25)],
 'garage':[(e['garage-draft'],e['tyre-entry']-.3)],
 'tyre':[(e['tyre-entry'],min(e['tyre-agent']+1,e['tyre-result']-.5)),(max(e['tyre-agent']+1,e['tyre-result']-2),e['end']-.3)],
}
notes={'assembly':'ILLUSTRATIVE 3D · TIME SHORTENED','entry':'SIMULATED EXAMPLE','analysis':'SIMULATED EXAMPLE · PROCESSING TIME SHORTENED','confirm':'SIMULATED EXAMPLE','request':'DRAFT ONLY · NO MESSAGE SENT','tyre':'SIMULATED EXAMPLE · PROCESSING TIME SHORTENED'}
scenes=[];provenance=[]
for v in voice:
 id=v['id'];aiff=root/'output/local-voice'/f'{id}.aiff';out=public/'voice'/f'{id}.wav'
 text=subprocess.run(['afinfo',str(aiff)],capture_output=True,text=True,check=True).stdout
 duration=float(re.search(r'estimated duration:\s*([0-9.]+)',text).group(1))
 subprocess.run([ff,'-y','-v','error','-i',str(aiff),'-ar','48000','-ac','1',str(out)],check=True)
 total=math.ceil((duration+2.4)*30)/30;frames=round(total*30)
 scenes.append({'id':id,'title':v['title'],'frames':frames,'note':notes.get(id)})
 if id=='close':continue
 spans=[(max(0,a),b) for a,b in ranges[id] if b-a>0.4]
 if not spans:raise SystemExit('Missing usable footage for '+id)
 inputs=[];filters=[];clips=[]
 for i,(a,b) in enumerate(spans):
  inputs+=['-ss',str(a),'-t',str(b-a),'-i',str(raw)]
  filters.append(f'[{i}:v]setpts=PTS-STARTPTS,scale=1440:810,setsar=1[v{i}]');clips.append(f'[v{i}]')
 length=sum(b-a for a,b in spans);factor=min(1,total/length);extra=max(0,total-length*factor)
 filters.append(''.join(clips)+f'concat=n={len(spans)}:v=1:a=0[joined]')
 filters.append(f'[joined]setpts=(PTS-STARTPTS)*{factor},tpad=stop_mode=clone:stop_duration={extra+0.2},fps=30,format=yuv420p[out]')
 cmd=[ff,'-y','-v','error',*inputs,'-filter_complex',';'.join(filters),'-map','[out]','-t',str(total),'-c:v','libx264','-preset','veryfast','-crf','18','-an',str(public/'clips'/f'{id}.mp4')]
 print('Preparing',id,'from',spans,'speed',round(1/factor,2),flush=True);subprocess.run(cmd,check=True)
 provenance.append({'scene':id,'raw_ranges_seconds':spans,'speed_multiplier':round(1/factor,3),'held_end_seconds':round(extra,3)})
shutil.copy(root/'output/ambient-bed.wav',public/'ambient-bed.wav')
shutil.copy(root/'production/Film.jsx',workspace/'Film.jsx')
(workspace/'film-scenes.json').write_text(json.dumps(scenes,indent=2))
(root/'output/film-edit-manifest.json').write_text(json.dumps({'source':str(raw),'scenes':provenance,'voice':'macOS Daniel; complete passages','seconds':sum(s['frames'] for s in scenes)/30},indent=2))
print('Ready:',workspace/'Film.jsx','duration:',sum(s['frames'] for s in scenes)/30,flush=True)
