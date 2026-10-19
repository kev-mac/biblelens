import json,re,math
from pathlib import Path
p=Path(__file__).parent
xs=[json.loads((p/n).read_text())for n in ['measurements.json','supplemental.json','targeted.json','profiles.json'] if (p/n).exists()]
variants=[v for x in xs for v in x['variants']]
rects={c['variant']:c['width'] for x in xs for r in x['results'] for c in r['controls']}
for v in variants:v['elementWidth']=rects.get(v['id'])
# Locate each matched selector in the checked-in source without changing it.
root=p.parents[2]
files={'style.css':root/'src/style.css','timeline.css':root/'src/components/timeline/TimelineEventCard.css'}
norm={}
for name,f in files.items():
 text=f.read_text();chars=[];offset=[]
 for i,c in enumerate(text):
  if not c.isspace():chars.append(c);offset.append(i)
 norm[name]=(text,''.join(chars),offset)
for v in variants:
 for r in v.get('rules',[]):
  name=r['file'].split('?')[0]
  if name not in norm:continue
  text,flat,offset=norm[name];s=re.sub(r'\s','',r['selector']);pos=flat.find(s+'{')
  if pos<0:pos=flat.find(s)
  r['line']=text.count('\n',0,offset[pos])+1 if pos>=0 else None
  r['file']='src/style.css' if name=='style.css' else 'src/components/timeline/TimelineEventCard.css'
# Alpha composite flat fills; gradients explicitly disqualify certainty.
def rgb(s):
 if s.startswith('color('):return None
 nums=[float(n) for n in re.findall(r'[\d.]+',s)]
 return nums[:3]+([nums[3]]if len(nums)>3 else [1]) if len(nums)>=3 else None
def lum(c):
 a=[n/255 for n in c];a=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in a];return sum(v*w for v,w in zip(a,[.2126,.7152,.0722]))
def ratio(a,b):
 l=sorted([lum(a),lum(b)]);return (l[1]+.05)/(l[0]+.05)
for v in variants:
 bg=[255,255,255];grad=False
 for layer in reversed(v['layers']):
  c=rgb(layer['bg'])
  if c:
   if c[3]==1:grad=False
   bg=[c[i]*c[3]+bg[i]*(1-c[3])for i in range(3)]
  if layer['image']!='none':grad=True
 c=rgb(v['ink'])
 if c:
  fg=[c[i]*c[3]+bg[i]*(1-c[3])for i in range(3)];v['contrast']=round(ratio(fg,bg),2);v['contrastKind']='estimate: gradients present'if grad else 'flat-fill calculation'
(p/'variants.json').write_text(json.dumps(variants,indent=2))
print('variants',len(variants),'unmapped',sum(r['line']is None for v in variants for r in v.get('rules',[])))
print('LOW CONTRAST')
seen=set()
for v in variants:
 k=(v['classes'],v['elementId'],v['theme'],v.get('contrastKind'))
 if v.get('contrast',10)<4.5 and not v['disabled'] and k not in seen:
  seen.add(k);print(v['id'],v['label'][:30],v['classes'],v['theme'],v['contrast'],v['contrastKind'])
print('SMALL TEXT')
seen=set()
for v in variants:
 if float(v['font'][:-2])<12:
  k=(v['classes'],v['elementId'],v['font'])
  if k not in seen:print(v['id'],v['label'][:30],v['classes'],v['font']);seen.add(k)
