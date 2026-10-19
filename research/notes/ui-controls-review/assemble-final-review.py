from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
p=Path(__file__).parent
font='/System/Library/Fonts/Supplemental/Arial.ttf';bold='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
f=lambda n:ImageFont.truetype(font,n);b=lambda n:ImageFont.truetype(bold,n)
sections=[('D5-C — Read category toolbar','D5-C','Shown after scrolling upward. Phone width 375px; row height 48px.'),('D8-A — Visible book grid (same control family as D8-F)','D8-A','The previous crop showed a hidden input. Visible desktop cells are 40px tall.'),('D11-E — Map attribution','D11-E','Current map attribution: 11px text. Keep credits readable and available.'),('D11-M — Timeline sources','D11-M-timeline','Full links, including a wrapping source title. No inline chips.'),('D11-M — Atlas data and attribution links','D11-M-atlas','Complete attribution paragraph and supporting links.')]
height=116+sum(88+Image.open(p/'screenshots'/('corrected-'+id+'.png')).height for _,id,_ in sections)+35
im=Image.new('RGB',(900,height),'#f3f6fb');d=ImageDraw.Draw(im)
d.text((24,18),'Corrected pending previews',font=b(25),fill='#172333')
d.text((24,54),'Existing live UI, recaptured without app changes. Not implementation mockups.',font=f(16),fill='#526179')
d.text((24,80),'Dark theme · your 115% text setting · original-size crops',font=f(15),fill='#526179')
y=116
for title,id,note in sections:
 d.text((24,y),title,font=b(18),fill='#172333');y+=31
 crop=Image.open(p/'screenshots'/('corrected-'+id+'.png')).convert('RGB');im.paste(crop,(24,y));y+=crop.height+10
 d.text((24,y),note,font=f(14),fill='#526179');y+=47
im.save(p/'boards/corrected-pending-previews.png')
