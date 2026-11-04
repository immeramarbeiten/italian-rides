#!/usr/bin/env python3
"""Export word-timed captions from the original continuous voice transcript."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1];words=json.loads((root/'output/voice-words.json').read_text())['words'];groups=[];current=[]
for w in words:
 current.append(w)
 if len(current)>=7 or len(' '.join(x['text'] for x in current))>=44 or (w['text'].endswith(('.', '?', '!')) and len(current)>=3):groups.append(current);current=[]
if current:groups.append(current)
def time(t):
 n=round(t*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
out=root/'output/captions-v3.srt';out.write_text('\n\n'.join(f"{i}\n{time(g[0]['start'])} --> {time(g[-1]['end'])}\n"+' '.join(x['text'] for x in g) for i,g in enumerate(groups,1))+'\n');print(f'{len(groups)} captions: {out}')
