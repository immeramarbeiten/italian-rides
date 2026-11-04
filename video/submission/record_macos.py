#!/usr/bin/env python3
"""Record an explicit screen rectangle using the existing macOS screen recorder."""
import argparse
import re
import subprocess
from pathlib import Path

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--rect',required=True,help='x,y,width,height in screen points; presentation area only')
parser.add_argument('--seconds',type=int,default=60)
parser.add_argument('--out',required=True)
a=parser.parse_args()
if not re.fullmatch(r'\d+,\d+,[1-9]\d*,[1-9]\d*',a.rect): parser.error('Expected nonnegative x,y and positive width,height')
if not 1 <= a.seconds <= 600: parser.error('seconds must be between 1 and 600')
p=Path(a.out).resolve();p.parent.mkdir(parents=True,exist_ok=True)
if p.exists(): parser.error('Output already exists; choose another filename')
print('Recording the selected rectangle. Use Ctrl-C to stop early. No audio input is requested.',flush=True)
subprocess.run(['screencapture','-v','-k',f'-V{a.seconds}',f'-R{a.rect}',str(p)],check=True)
