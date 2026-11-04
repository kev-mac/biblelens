import json,urllib.request,hashlib,concurrent.futures,time,os
from pathlib import Path
os.chdir(Path(__file__).resolve().parents[3]);m=json.load(open('data/hosted-artwork.json'));prefix='https://raw.githubusercontent.com/kev-mac/biblelens/'+m['sourceCommit']+'/src'
def check(src):
 b=open('src'+src,'rb').read();row={'src':src,'url':prefix+src,'sourceBytes':len(b),'sourceSha256':hashlib.sha256(b).hexdigest()}
 try:
  with urllib.request.urlopen(urllib.request.Request(prefix+src,headers={'Accept':'image/webp'}),timeout=45) as r:got=r.read();status=r.status
  row.update(status=status,publicBytes=len(got),publicSha256=hashlib.sha256(got).hexdigest(),match=got==b)
 except Exception as e:row.update(error=str(e),match=False)
 return row
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as e:rows=list(e.map(check,m['assets']))
report={'pin':m['sourceCommit'],'actualPublicOrigin':True,'checked':len(rows),'matched':sum(x['match'] for x in rows),'bytes':sum(x.get('publicBytes',0) for x in rows),'rows':rows};json.dump(report,open('research/notes/1-peter-artwork-2026-11-04/public-origin-verification.json','w'),indent=2);print({k:v for k,v in report.items() if k!='rows'});print([r for r in rows if not r['match']][:5]);assert all(x['match'] for x in rows)
