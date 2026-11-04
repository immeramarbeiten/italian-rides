#!/usr/bin/env python3
"""Generate each complete passage locally, without cutting words or altering speed."""
import json,subprocess
from pathlib import Path
root=Path(__file__).resolve().parent;out=root/'output'/'local-voice';out.mkdir(parents=True,exist_ok=True)
for s in json.loads((root/'voice-scenes.json').read_text()):
 p=out/(s['id']+'.aiff'); subprocess.run(['say','-v','Daniel','-r','158','-o',str(p),s['text']],check=True)
 if p.stat().st_size<10000:raise RuntimeError('No speech generated; on-device speech service may be unavailable')
 print(s['id'],p.stat().st_size,flush=True)
