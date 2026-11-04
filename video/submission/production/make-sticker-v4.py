from PIL import Image,ImageDraw,ImageFilter
from pathlib import Path
root=Path(__file__).resolve().parents[3]
im=Image.open(root/'public/frieze/ill-vespa-gts.jpg').convert('RGB')
# Remove only near-white pixels connected to the exterior; white bodywork stays opaque.
mask=im.convert('L').point(lambda x:255 if x>=246 else 0)
ImageDraw.floodfill(mask,(0,0),128,thresh=0)
alpha=mask.point(lambda x:0 if x==128 else 255).filter(ImageFilter.GaussianBlur(.5))
pad=32; sticker=Image.new('RGBA',(im.width+pad*2,im.height+pad*2)); a=Image.new('L',sticker.size);a.paste(alpha,(pad,pad));outline=a.filter(ImageFilter.MaxFilter(31));sticker.paste((255,255,255,255),(0,0,*sticker.size),outline);im.putalpha(alpha);sticker.alpha_composite(im,(pad,pad));sticker.thumbnail((1300,1000),Image.Resampling.LANCZOS)
out=Path('/private/tmp/italian-rides-video-tools/film-public/scooter-sticker-v4.png');sticker.save(out)
print(out)
