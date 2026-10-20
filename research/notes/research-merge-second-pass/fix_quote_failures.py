#!/usr/bin/env python3
"""Repair the 28 checkpoint quotation failures without accepting the findings.

Reproduction: merge.py, this script, check_quotes.py, finalize.py.
The original checkpoint and verbatim source notes remain available in Git.
"""
import base64, copy, gzip, hashlib, html, json, pathlib, re, subprocess, urllib.request
OUT=pathlib.Path(__file__).resolve().parent;ROOT=OUT.parents[2]
CHECKPOINT='4fe1e7d'
def norm(s):return ' '.join(s.split())
def digest(data):return hashlib.sha256(data).hexdigest()
def saved(name):return json.loads((OUT/name).read_text())
def write(path,obj):path.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
def checkpoint_json(path):return json.loads(subprocess.check_output(['git','show',CHECKPOINT+':'+path],cwd=ROOT))
assert subprocess.check_output(['git','branch','--show-current'],cwd=ROOT,text=True).strip()=='research-merge-second-pass'
report_path='research/notes/research-merge-second-pass/'
baseline=checkpoint_json(report_path+'quote-checks.json')
failures={r['id']:r for r in baseline['records'] if r['quoteResult']=='FAIL'}
assert len(failures)==28
held_before=(OUT/'undecided.json').read_bytes()
cache=saved('quote-source-cache.json');manifest=saved('manifest.json')
provenance=saved('field-provenance.json');base_prov={p['id']:p for p in checkpoint_json(report_path+'field-provenance.json')}
chapters=json.loads((ROOT/'data/chapters.json').read_text());decoded={}
def kjv(ref):
 key=str(ref['book'])+':'+str(ref['chapter'])
 if key not in decoded:decoded[key]=json.loads(gzip.decompress(base64.b64decode(chapters[key])))
 return ' '.join(next(v['kjv'] for v in decoded[key]['verses'] if v['n']==n) for n in range(ref['verse'],ref.get('endVerse',ref['verse'])+1))
def source(url,verse,end=None):return ' '.join(cache[url]['verses'][str(v)] for v in range(verse,(end or verse)+1))

# Verify footnotes independently at the publisher's cited pages. Keep them out
# of scripture quotation bodies; do not remove them from the research evidence.
english_pages=['1SA26','1SA29','1SA02','2KI21','JER03']
evidence={}
for page in english_pages:
 url='https://ebible.org/eng-Brenton/'+page+'.htm'
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 BibleLens quotation correction'})
 raw=urllib.request.urlopen(req,timeout=35).read()
 full=norm(html.unescape(re.sub('<[^>]*>',' ',raw.decode('utf-8-sig'))))
 evidence[url]={'sha256':digest(raw),'fullText':full,'method':'direct publisher page; footnotes retained'}
 if url in cache:cache[url]['fullText']=full
write(OUT/'quote-correction-source-evidence.json',evidence)
write(OUT/'quote-source-cache.json',cache)

