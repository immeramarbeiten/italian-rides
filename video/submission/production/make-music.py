#!/usr/bin/env python3
"""Small original ambient bed; no external music asset or license required."""
import numpy as np,wave
from pathlib import Path
sr=44100;dur=190;t=np.arange(sr*dur,dtype=np.float32)/sr
# A sparse, slow progression with rounded attacks; deliberately below narration.
chords=[(110,138.59,164.81),(98,123.47,146.83),(87.31,110,130.81),(98,123.47,164.81)]
y=np.zeros_like(t)
for k in range(int(dur/8)+1):
 start=k*8; end=min(dur,start+9);a=int(start*sr);b=int(end*sr)
 local=t[a:b]-start;env=np.minimum(local/1.8,1)*np.minimum((end-start-local)/2,1);env=np.maximum(env,0)
 for j,f in enumerate(chords[k%4]):
  y[a:b]+=env*(np.sin(2*np.pi*f*local)+0.22*np.sin(2*np.pi*2*f*local))*0.012
 # light bell note
 env2=np.exp(-local*1.15);y[a:b]+=0.006*env2*np.sin(2*np.pi*chords[k%4][2]*4*local)
y*=np.minimum(t/4,1)*np.minimum((dur-t)/4,1); y=np.clip(y,-1,1)
p=Path(__file__).resolve().parent/'../output/ambient-bed.wav';p.parent.mkdir(exist_ok=True)
with wave.open(str(p),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes((y*32767).astype('<i2').tobytes())
print(p)
