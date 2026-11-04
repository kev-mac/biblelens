import json,pathlib,hashlib,urllib.request,concurrent.futures,time
root=pathlib.Path('/tmp/biblelens345-local');m=json.loads((root/'data/hosted-artwork.json').read_text())
def check(src):
 url='https://raw.githubusercontent.com/kev-mac/biblelens/'+m['sourceCommit']+'/src'+src
 for attempt in range(3):
  try:
   with urllib.request.urlopen(url,timeout=35) as r:b=r.read()
   break
  except urllib.error.HTTPError as e:
   if e.code not in [429,500,502,503,504] or attempt==2:raise
  except (TimeoutError,urllib.error.URLError):
   if attempt==2:raise
 expected=(root/('src'+src)).read_bytes();assert b==expected,src
 return dict(src=src,bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:rows=list(pool.map(check,m['assets']))
out=dict(sourceCommit=m['sourceCommit'],verified=len(rows),totalBytes=sum(r['bytes'] for r in rows),files=rows)
(root/'research/notes/build-345-public-origin-verification-2026-11-04.json').write_text(json.dumps(out,indent=2)+'\n');print('PASS immutable public origin',out['verified'],'files',out['totalBytes'],'bytes')