notes={
 'king-of-israel-come-out':('1SA26',20,['Gr. the face of the Lord.']),
 'achish-david-with-me':('1SA29',3,['The word עכר is here translated; as in Gen. 14. 13.','Gr. to or days.']),
 'hannah-song':('1SA02',10,["Perhaps 'and the Lord executes,' etc. Comp. Jer. 9. 24."]),
 'manasseh-made-his-son':('2KI21',6,['Lit. peculiar places cut off.','Alex. θελητὴν.']),
}
logs=[];changed_ids=[]
for item in manifest['files']:
 path=ROOT/item['file'];current=json.loads(path.read_text());base={r['id']:r for r in checkpoint_json(item['file'])}
 for idx,current_record in enumerate(current):
  rid=current_record['id']
  if rid not in failures:continue
  old=base[rid];r=copy.deepcopy(old);changes=[]
  bad=[c for c in failures[rid]['checks'] if c['result']=='FAIL']

  # KJV prose excerpts: preserve their extent where capitalization, apostrophe,
  # leading ellipsis or a terminal editorial full stop is the only difference.
  for check in bad:
   if check['edition']=='KJV' and check['field']=='text':
    q=check['quote'];ref=check['claimedRef'];expected=kjv(ref)
    candidates=[q.replace('’',"'"),q.replace('’',"'").lstrip('…'),q.replace('’',"'").rstrip('.'),q.replace('’',"'").lstrip('…').rstrip('.')]
    match=next((m for candidate in candidates if candidate for m in [re.search(re.escape(candidate),expected,re.I)] if m),None)
    replacement=expected[match.start():match.end()] if match else expected
    assert q in r['text'],(rid,q)
    r['text']=r['text'].replace(q,replacement)
    changes.append({'field':'text','reason':'Restore exact packaged KJV wording/punctuation without changing application scripture','source':'data/chapters.json','ref':ref,'before':q,'after':replacement})

  if rid.startswith('there-were-they'):
   a=next(s for s in r['sides'] if s['ref']=='Psalms 14:5')
   a['quote']=kjv({'book':18,'chapter':14,'verse':5})
   r['sides'].insert(1,{'label':'A','ref':'Psalms 14:6','quote':kjv({'book':18,'chapter':14,'verse':6})})
   r['text']=r['text'].replace('” 14:6: “','” KJV Psalm 14:6: “')
   changes.append({'field':'sides','reason':'Split the two-verse quotation into exact verse-specific sides; retain both verses.'})

  if rid.startswith('branch-of-righteousness'):
   for side in r['sides']:
    if side['ref']=='Jeremiah 33:14' and side['quote'].startswith('In those days'):side['ref']='Jeremiah 33:15'
   # Label the retained verse 18 quotation independently so it is checked too.
   r['text']=r['text'].replace('KJV Jeremiah 33:17-18:', 'KJV Jeremiah 33:17:').replace('Israel;” “Neither shall','Israel;” KJV Jeremiah 33:18: “Neither shall')
   changes.append({'field':'sides','reason':'Branch quotation belongs to Jeremiah 33:15, not 33:14; verse already present in refs.'})
   changes.append({'field':'text','reason':'Give the adjacent 33:18 quotation its own explicit KJV label.'})
  if rid.startswith('hazor-a-dwelling'):
   for side in r['sides']:
    if side['quote'].startswith('And Hazor'):side['ref']='Jeremiah 49:33'
   changes.append({'field':'sides','reason':'Hazor quotation belongs to 49:33, not 49:28; both references retained.'})

  for check in bad:
   if check['edition']=='KJV' and check['field']=='sides' and not rid.startswith(('there-were-they','branch-of-righteousness','hazor-a-dwelling')):
    side=next(s for s in r['sides'] if s['ref']==check['ref'] and s['quote']==check['quote'])
    ref=next(x for x in r['refs'] if x['label']==side['ref']);expected=kjv(ref)
    match=re.search(re.escape(side['quote'].replace('’',"'")),expected,re.I)
    assert match,(rid,side)
    side['quote']=expected[match.start():match.end()]
    changes.append({'field':'sides','reason':'Match exact packaged capitalization/apostrophe at the existing side reference.'})

  # WLC: copy the supplied edition's Unicode characters exactly, not by
  # normalizing or retyping the Hebrew. Full verses replace reconstructed tails.
  for check in bad:
   if check['edition']=='WLC' and check['quote']!='עכר':
    ref=check['claimedRef'];url=check['checkedSources'][0]
    replacement=source(url,ref['verse'],ref.get('endVerse'))
    assert check['quote'] in r['text']
    r['text']=r['text'].replace(check['quote'],replacement)
    for chapter,verse in [(3,12),(17,4)]:
     r['text']=r['text'].replace(f'Hebrew (WLC) {chapter}:{verse} ends:',f'Hebrew (WLC) {chapter}:{verse}:')
    changes.append({'field':'text','reason':'Replace reconstructed Hebrew with exact supplied WLC verse text; no Unicode normalization','source':url,'before':check['quote'],'after':replacement})

  if rid.startswith('where-is-he-that-counted'):
   q=next(c['quote'] for c in bad if c['edition']=='Brenton Greek')
   replacement=source('https://ebible.org/grcbrent/ISA33.htm',18)
   r['text']=r['text'].replace(q,replacement)
   # Keep the following phrase as verse 19 rather than deleting it or pretending
   # it belongs to verse 18. Its Greek punctuation is copied from the page.
   following=source('https://ebible.org/grcbrent/ISA33.htm',19).split('ᾧ')[0].rstrip()
   r['text']=r['text'].replace(replacement+'. [Where',replacement+' Brenton Greek Isaiah 33:19 opening: '+following+' [Where')
   r['refs'].append({'label':'Isaiah 33:19','book':22,'chapter':33,'verse':19})
   r['scope']+=' Quote correction: “small and great people” is printed at Greek Isaiah 33:19, continuing the question begun at 33:18; it is not part of the printed verse 18 quotation.'
   changes.append({'field':'text','reason':'Split the Greek verse-18/19 quotation at the publisher’s printed boundary; retain both parts and exact punctuation.'})
   changes.append({'field':'refs','reason':'Add 33:19 as context for the retained continuation.'})
   changes.append({'field':'scope','reason':'Clarify the printed Greek verse boundary.'})

  if rid.startswith(('his-son-and-his-sons-son','branch-of-righteousness','egypt-and-judah-and-edom')):
   assert 'ΙΕΡΕΜΙΑΣ' in r['text']
   r['text']=r['text'].replace(' ΙΕΡΕΜΙΑΣ <','').replace(' ΙΕΡΕΜΙΑΣ','')
   changes.append({'field':'text','reason':'Remove the copied page-navigation heading from the scripture quote; original copy retained in checkpoint history.'})

  if rid.startswith('because-of-manasseh'):
   r['text']=r['text'].replace('(Brenton Greek, printed as Jeremiah 38) 29-30:', '(Brenton Greek) Jeremiah 38:29-30:')
   changes.append({'field':'text','reason':'Supply the full Greek chapter-and-verse range; the unchanged Greek quotation spans both 38:29 and 38:30.'})

  for prefix,(page,verse,footnotes) in notes.items():
   if not rid.startswith(prefix):continue
   check=next(c for c in bad if c['edition']=='Brenton English');url='https://ebible.org/eng-Brenton/'+page+'.htm'
   exact=source(url,verse)
   assert check['quote'] in r['text'];r['text']=r['text'].replace(check['quote'],exact)
   r['sourceNotes']=[]
   for quote in footnotes:
    assert norm(quote) in evidence[url]['fullText'],(rid,quote,evidence[url]['fullText'])
    r['sourceNotes'].append({'edition':'Brenton English publisher footnote','source':url,'quote':quote,'kind':'edition footnote, not scripture','verification':'exact footnote text checked against publisher page'})
   changes.append({'field':'text','reason':'Remove interleaved footnotes from the English verse quotation and restore the publisher’s verse body.','source':url,'before':check['quote'],'after':exact})
   changes.append({'field':'sourceNotes','reason':'Preserve every removed footnote separately, attributed to the edition rather than Hebrew/Greek scripture.','source':url})

  if rid.startswith('anger-not-kept'):
   url='https://ebible.org/eng-Brenton/JER03.htm'
   if not any(s['url']==url for s in r['sources']):r['sources'].append({'label':'Jeremiah 3:12: Brenton English','url':url})
   changes.append({'field':'sources','reason':'Supply the missing Brenton English address for the quoted 3:12 excerpt.','source':url})

  assert r!=old,rid
  assert r.get('witness')==old.get('witness') and r.get('tags')==old.get('tags')
  assert r['id']==old['id'] and r['reviewStatus']=='draft, unverified'
  current[idx]=r;changed_ids.append(rid)
  entry=copy.deepcopy(base_prov[rid]);changed_fields=[key for key in r if r.get(key)!=old.get(key)]
  entry['corrections'].append('Quote repair against checkpoint 4fe1e7d: '+' '.join(dict.fromkeys(c['reason'] for c in changes)))
  for field in changed_fields:
   prev=entry['fields'].get(field,{'sources':[]})
   entry['fields'][field]={'sources':prev['sources']+[{'side':'Codex quote correction','checkpoint':CHECKPOINT,'date':'2026-10-20'}],'method':'; '.join(c['reason'] for c in changes if c['field']==field),'sha256':digest(json.dumps(r[field],ensure_ascii=False,sort_keys=True).encode())}
  provenance[next(i for i,p in enumerate(provenance) if p['id']==rid)]=entry
  logs.append({'id':rid,'ref':r['ref'],'file':item['file'],'beforeCheckpoint':CHECKPOINT,'changedFields':changed_fields,'changes':changes})
 if current!=json.loads(path.read_text()):write(path,current)
assert set(changed_ids)==set(failures)
assert (OUT/'undecided.json').read_bytes()==held_before
write(OUT/'field-provenance.json',provenance)
write(OUT/'quote-corrections.json',{'baselineCheckpoint':CHECKPOINT,'baselineFailed':28,'recordsCorrected':len(logs),'classificationDecisionsUnchanged':True,'records':logs})
print('Corrected',len(logs),'records; classification decisions untouched.')
