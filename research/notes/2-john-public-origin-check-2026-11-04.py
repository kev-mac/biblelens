import concurrent.futures,hashlib,json,pathlib,urllib.request
j=json.loads(pathlib.Path('data/hosted-artwork.json').read_text())
def check(src):
 data=urllib.request.urlopen('https://raw.githubusercontent.com/kev-mac/biblelens/'+j['sourceCommit']+'/src'+src,timeout=60).read()
 expected=pathlib.Path('src'+src).read_bytes()
 assert data==expected,src
 return {'src':src,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool: rows=list(pool.map(check,j['assets']))
r={'pin':j['sourceCommit'],'assets':len(rows),'bytes':sum(x['bytes'] for x in rows),'passed':True,'results':rows}
pathlib.Path('research/notes/2-john-public-origin-verification-2026-11-04.json').write_text(json.dumps(r,indent=2)+'\n')
print({k:v for k,v in r.items() if k!='results'})
