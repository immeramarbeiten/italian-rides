#!/usr/bin/env python3
"""Original instrumental score: warm, sparse electronic pulse under narration."""
import numpy as np, wave
from pathlib import Path
sr=44100;seconds=158;n=sr*seconds;t=np.arange(n,dtype=np.float32)/sr;y=np.zeros(n,dtype=np.float32);bpm=98;beat=60/bpm
chords=[(110,138.59,164.81),(98,123.47,146.83),(87.31,110,130.81),(98,123.47,164.81)]
for k in range(int(seconds/(beat*4))+1):
 start=k*beat*4;dur=beat*4.3;a=int(start*sr);b=min(n,int((start+dur)*sr));x=t[a:b]-start;env=np.minimum(x/.45,1)*np.minimum((dur-x)/.65,1);env=np.maximum(env,0)
 for j,f in enumerate(chords[k%4]):y[a:b]+=0.045*env*(np.sin(2*np.pi*f*x)+.12*np.sin(2*np.pi*f*2*x))
for k in range(int(seconds/beat)+1):
 start=k*beat;a=int(start*sr);b=min(n,a+int(sr*.26));x=t[a:b]-start;env=np.exp(-x*20)
 y[a:b]+=.075*env*np.sin(2*np.pi*(58*x+45*x*np.exp(-x*24)))
 if k%2==1:
  rng=np.random.default_rng(200+k);noise=rng.standard_normal(len(x)).astype(np.float32);y[a:b]+=.009*np.exp(-x*30)*noise
for k in range(int(seconds/(beat/2))+1):
 start=k*beat/2;a=int(start*sr);b=min(n,a+int(sr*.12));x=t[a:b]-start;rng=np.random.default_rng(800+k);noise=rng.standard_normal(len(x)).astype(np.float32);y[a:b]+=.009*np.exp(-x*45)*(noise-np.roll(noise,1))
y*=np.minimum(t/1.8,1)*np.minimum((seconds-t)/3,1);y=np.clip(y,-.92,.92)
out=Path(__file__).resolve().parents[1]/'output/score-v3.wav';out.parent.mkdir(exist_ok=True)
with wave.open(str(out),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes((y*32767).astype('<i2').tobytes())
print(out,flush=True)
