#!/usr/bin/env python3
"""Make a clear, continuous-voice mix with an audible music bed."""
from pathlib import Path
import subprocess,imageio_ffmpeg
root=Path(__file__).resolve().parents[1];o=root/'output';f=imageio_ffmpeg.get_ffmpeg_exe()
subprocess.run([f,'-y','-v','error','-i',str(o/'narration.mp3'),'-af','loudnorm=I=-19:TP=-2:LRA=7,aresample=48000','-c:a','pcm_s16le',str(o/'narration-v3-normalized.wav')],check=True)
graph="[0:a]apad=pad_dur=6[voice];[1:a]atrim=0:150,volume='0.42+0.18*clip((t-145.5)/2,0,1)':eval=frame,afade=t=out:st=147:d=3[bed];[voice][bed]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.79,aresample=48000,atrim=0:150[mix]"
subprocess.run([f,'-y','-v','error','-i',str(o/'narration-v3-normalized.wav'),'-i',str(o/'score-v3.wav'),'-filter_complex',graph,'-map','[mix]','-c:a','pcm_s16le',str(o/'score-and-voice-v3.wav')],check=True)
print(o/'score-and-voice-v3.wav')
