import json,re
from PIL import Image
from pathlib import Path
folder=Path(__file__).parent;results=[]
def lum(c):
 v=[n/255 for n in c];v=[n/12.92 if n<=.04045 else ((n+.055)/1.055)**2.4 for n in v];return sum(n*w for n,w in zip(v,[.2126,.7152,.0722]))
for case in json.load(open(folder/'contrast-samples.json')):
 im=Image.open(folder/(case['key']+'.png')).convert('RGB')
 for s in case['samples']:
  values=list(map(float,re.findall(r'[\d.]+',s['color'])));alpha=(values[3] if len(values)>3 else 1)*s['opacity'];bg=im.getpixel((min(im.width-1,s['x']),min(im.height-1,s['y'])));fg=[a*alpha+b*(1-alpha) for a,b in zip(values[:3],bg)];a,b=sorted([lum(fg),lum(bg)]);ratio=(b+.05)/(a+.05);minimum=3 if s['font']>=24 or(s['font']>=18.66 and s['weight']>=700)else 4.5
  results.append({**{k:case[k] for k in ['name','theme','width','strength']},**s,'background':bg,'ratio':round(ratio,2),'minimum':minimum,'pass':ratio>=minimum})
(folder/'contrast-results.json').write_text(json.dumps(results,indent=2))
fails=[r for r in results if not r['pass']];print('samples',len(results),'failures',len(fails))
for r in fails[:70]:print(r['name'],r['theme'],r['width'],r['label'],r['cls'],r['color'],r['background'],r['ratio'])
