#!/usr/bin/env python3
"""Prepare v3 from unaltered recordings and one continuous original voiceover."""
from pathlib import Path
import imageio_ffmpeg,imageio.v2 as imageio,json,subprocess,shutil,math
root=Path(__file__).resolve().parents[1];work=Path('/private/tmp/italian-rides-video-tools');public=work/'film-public';clips=public/'clips-v3';clips.mkdir(parents=True,exist_ok=True);ff=imageio_ffmpeg.get_ffmpeg_exe()
intro=json.loads((root/'clips/raw/intro-log.json').read_text());intro_video=Path(intro['video']);events={e['name']:e['time'] for e in intro['events']};r=imageio.get_reader(str(intro_video));dur=r.get_meta_data()['duration'];r.close();off=max(0,events['end']-dur);events={k:max(0,v-off) for k,v in events.items()}
main=json.loads((root/'clips/raw/capture-log.json').read_text());main_raw=Path(main['video']);m={e['name']:e['time'] for e in main['events']};r=imageio.get_reader(str(main_raw));duration=r.get_meta_data()['duration'];r.close();offset=max(0,m['end']-duration);m={k:max(0,v-offset) for k,v in m.items()}
edited=root/'clips/edited';assets={
 'home':[(intro_video,events['home'],events['carousel'])],
 'carousel':[(intro_video,events['carousel'],min(events['carousel']+7.5,events['inspect-top']-.3))],
 'entry':[(intro_video,events['inspect-top'],events['open-examples']+1),(intro_video,events['choose-image']-1.4,events['image-selected'])],
 'agent':[(edited/'analysis.mp4',0,8.1)],
 'mask':[(main_raw,m['agent-result']-1,m['confirm']-.4)],
 'confirm':[(edited/'confirm.mp4',0,10)],
 'assembly':[(edited/'assembly-better-framed.mp4',0,16.7)],
 'request':[(edited/'request.mp4',0,12)],
 'garage':[(edited/'garage.mp4',0,15.8)],
 'tyre':[(edited/'tyre.mp4',0,15.9)]}
# Boundaries match the natural paragraph boundaries in the continuous ElevenLabs take.
times=[('intro',0,3.6,'intro',None,None),('home',3.6,9.76,'screen','Explore Italian Rides',None),('carousel',9.76,15.6,'screen','A living archive',None),('entry',15.6,22.64,'screen','Start with a photo',None),('agent',22.64,39.0,'screen','The agent investigates','PROCESSING TIME SHORTENED'),('mask',39.0,54.6,'screen','Focus on what matters',None),('confirm',54.6,66.36,'screen','Review the suggestion',None),('assembly',66.36,78.613,'screen','Understand the assembly','ILLUSTRATIVE 3D STUDY'),('request',78.613,99.947,'screen','Prepare a workshop request','DRAFT ONLY · NOT SENT'),('garage',99.947,115.547,'screen','Keep the decision',None),('tyre',115.547,127.92,'screen','Another part. Same journey.','PROCESSING TIME SHORTENED'),('system',127.92,141.413,'system',None,None),('outro',141.413,150.0,'outro',None,None)]
scenes=[];edits=[]
for id,start,end,kind,label,note in times:
 frames=round(end*30)-round(start*30);target=frames/30;scenes.append({'id':id,'frames':frames,'kind':kind,'label':label,'note':note})
 if kind!='screen':continue
 spans=assets[id];args=[];filters=[];parts=[]
 for index,(p,a,b) in enumerate(spans):
  if not p.exists():raise SystemExit(f'Missing recorded source: {p}')
  args += ['-ss',str(a),'-t',str(b-a),'-i',str(p)]
  filters += [f'[{index}:v]crop=1360:730:40:40,setpts=PTS-STARTPTS,setsar=1[v{index}]'];parts.append(f'[v{index}]')
 length=sum(b-a for p,a,b in spans);factor=min(1,target/length);hold=max(0,target-length*factor)
 filters.append(''.join(parts)+f'concat=n={len(parts)}:v=1:a=0[j]');filters.append(f'[j]setpts=(PTS-STARTPTS)*{factor},tpad=stop_mode=clone:stop_duration={hold+.3},fps=30,format=yuv420p[out]')
 subprocess.run([ff,'-y','-v','error',*args,'-filter_complex',';'.join(filters),'-map','[out]','-t',str(target),'-c:v','libx264','-preset','veryfast','-crf','18','-an',str(clips/f'{id}.mp4')],check=True)
 edits.append({'scene':id,'sources':[{'path':str(p),'start':round(a,3),'end':round(b,3)} for p,a,b in spans],'speed':round(1/factor,3),'hold_seconds':round(hold,3)});print(id,'ready',flush=True)
shutil.copy(root/'output/narration.mp3',public/'narration-v3.mp3');shutil.copy(root/'output/score-v3.wav',public/'score-v3.wav');shutil.copy(root.parents[1]/'public/fixtures/ai-gts-mirror-cracked-simulated-v2.png',public/'fixture.png')
shutil.copy(root/'production/Film-v3.jsx',work/'Film-v3.jsx');(work/'film-scenes-v3.json').write_text(json.dumps(scenes,indent=2));(root/'output/film-v3-edit-manifest.json').write_text(json.dumps({'voice':'ElevenLabs Ian, continuous original take, no speech cuts','music':'Original synthesized score-v3','duration':sum(x['frames'] for x in scenes)/30,'edits':edits},indent=2));print('Ready to render',flush=True)
