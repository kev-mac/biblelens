#!/usr/bin/env python3
"""Check draft quotations only; never mutates drafts, application data or main."""
import argparse, base64, concurrent.futures, datetime, gzip, hashlib, html, io, json, pathlib, re, subprocess, time, urllib.request, zipfile
from html.parser import HTMLParser

OUT=pathlib.Path(__file__).resolve().parent; ROOT=OUT.parents[2]
MANIFEST=json.loads((OUT/'manifest.json').read_text())
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--checkpoint',help='Read immutable records from a Git checkpoint and write a separate regression report')
args=parser.parse_args()
if args.checkpoint:
 assert re.fullmatch(r'[0-9a-f]{7,40}',args.checkpoint),'Use a commit hash'
 records=[r for f in MANIFEST['files'] for r in json.loads(subprocess.check_output(['git','show',args.checkpoint+':'+f['file']],cwd=ROOT))]
else:records=[r for f in MANIFEST['files'] for r in json.loads((ROOT/f['file']).read_text())]
def save(name,value): (OUT/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def norm(s): return ' '.join(s.split())
def fetch(url):
 last=None
 for attempt in range(3):
  try:
   req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 BibleLens quotation verification'})
   with urllib.request.urlopen(req,timeout=35) as r:return r.read()
  except Exception as e: last=e
 raise last
class Plain(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.parts=[];self.stack=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  hidden=any(c in a.get('class','').split() for c in ['notemark','verse','note','footnote','f','fn'])
  if tag not in ['br','hr','img','meta','link','input']:self.stack.append((tag,hidden))
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==tag:self.stack=self.stack[:i];break
 def handle_data(self,data):
  if not any(hidden for _,hidden in self.stack):self.parts.append(data)
def plain(s):
 p=Plain();p.feed(s);return norm(''.join(p.parts))
def verses_html(raw):
 # eBible anchor IDs are not verse labels: e.g. id V31 can display 29b.
 # Always use the visible printed label, preserving lettered verses.
 text=raw.decode('utf-8-sig');parts=re.split(r'<span class="verse" id="V[^\"]+">([^<]*)</span>',text)
 result={}
 for i in range(1,len(parts),2):
  body=parts[i+1].split('<div class="footnote"')[0].split('<div class="footnotes"')[0].split('<ul class=')[0]
  result[html.unescape(parts[i]).strip()]=plain(body)
 return result

cache_path=OUT/'quote-source-cache.json'
cache=json.loads(cache_path.read_text()) if cache_path.exists() else {}
archive_meta={}
for edition,filename in [('grcbrent','grcbrent_html.zip'),('eng-Brenton','eng-Brenton_html.zip')]:
 urls={s['url'] for r in records for s in r.get('sources',[]) if '/'+edition+'/' in s.get('url','')}
 urls.update(re.findall(r'https://ebible\.org/'+edition+r'/[A-Z0-9]+\.htm', '\n'.join(r['text'] for r in records)))
 if all(u in cache and cache[u].get('parserVersion')==3 for u in urls):continue
 try:
  url='https://ebible.org/Scriptures/'+filename;raw=fetch(url);z=zipfile.ZipFile(io.BytesIO(raw))
  archive_meta[edition]={'url':url,'sha256':hashlib.sha256(raw).hexdigest()}
  for u in urls:
   name=u.rsplit('/',1)[1]
   if name in z.namelist():
    data=z.read(name);cache[u]={'verses':verses_html(data),'sha256':hashlib.sha256(data).hexdigest(),'method':'publisher HTML archive','archive':url,'parserVersion':3}
    if name=='PSA058.htm' and edition=='eng-Brenton':cache[u]['fullText']=norm(html.unescape(re.sub('<[^>]*>',' ',data.decode('utf-8-sig'))))
 except Exception as e: print('ARCHIVE ERROR',edition,str(e),flush=True)
save('quote-source-cache.json',cache)

wlc={s['url'] for r in records for s in r.get('sources',[]) if '/get-text/' in s.get('url','')}
wlc.update(re.findall(r'https://bolls\.life/get-text/WLC/\d+/\d+/', '\n'.join(r['text'] for r in records)))
def load_wlc(url):
 if url in cache and not cache[url].get('error'):return url,cache[url]
 try:
  raw=fetch(url);data=json.loads(raw)
  return url,{'verses':{str(v['verse']):norm(re.sub('<[^>]+>','',v['text'])) for v in data},'sha256':hashlib.sha256(raw).hexdigest(),'method':'supplied WLC JSON endpoint'}
 except Exception as e:return url,{'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 for index,(u,value) in enumerate(pool.map(load_wlc,sorted(wlc))):
  cache[u]=value
  if index%25==0:print('WLC sources',index+1,'/',len(wlc),flush=True)
save('quote-source-cache.json',cache)
chapters=json.loads((ROOT/'data/chapters.json').read_text());books=json.loads((ROOT/'data/books.json').read_text())
names={b['name']:b['id'] for b in books};names.update({'Psalm':18,'Psalms':18})
book_re='|'.join(re.escape(x) for x in sorted(names,key=len,reverse=True))
ref_re=re.compile(r'(?:(?P<book>'+book_re+r')\s+)?(?P<c>\d+):(?P<v>\d+)(?P<letter>[a-z]?)(?:[–\-](?P<end>\d+))?')
decoded={}
def kjv(book,c,v):
 key=f'{book}:{c}'
 if key not in decoded:decoded[key]=json.loads(gzip.decompress(base64.b64decode(chapters[key])))
 return next(x['kjv'] for x in decoded[key]['verses'] if x['n']==v)
def record_ref(r):return r['refs'][0]['book']
def context_ref(s,r):
 matches=list(ref_re.finditer(s));last=matches[-1] if matches else None
 if not last:return None
 book=next((m['book'] for m in reversed(matches) if m['book']),None)
 out={'book':names.get(book,record_ref(r)),'chapter':int(last['c']),'verse':int(last['v'])}
 if last['letter']:out['letter']=last['letter']
 if last['end']:out['endVerse']=int(last['end'])
 return out
def result(q,edition,urls,ref=None):
 q=norm(q).strip(' \n.,;:··[]()“”')
 urls=list(dict.fromkeys(urls));hits=[];wrong=[];errors=[]
 if ref:
  chapter=str(ref['chapter'])
  chosen=[u for u in urls if str(int(re.search(r'(\d+)\.htm$',u)[1]))==chapter] if 'Brenton' in edition else [u for u in urls if u.rstrip('/').endswith('/'+chapter)]
  if chosen:urls=chosen
 for u in urls:
  data=cache.get(u,{})
  if data.get('error') or not data:errors.append({'source':u,'error':data.get('error','source not fetched')});continue
  for verse,body in data['verses'].items():
   if edition=='Greek New Testament':
    body=re.sub(r'\d+[A-Za-z0-9-]*','',body)
    body=body.replace('⸀','').replace('⸁','').replace('[*]','')
   if q in norm(body):
    expected=str(ref['verse'])+ref.get('letter','') if ref else None
    target=hits if not ref or verse==expected else wrong
    target.append({'url':u,'verse':verse})
  if ref and ref.get('endVerse'):
   keys=[str(v) for v in range(ref['verse'],ref['endVerse']+1)]
   joined=norm(' '.join(data['verses'].get(v,'') for v in keys))
   if q in joined:hits.append({'url':u,'verses':keys})
 return {'quote':q,'edition':edition,'claimedRef':ref,'result':'PASS' if hits else 'FAIL','matches':hits,'otherVerseMatches':wrong,'sourceErrors':errors,'checkedSources':urls}

reports=[]
footnote_evidence_path=OUT/'quote-correction-source-evidence.json'
footnote_evidence=json.loads(footnote_evidence_path.read_text()) if footnote_evidence_path.exists() else {}
greek_re=re.compile(r'[\u0370-\u03ff\u1f00-\u1fff][\u0370-\u03ff\u1f00-\u1fff\s.,;:··ʼ’᾽\-—“”()\[\]!?]*')
hebrew_re=re.compile(r'[\u0590-\u05ff][\u0590-\u05ff\s.,;:׃|\-—“”()\[\]!?]*')
for r in records:
 checks=[];text=r['text'];primary=record_ref(r)
 for note in r.get('sourceNotes',[]):
  url=note['source'];body=footnote_evidence.get(url,{}).get('fullText','')
  checks.append({'edition':note['edition'],'field':'sourceNotes','source':url,'quote':note['quote'],'result':'PASS' if norm(note['quote']) in norm(body) else 'FAIL','rule':'exact attributed publisher footnote; checked separately from scripture'})
 refs={x['label']:x for x in r.get('refs',[])}
 for side in r.get('sides',[]):
  ref=refs.get(side['ref']);q=side.get('quote','')
  if not q:continue
  good=bool(ref) and q in kjv(ref['book'],ref['chapter'],ref['verse'])
  checks.append({'edition':'KJV','field':'sides','ref':side['ref'],'quote':q,'result':'PASS' if good else 'FAIL','rule':'exact packaged KJV substring and ref listed'})
 for m in re.finditer(r'\bKJV\s+[^“\n]{0,95}“([^”]+)”',text):
  pre=m.group().split('“')[0];ref=context_ref(text[:m.start()]+pre,r)
  if not ref:continue
  q=m[1]
  try:good=q in ' '.join(kjv(ref['book'],ref['chapter'],v) for v in range(ref['verse'],ref.get('endVerse',ref['verse'])+1))
  except (KeyError,StopIteration):good=False
  checks.append({'edition':'KJV','field':'text','claimedRef':ref,'quote':q,'result':'PASS' if good else 'FAIL','rule':'exact packaged KJV substring'})
 sources=[s['url'] for s in r.get('sources',[]) if 'url' in s]+re.findall(r'https://[^\s,)]+',text)
 greek_urls=[u.rstrip('.') for u in sources if '/grcbrent/' in u]
 hebrew_urls=[u.rstrip('.') for u in sources if '/get-text/WLC/' in u]
 nt_urls=[u.rstrip('.') for u in sources if re.search(r'/get-text/(?:TR|SBLGNT|TISCH)/',u)]
 english_urls=[u.rstrip('.') for u in sources if '/eng-Brenton/' in u]
 for m in re.finditer(r'Brenton[’\']?s?(?: own)? English[^“\n]{0,200}“([^”]+)”',text,re.I):
  c=result(m[1],'Brenton English',english_urls,None);c['field']='text';checks.append(c)
 if r['id'].startswith('slay-them-not-lest-my-people'):
  url='https://ebible.org/eng-Brenton/PSA058.htm';footnote=cache.get(url,{}).get('fullText','')
  good='λαοῦ' in footnote and 'people' in footnote
  checks.append({'edition':'Brenton English footnote','field':'variant note','result':'PASS' if good else 'FAIL','source':url,'rule':'publisher footnote contains Greek variant λαοῦ and gloss people'})
 for pattern,edition,urls in [(greek_re,'Brenton Greek',greek_urls),(hebrew_re,'WLC',hebrew_urls)]:
  for m in pattern.finditer(text):
   q=m[0].strip(' \n.,;:··[]()“”')
   if len(re.sub(r'\W','',q))<2:continue
   before=text[:m.start()]
   ref=context_ref(before,r)
   # A reference is dependable only in the prose label immediately preceding
   # the quotation, not a prior language block or a URL.
   tail=re.split(r'[\u0590-\u05ff\u0370-\u03ff\u1f00-\u1fff]',before)[-1]
   tail=re.sub(r'\(KJV [^)]+\)','',tail)
   ref=context_ref(tail,r) if ref_re.search(tail) else None
   vmatch=re.search(r'(?:its\s+)?verse\s+(\d+)\s+reads\s*$',tail)
   if vmatch:
    ref={'chapter':int(re.search(r'(\d+)\.htm',greek_urls[0])[1]),'verse':int(vmatch[1])}
   # Psalm text may say Psalm rather than Psalms; original-language chapter
   # and verse labels are kept as supplied rather than converted to KJV.
   selected_urls=urls;selected_edition=edition
   if edition=='Brenton Greek' and nt_urls and ('New Testament' in tail or not greek_urls):
    selected_urls=nt_urls;selected_edition='Greek New Testament'
   checked=result(q,selected_edition,selected_urls,ref);checked['field']='text';checks.append(checked)
 # Printed-edition omissions: verify the primary verse label is absent.
 if re.search(r'prints-no-verse|prints-no-verses|no-opening-verse|greek-page-omits',r['id']):
  candidates=[u for u in greek_urls if u in cache and not cache[u].get('error')]
  if candidates:
   primary_ref=context_ref(r['ref'],r);expected=primary_ref['verse'];present=[u for u in candidates if str(expected) in cache[u]['verses']]
   checks.append({'edition':'Brenton Greek','field':'omission','verse':expected,'result':'FAIL' if present else 'PASS','pages':candidates,'rule':'primary verse label absent from cited page(s)'})
 if not checks:checks.append({'result':'FAIL','reason':'No machine-verifiable quotation extracted; manual quotation review required'})
 reports.append({'id':r['id'],'ref':r['ref'],'quoteResult':'PASS' if all(c['result']=='PASS' for c in checks) else 'FAIL','checks':checks,'limit':'Quotation check only. Does not verify chapter reading, interpretation, lexical claims, historical claims, or publication readiness.'})
output_name='quote-checks-baseline-'+args.checkpoint+'.json' if args.checkpoint else 'quote-checks.json'
save(output_name,{'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'inputCheckpoint':args.checkpoint,'sourceArchives':archive_meta,'normalization':'KJV: exact packaged substrings. Original-language text: whitespace folding and surrounding editorial punctuation excluded; no Unicode normalization of WLC. HTML verse text excludes publisher footnotes and uses visible verse labels, including lettered verses. NT Strong/morphology annotations and apparatus markers are excluded. Brenton English quoted excerpts are checked with publisher footnotes excluded. Attributed sourceNotes are checked separately against the direct publisher-page evidence.','records':reports})
print(json.dumps({'records':len(reports),'pass':sum(r['quoteResult']=='PASS' for r in reports),'fail':sum(r['quoteResult']=='FAIL' for r in reports),'checks':sum(len(r['checks']) for r in reports),'sourceErrors':{u:d['error'] for u,d in cache.items() if d.get('error')}},indent=2))
