"""Read-only source helpers. All generated research stays beside this file."""
import base64, gzip, hashlib, html, io, json, pathlib, re, urllib.request, zipfile
from html.parser import HTMLParser
HERE=pathlib.Path(__file__).resolve().parent
ROOT=HERE.parents[3]
DATE='2026-10-26'
def read(p):return json.loads((ROOT/p).read_text())
def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
BOOKS=read('data/books.json'); CHAPTERS=read('data/chapters.json')
CODES='GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV'.split()
def book(name):return next(b for b in BOOKS if b['name']==name)
def kjv(name,c):return {str(v['n']):v['kjv'] for v in json.loads(gzip.decompress(base64.b64decode(CHAPTERS[f'{book(name)["id"]}:{c}'])))['verses']}
def page(name,c):return f'{CODES[book(name)["id"]]}{c:03d}' if name=='Psalms' else f'{CODES[book(name)["id"]]}{c:02d}'
def url(name,c,edition='eng-kjv'):return f'https://ebible.org/{edition}/{page(name,c)}.htm'
def fetch(u):
 req=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0 BibleLens draft source verification'})
 with urllib.request.urlopen(req,timeout=45) as r:return r.read()
class Plain(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.parts=[];self.stack=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs); hidden=any(c in a.get('class','').split() for c in ['notemark','verse','note','footnote','f','fn','s'])
  if tag not in ['br','hr','img','meta','link','input']:self.stack.append((tag,hidden))
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==tag:self.stack=self.stack[:i];break
 def handle_data(self,data):
  if not any(h for _,h in self.stack):self.parts.append(data)
def plain(s):
 p=Plain();p.feed(s);return ' '.join(''.join(p.parts).split())
def parse(raw):
 parts=re.split(r'<span class="verse" id="V[^\"]+">([^<]*)</span>',raw.decode('utf-8-sig')); out={}
 for i in range(1,len(parts),2):
  s=parts[i+1].split('<div class="footnote"')[0].split('<div class="footnotes"')[0].split('<ul class=')[0]
  out[html.unescape(parts[i]).strip()]=plain(s)
 return out
ARCHIVES={}
def archive(edition):
 if edition not in ARCHIVES:
  p=HERE/f'{edition}.zip'
  if not p.exists():p.write_bytes(fetch(f'https://ebible.org/Scriptures/{edition}_html.zip'))
  ARCHIVES[edition]=zipfile.ZipFile(p)
 return ARCHIVES[edition]
def source(name,c,edition):
 z=archive(edition); raw=z.read(page(name,c)+'.htm')
 return {'url':url(name,c,edition),'fetched':DATE,'method':'publisher HTML archive; visible verse labels; notes removed','archive_url':f'https://ebible.org/Scriptures/{edition}_html.zip','archive_sha256':hashlib.sha256((HERE/f'{edition}.zip').read_bytes()).hexdigest(),'page_sha256':hashlib.sha256(raw).hexdigest(),'verses':parse(raw)}
def greek_ch(name,c):
 if name!='Psalms':return c
 if c<=8:return c
 if c==10:return 9
 if c<=113:return c-1
 if c in [114,115]:return 113
 if c==116:return 114
 if c<=146:return c-1
 return c
