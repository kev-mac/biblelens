"""Import reviewed public-domain snapshots. Usage: python3 scripts/import-lost-books.py SNAPSHOT_DIR.
Requires beautifulsoup4. Network acquisition and verification evidence stay outside the app.
"""
import sys,json,re,hashlib,zipfile,pathlib,collections
from bs4 import BeautifulSoup
root=pathlib.Path(sys.argv[1]); books=[]; chapters={}; checks=[]
def norm(x):return re.sub(r'\s+',' ',x).strip()
def snap(file,url):
 b=(root/file).read_bytes();return {'url':url,'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b)}
def add(name,code,collection,edition,year,translator,source,description,reference,text,numbering='Source chapter and verse numbers retained.'):
 ident=66+len(books);meta=dict(id=ident,name=name,code=code,testament='Lost',collection=collection,edition=edition,editionYear=year,translator=translator,license='Public domain',licenseUrl=source['url'],source=source,description=description,descriptionSource=reference,numbering=numbering,chapters=len(text),sourceChapters=list(text),verseCounts=[len(v) for v in text.values()])
 meta['textSha256']=hashlib.sha256(json.dumps(text,ensure_ascii=False,sort_keys=True).encode()).hexdigest();books.append(meta)
 for index,(sourceChapter,verses) in enumerate(text.items(),1):
  chapters[f'{ident}:{index}']=dict(book=ident,name=name,chapter=index,sourceChapter=sourceChapter,chapterName=(f'Source chapter {sourceChapter}. Reading chapter {index}.' if sourceChapter!=index else ''),collection=collection,editionLabel=f'{collection} · {edition}',verses=[dict(n=n,kjv=t,referenceLinks={'kjv':[],'web':[],'asv':[]},redLetters={}) for n,t in verses.items()])
 return meta
z=zipfile.ZipFile(root/'eng-kjv_vpl.zip');raw=z.read('eng-kjv_vpl.txt').decode('utf-8-sig');vpl=collections.defaultdict(lambda:collections.defaultdict(dict))
for line in raw.splitlines():
 m=re.match(r'(\S+) (\d+):(\d+) (.+)',line)
 if m:vpl[m[1]][int(m[2])][int(m[3])]=m[4]
# Independent Project Gutenberg KJV digitisation, not a copy of the eBible archive.
s=BeautifulSoup((root/'kjv-second.txt').read_text(),'html.parser');second={}
for div in s.select('div.chapter'):
 h=div.find('h2'); a=h.find('a') if h else None
 if not a:continue
 parsed=collections.defaultdict(dict)
 for p in div.find_all('p'):
  m=re.match(r'(\d+):(\d+)\s+(.+)',norm(p.get_text(' ',strip=True)))
  if m:parsed[int(m[1])][int(m[2])]=m[3]
  elif a.get('id')=='chap10':
   m=re.match(r'(\d+)\s+(.+)',norm(p.get_text(' ',strip=True)))
   if m:parsed[1][int(m[1])]=m[2]
 second[a.get('id')]=dict(parsed)

# Gutenberg prints Jeremiah's letter separately; KJV includes it as Baruch 6.
order=[('TOB','Tobit','chap03'),('JDT','Judith','chap04'),('ESG','Rest of Esther','chap05'),('WIS','Wisdom of Solomon','chap06'),('SIR','Ecclesiasticus','chap07'),('BAR','Baruch','chap08'),('PRA','Song of the Three Children','chap10'),('SUS','Susanna','chap11'),('BEL','Bel and the Dragon','chap12'),('1MA','1 Maccabees','chap14'),('2MA','2 Maccabees','chap15'),('1ES','1 Esdras','chap01'),('PRM','Prayer of Manasseh','chap13'),('4ES','2 Esdras','chap02')]
source=snap('eng-kjv_vpl.zip','https://ebible.org/Scriptures/eng-kjv_vpl.zip')
descriptions=[
'A family story from the KJV Apocrypha.',
'Judith’s story of war, printed in the KJV Apocrypha.',
'More of Esther’s story, printed in the KJV Apocrypha.',
'Advice on wisdom and justice, printed in the KJV Apocrypha.',
'Wise sayings on daily life, printed in the KJV Apocrypha.',
'Prayers and counsel in exile, printed in the KJV Apocrypha.',
'A prayer and song from Daniel’s story, printed in the KJV Apocrypha.',
'A story of Susanna’s trial, printed in the KJV Apocrypha.',
'Two more Daniel stories, printed in the KJV Apocrypha.',
'An account of wars in Judea, printed in the KJV Apocrypha.',
'An account of Judean struggles, printed in the KJV Apocrypha.',
'Stories of exile and return, printed in the KJV Apocrypha.',
'A prayer of remorse, printed in the KJV Apocrypha.',
'Visions and questions about justice, printed in the KJV Apocrypha.']
import xml.etree.ElementTree as ET
xmlCounts=collections.defaultdict(lambda:collections.defaultdict(list))
for v in ET.fromstring(z.read('eng-kjv_vpl.xml')):
 xmlCounts[v.attrib['b']][int(v.attrib['c'])].append(int(v.attrib['v']))
for code,name,pg in order:
 text=dict(vpl[code]);other=second[pg]
 assert {c:list(v) for c,v in text.items()}==dict(xmlCounts[{'PRA':'S3Y','PRM':'MAN','4ES':'2ES'}.get(code,code)]),code+' archive XML count mismatch'
 if code=='BAR':other={**other,6:next(iter(second['chap09'].values()))}
 # eBible's Esther starts at chapter 10 verse 4; the reader uses chapters 1–7,
 # and always displays the printed source chapter alongside its reading chapter.
 if code=='SIR':
  merged=other[44][22];split=merged.index('He acknowledged');other[44][22]=merged[:split].strip();other[44][23]=merged[split:]
 if code=='PRM':
  prayer=norm(s.find(id='chap13').parent.parent.get_text(' ',strip=True))
  assert 'O Lord, Almighty God' in prayer and 'all the powers of the heavens' in prayer
  other=text # Gutenberg has the full prayer without verse divisions; VPL/XML provide 15.
 expected={c:list(v) for c,v in text.items()};actual={c:list(v) for c,v in other.items()}
 if expected!=actual:print('COUNT DIFFERENCE',name,[(k,len(v),list(v)[:2]) for k,v in text.items()],[(k,len(v),list(v)[:2]) for k,v in other.items()]);raise ValueError(name+' count mismatch')
 meta=add(name,code,'Apocrypha','KJV',1769,'King James Version translators',source,descriptions[[r[0] for r in order].index(code)],'https://www.gutenberg.org/ebooks/124.html.images#'+pg,text)
 meta['traditionNote']='Greek and Russian Orthodox churches include it in their Bibles.' if code in ['1ES','PRM'] else 'Russian Orthodox Bibles list this as 3 Esdras.' if code=='4ES' else 'Catholic, Greek and Russian Orthodox churches include this book.'
 meta['traditionSource']='https://www.stgeorgeto.org/old-testament-apocrypha/' if code=='4ES' else 'https://ebible.org/engwebp/FRT01.htm'
 meta['licenseUrl']='https://ebible.org/eng-kjv/copyright.htm';meta['licenseNote']='Public domain in the United States; the source retains the UK royal-prerogative notice.'
 meta['archiveCountVerification']='VPL chapter and verse locators match the archive XML exactly.'
 meta['countVerification']={**snap('kjv-second.txt','https://www.gutenberg.org/ebooks/124.html.images'),'chapterVerseCounts':'Verse locators match after mapping: Epistle of Jeremiah is Baruch 6; Gutenberg Sirach 44:22 combines eBible 44:22–23.'}
 if code=='PRM':meta['countVerification']['chapterVerseCounts']='Gutenberg prints the full prayer without verse divisions; eBible VPL and XML agree on 1 chapter, 15 verses.'
 # Compare one passage from every book, retaining exact strings and differences.
 c=next(iter(text));n=next(iter(text[c]));a=text[c][n];b=other[c][n] if code!='PRM' else prayer[prayer.index('O Lord, Almighty God'):prayer.index('O Lord, Almighty God')+len(a)]
 checks.append(dict(collection='Apocrypha',book=name,chapter=c,verse=n,sourceText=a,comparisonText=b,match=re.sub(r'[^a-z]','',a.lower())==re.sub(r'[^a-z]','',b.lower()),comparisonUrl='https://www.gutenberg.org/ebooks/124.html.images#'+pg))
# Jubilees pending: alternate transcription has duplicate verse labels (2:19, 2:22).
# Gnostic texts: one reading chapter, numbered paragraphs; source page numerals
# and textual gaps remain in the text. Section headings and translator notes excluded.
for slug,name in [('thomas','Gospel of Thomas'),('philip','Gospel of Philip'),('truth','Gospel of Truth'),('mary','Gospel of Mary'),('judas','Gospel of Judas'),('james','Secret Book of James')]:
 s=BeautifulSoup((root/f'mattison-{slug}.html').read_text(),'html.parser').select_one('.sqs-html-content');ps=s.find_all(['p','h1','h2','h3'],recursive=False);active=False;verses={};sections=[]
 assert 'committed to the public domain' in s.get_text()
 for p in ps:
  t=norm(p.get_text(' ',strip=True))
  if not t:continue
  if slug=='mary' and t=='Pages 1 through 6 are missing.':active=True
  if t in ['Prologue','Gentiles, Hebrews, and Christians','An Eternal Perspective','Introduction','Salutation']:active=True
  if not active:continue
  if t in ['Notes on Translation','Notes','Translation Notes','Translator’s Notes','Translator\'s Notes']:break
  # Section labels consist entirely of bold/italic text. Keep missing-page notices.
  strong=p.find('strong')
  if strong and norm(strong.get_text(' ',strip=True))==t:sections.append(t);continue
  if p.name!='p':continue
  verses[len(verses)+1]=t
 meta=add(name,'Lost'+slug,'Gnostic','Mattison',None,'Mark M. Mattison',snap(f'mattison-{slug}.html',f'https://www.gospels.net/{slug}'),{'thomas':'Sayings linked to Jesus, preserved outside the New Testament in a Coptic collection.','philip':'Reflections on faith and sacred rites from a Coptic collection outside the New Testament.','truth':'Reflections on truth and knowledge from a Coptic collection outside the New Testament.','mary':'Mary shares a vision with the disciples in a text outside the New Testament.','judas':'Jesus speaks with Judas in a text outside the New Testament.','james':'James recounts secret teachings from Jesus in a text outside the New Testament.'}[slug],f'https://www.gospels.net/{slug}',{1:verses},'One reading chapter. Verse numbers count paragraphs, not ancient verses. Source page numbers and gaps remain. Section headings omitted.')
 meta['editionYearNote']='Undated web edition; retrieved 2026-10-30. No publication year inferred.';meta['sections']=sections
pathlib.Path('data/lost-books').mkdir(exist_ok=True)
pathlib.Path('data/lost-books/books.json').write_text(json.dumps(books,ensure_ascii=False,indent=2)+'\n');pathlib.Path('data/lost-books/chapters.json').write_text(json.dumps(chapters,ensure_ascii=False,separators=(',',':'))+'\n');(root/'apocrypha-spot-checks.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2)+'\n');print('Imported',len(books),'books',len(chapters),'chapters');print([(b['name'],b['chapters'],sum(b['verseCounts'])) for b in books])
