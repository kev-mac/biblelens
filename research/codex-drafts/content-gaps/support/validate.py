"""Validate drafts without builds or writes to app data. Requires jsonschema>=4."""
import collections
from jsonschema import Draft202012Validator
from research import *
OUT=HERE.parent
D={n:json.loads((OUT/(n+'.json')).read_text()) for n in ['evidence','stories','prophecies','timeline']}
nonempty={'type':'string','minLength':1}; ref={'type':'string','pattern':r'^.+ [1-9][0-9]*:[1-9][0-9]*$'}
source_schema={'type':'object','required':['label','url'],'additionalProperties':False,'properties':{'label':nonempty,'url':{'type':'string','pattern':'^https://'}}}
# No standalone evidence or reviewed-timeline JSON Schema exists in this checkout.
# These structural draft schemas supplement (not replace) its actual runtime validators.
E={'type':'object','additionalProperties':False,'required':['id','mode','ref','appliesTo','title','status','summary','text','reasoning','scope','sources','refs','checked','tags','witness','languageContext','sides'],'properties':{
'id':{'type':'string','pattern':'^[a-z0-9]+(?:-[a-z0-9]+)*$'},'mode':{'const':'contradictions'},'ref':ref,'appliesTo':{'type':'array','minItems':1,'uniqueItems':True,'items':ref},'title':nonempty,'status':{'const':'Context'},'summary':nonempty,'text':nonempty,'reasoning':nonempty,'scope':nonempty,'sources':{'type':'array','minItems':1,'items':source_schema},'refs':{'type':'array','minItems':1,'items':{'type':'object','required':['book','chapter','verse','label'],'additionalProperties':False,'properties':{'book':{'type':'integer','minimum':0,'maximum':65},'chapter':{'type':'integer','minimum':1},'verse':{'type':'integer','minimum':1},'label':ref}}},'checked':{'const':DATE},'tags':{'const':['T']},'witness':{'const':'Septuagint'},'languageContext':nonempty,'sides':{'type':'array','minItems':1,'items':{'type':'object','required':['label','ref','quote'],'additionalProperties':False,'properties':{'label':{'enum':['A','B']},'ref':ref,'quote':nonempty}}}}}
T={'type':'object','additionalProperties':False,'required':['id','title','evidence_id','traditional_date','reviewed','review_status','discrepancy_kind','additional_sources'],'properties':{'id':nonempty,'title':nonempty,'evidence_id':nonempty,'traditional_date':nonempty,'reviewed':{'const':DATE},'review_status':nonempty,'discrepancy_kind':{'type':'null'},'additional_sources':{'type':'array','minItems':1,'items':source_schema}}}
SC={'$schema':'https://json-schema.org/draft/2020-12/schema','description':'Supplemental shapes for this draft batch. Repository runtime validators remain authoritative.','definitions':{'evidence':E,'timeline':T}}
save(HERE/'draft-shapes.schema.json',SC)
errors=[]
def check(schema,obj,label):
 for e in Draft202012Validator(schema).iter_errors(obj):errors.append(f'{label} {list(e.path)}: {e.message}')
for name,d in D.items():
 assert d['status']=='draft' and d['review_status']=='needs review',name
for x in D['evidence']['records']:check(E,x['record'],x['record']['id'])
check(read('schemas/stories.schema.json'),D['stories']['catalog'],'stories')
for x in D['prophecies']['records']:check(read('src/data/prophecies.schema.json'),x['record'],x['record']['id'])
for x in D['timeline']['records']:check(T,x['record'],x['record']['id'])
current=read('data/evidence.json');current_ids={r['id'] for r in current}
current_by_id={r['id']:r for r in current}
for x in D['timeline']['records']:
 assert x['evidence_record_sha256']==hashlib.sha256(json.dumps(current_by_id[x['record']['evidence_id']],ensure_ascii=False,sort_keys=True).encode()).hexdigest(), 'Underlying evidence changed'
for n in ['evidence','prophecies','timeline']:
 rows=D[n]['records'];ids=[x['record']['id'] for x in rows];assert len(ids)==len(set(ids)),n
 for x in rows:assert x['status']=='draft' and x['review_status']=='needs review',x
 if n=='evidence':assert not current_ids.intersection(ids)
 if n=='prophecies':assert not {r['id'] for r in read('src/data/prophecies.json')}.intersection(ids)
 if n=='timeline':assert not {r['id'] for r in read('data/timeline-events.json')['events']}.intersection(ids)
