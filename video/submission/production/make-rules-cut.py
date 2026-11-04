#!/usr/bin/env python3
"""Create a screen-footage-led submission cut from the documented v4 take."""
from pathlib import Path
import json, subprocess, imageio_ffmpeg
root=Path(__file__).resolve().parents[1]; out=root/'output'; ff=imageio_ffmpeg.get_ffmpeg_exe()
v4=out/'italian-rides-demo-v4-final.mp4'
log=json.loads((root/'clips/raw/capture-log.json').read_text()); raw=Path(log['video'])
if log['status']!='success' or 'live endpoints' not in log['mode']:raise SystemExit('Successful live capture required')
# All added visuals are from recorded app interactions; no synthetic response is inserted.
font='/System/Library/Fonts/Supplemental/Arial.ttf'
def badge(text,x,y,when,fontsize=26):
 return f"drawtext=fontfile='{font}':text='{text}':x={x}:y={y}:fontsize={fontsize}:fontcolor=white:box=1:boxcolor=0x142238EE:boxborderw=15:enable='{when}'"
# v4 29.633-33.233: click-through on actual mirror image. 3.6-134.933: main journey.
# Raw 212-225.467: actual tyre-model completion, confirmation and guidance.
# Raw 151-159.6: actual planned garage record.
filters=[
 '[0:v]split=2[p0][p1]',
 '[p0]trim=start=29.633:duration=3.6,setpts=PTS-STARTPTS,fps=30[intro]',
 '[p1]trim=start=3.6:end=134.933,setpts=PTS-STARTPTS,fps=30[main]',
 '[1:v]split=2[r0][r1]',
 '[r0]trim=start=212:duration=13.467,setpts=PTS-STARTPTS,scale=1920:1080,fps=30[models]',
 '[r1]trim=start=151:duration=8.6,setpts=PTS-STARTPTS,scale=1920:1080,fps=30[close]',
 '[intro][main][models][close]concat=n=4:v=1:a=0[base]']
steps=[
 badge('BUILT DURING HACKATHON WEEK',90,75,'between(t,0.2,3.35)',24),
 badge('AI-GENERATED DEMO IMAGE',90,130,'between(t,0.2,3.35)',20),
 badge('META MUSE SPARK 1.3  /  PHOTO UNDERSTANDING',90,875,'between(t,29.85,33.25)',25),
 badge('META SAM 3.1  /  PART SEGMENTATION',90,875,'between(t,33.3,38.6)',25),
 badge('MUSE SPARK 1.3  /  CLOSE-UP UNDERSTANDING',90,875,'between(t,38.65,43.5)',25),
 badge('MUSE SPARK 1.3  /  IMAGE UNDERSTANDING',90,880,'between(t,135.4,146.9)',24),
 badge('SAM 3.1  /  COMPONENT SEGMENTATION',90,935,'between(t,135.4,146.9)',24),
 badge('LIVE MODEL CALLS RECORDED  /  WAIT SHORTENED',90,990,'between(t,135.4,146.9)',19),
 badge('FROM PHOTO TO A REVIEWED NEXT STEP',90,915,'between(t,150.1,156.7)',25)
]
filters.append('[base]'+','.join(steps)+'[video]')
output=out/'italian-rides-demo-hackathon.mp4'
subprocess.run([ff,'-y','-v','error','-i',str(v4),'-i',str(raw),'-filter_complex',';'.join(filters),'-map','[video]','-map','0:a:0','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart','-t','157',str(output)],check=True)
(out/'film-hackathon-edit-manifest.json').write_text(json.dumps({'source_v4':str(v4),'successful_live_capture':str(raw),'opening':{'source':'v4 actual mirror interaction 29.633–33.233','disclosure':'Built during hackathon week; AI-generated demo image'},'model_summary':{'source':'raw actual tyre interaction 212–225.467','model_labels':['muse-spark-1.3: image understanding','sam-3.1: component segmentation']},'closing':{'source':'raw actual garage recording 151–159.6'},'narration':'unchanged from v4','duration_seconds':157},indent=2))
print(output,flush=True)