oldbooks={b['book'] for b in read('data/stories.json')};newbooks={b['book'] for b in D['stories']['catalog']}
expected={b['name'] for b in BOOKS if b['id']>=44 or b['name'] in ['Joel','Obadiah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi']}
assert newbooks==expected and not oldbooks.intersection(newbooks)
cache=json.loads((HERE/'source-cache.json').read_text());quote_total=0;outside_mismatches=[];formatting_variants=[]
def lexical(s):return re.sub('[^a-z0-9]','',typographic(s).lower())
def typographic(s):return ' '.join(s.replace('LORD','Lord').replace('GOD','God').replace('’',"'").replace('¶','').split())
for n in D:
 rows=D[n]['reviews'] if n=='stories' else D[n]['records']
 for row in rows:
  assert row['status']=='draft' and row['review_status']=='needs review'
  for q in row['quote_checks']:
   quote_total+=1;m=re.fullmatch(r'(.*?) (\d+):(\d+)',q['ref']);assert m,q
   b,c,v=m.groups();c=int(c)
   if q['edition']=='packaged KJV':assert q['quote']==kjv(b,c)[v],q
   assert q['url'] in cache,q['url']
   fetched=cache[q['url']]['verses'].get(v)
   if q['quote']!=fetched and q['edition']=='packaged KJV' and fetched is not None and lexical(q['quote'])==lexical(fetched):
    formatting_variants.append({'group':n,'ref':q['ref'],'url':q['url'],'packaged':q['quote'],'publisher':fetched})
   elif q['quote']!=fetched:
    outside_mismatches.append({'group':n,'ref':q['ref'],'edition':q['edition'],'quote':q['quote'],'fetched':fetched,'url':q['url']})
  r=row.get('record',{})
  for s in row.get('sources',[])+r.get('sources',[])+r.get('additional_sources',[]):assert s['url'] in cache,s
save(HERE/'publisher-differences.json',outside_mismatches)
reviewed=json.loads((HERE/'reviewed-publisher-differences.json').read_text())
assert outside_mismatches==[{k:v for k,v in x.items() if k not in ['self_review','decision']} for x in reviewed], 'Unreviewed publisher differences'
assert all(x['edition']=='packaged KJV' for x in outside_mismatches), 'Original-language mismatch'
for row in D['evidence']['records']:
 r=row['record'];assert all(k not in r for k in ['academicAssessment','flag'])
 for p in r['refs']:
  assert p['label']==f'{BOOKS[p["book"]]["name"]} {p["chapter"]}:{p["verse"]}'
  assert str(p['verse']) in kjv(BOOKS[p['book']]['name'],p['chapter'])
 if 'printed_greek_verse_labels' in row:
  assert row['printed_greek_verse_labels']==['1','2','3','7','8','9']
# Check each gap exactly once, using the current placement inventory rather than the old ledger alone.
inv=json.loads((HERE/'gap-inventory.json').read_text())
expected={(b,c) for b,d in inv['books'].items() for c in d['current_no_placement']}
actual={(x['book'],x['chapter']) for x in D['evidence']['gap_review']};assert expected==actual
assert len(D['evidence']['gap_review'])==len(actual)
for x in D['evidence']['records']:
 m=re.fullmatch(r'(.*?) (\d+):(\d+)',x['record']['ref']);assert (m[1],int(m[2])) in expected
assert not errors,'\n'.join(errors)
result={'checked':DATE,'status':'pass','validator':'Python jsonschema Draft202012Validator; repository runtime validation is recorded separately','counts':{'evidence':len(D['evidence']['records']),'stories':sum(len(b['stories']) for b in D['stories']['catalog']),'story_books':len(newbooks),'prophecies':len(D['prophecies']['records']),'timeline':len(D['timeline']['records'])},'quote_checks':quote_total,'packaged_kjv_mismatches':0,'greek_and_brenton_english_mismatches':0,'acknowledged_publisher_wording_differences':len(outside_mismatches),'kjv_publisher_typography_variants':len(formatting_variants),'source_pages':len(cache),'schema_errors':len(errors),'gaps_screened':len(actual),'gap_outcomes':dict(collections.Counter(x['outcome'] for x in D['evidence']['gap_review'])),'evidence_by_book':dict(collections.Counter(re.fullmatch(r'(.*?) (\d+):(\d+)',x['record']['ref'])[1] for x in D['evidence']['records'])),'limitations':['Schema validity and exact quotations do not prove scholarly interpretation.','Evidence and timeline lack standalone repository JSON Schemas; supplemental shapes and actual runtime validators are both used.','Timeline review checks textual placement, not independent historical dating.','Fifteen packaged-KJV/publisher wording differences are pinned and reported, not silently normalized or corrected.']}
save(HERE/'kjv-typography-variants.json',formatting_variants);save(HERE/'validation.json',result);print(json.dumps(result,indent=2))
