#!/usr/bin/env python3
"""Reproduce the owner-authorized draft merge. Never writes outside this worktree."""
import copy, datetime, hashlib, json, pathlib, re, subprocess, tarfile

ROOT = pathlib.Path(__file__).resolve().parents[3]
OUT = pathlib.Path(__file__).resolve().parent
DRAFT = ROOT / 'research/claude-drafts'
MAIN = pathlib.Path('/Users/kevin/git/BibleLens')
BACKUPS = MAIN / '.release/research-backups'
NEW = BACKUPS / 'post-cleanup-task-runs-20261020'
BASE = 'cb2203e33eebc313e9f9ff6da3300236663ba554'
TASK = pathlib.Path('/Users/kevin/Library/Application Support/Claude/claude-code-sessions/4bb8df49-d937-4933-b0ce-08e3c54b08be/3683211e-a24d-4a9b-88e7-7041160bd28c/scheduled-tasks.json')
UNITS = ['psalms','isaiah','proverbs','jeremiah','2-chronicles','1-chronicles','samuel','kings','ezekiel','zechariah']
OLD_STEMS = {u: ([f'1-{u}',f'2-{u}'] if u in ['samuel','kings'] else [u]) for u in UNITS}
OLD_STEMS['jeremiah'].append('jeremiah-4b')
# Explicit, reviewed semantic matches, indexed from 1 in the frozen source arrays.
MATCHES = {
 'psalms': [([1],[10]),([7],[3])],
 'isaiah': [([1],[2]),([2],[3]),([6],[6]),([7],[10]),([9],[13]),([12],[15]),([14],[17]),([15],[21]),([16],[22])],
 'proverbs': [],
 'jeremiah': [([1],[14]),([2],[15]),([3],[27]),([4],[20]),([5],[17]),([6],[18]),([9],[16]),([11],[25]),([12],[8])],
 '2-chronicles': [([2],[3]),([3],[14]),([4],[13])],
 '1-chronicles': [([4],[17]),([5],[18]),([6],[4])],
 'samuel': [([1],[4]),([3],[2]),([5],[5]),([6],[8]),([8],[12]),([9],[14]),([13],[16]),([15],[17])],
 'kings': [([8],[3,4]),([9],[5]),([10],[6]),([14],[9]),([16],[12])],
 'ezekiel': [([2],[9]),([4],[12]),([7],[16]),([9],[7]),([10],[6])],
 'zechariah': [([1],[2]),([2],[3]),([4,5],[4]),([6],[5]),([7],[6]),([8],[10]),([9],[11])],
}

def digest(data): return hashlib.sha256(data).hexdigest()
def write_json(path, value):
 path.parent.mkdir(parents=True,exist_ok=True)
 path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def old_bytes(name):
 return subprocess.check_output(['git','show',f'{BASE}:research/claude-drafts/{name}'],cwd=ROOT)
def protected_state():
 paths = [MAIN/'research/claude-drafts'/p.name for p in NEW.iterdir() if p.is_file()]
 paths += [TASK, DRAFT/'chapter-ledger.json',DRAFT/'remediation-queue.md']
 result = {str(p):digest(p.read_bytes()) for p in paths}
 result['main_head'] = subprocess.check_output(['git','rev-parse','main'],cwd=ROOT,text=True).strip()
 result['main_status'] = subprocess.check_output(['git','status','--porcelain=v1','-uall'],cwd=MAIN,text=True)
 result['review_head'] = subprocess.check_output(['git','rev-parse','codex/content-review-20261020'],cwd=ROOT,text=True).strip()
 return result

assert ROOT != MAIN
assert subprocess.check_output(['git','branch','--show-current'],cwd=ROOT,text=True).strip() == 'research-merge-second-pass'
before = protected_state()
if not (OUT/'protected-state-before.json').exists(): write_json(OUT/'protected-state-before.json',before)
else: assert json.loads((OUT/'protected-state-before.json').read_text()) == before, 'Protected inputs changed since first merge'

provenance = []; manifest = []; mapping = []; input_hashes = {}; counts = {}; all_ids = set()
new_only_ids = set(); matched_ids = set(); deferred = []

def source(side, filename, rec): return {'side':side,'file':filename,'id':rec['id']}
def union(values):
 out=[]
 for v in values:
  if v not in out: out.append(v)
 return out
def combine_text(records, field):
 vals=union([r.get(field,'') for r in records if r.get(field)])
 return '\n\nAdditional retained draft evidence/qualification:\n'.join(vals)
def field_entry(r, sources, status, corrections):
 fields={}
 for k,v in r.items():
  fields[k]={'sources':[s for s,orig in sources if k in orig], 'method':'copied' if len(sources)==1 else 'preserved base; supplemented where logged', 'sha256':digest(json.dumps(v,ensure_ascii=False,sort_keys=True).encode())}
 return {'id':r['id'],'finding':r['title'],'ref':r['ref'],'status':status,'corrections':corrections,'inputs':[s for s,_ in sources], 'fields':fields}

for unit in UNITS:
 preserved=[]; locations=[]; originals={}
 for stem in OLD_STEMS[unit]:
  name=stem+'-second-pass-records.json'; raw=old_bytes(name); input_hashes['preserved/'+name]=digest(raw)
  a=json.loads(raw); originals[name]=a
  preserved.extend(a); locations.extend([name]*len(a))
 newname=(('1-2-'+unit) if unit in ['samuel','kings'] else unit)+'-second-pass-records.json'
 raw=(NEW/newname).read_bytes(); input_hashes['new/'+newname]=digest(raw); newer=json.loads(raw)
 outputs={name:[] for name in originals}; used_old=set(); used_new=set(); merged=[]
 for pi,ni in MATCHES[unit]:
  used_old.update(pi);used_new.update(ni)
  ps=[preserved[i-1] for i in pi]; ns=[newer[i-1] for i in ni]; r=copy.deepcopy(ps[0])
  sources=[(source('preserved',locations[i-1],preserved[i-1]),preserved[i-1]) for i in pi]+[(source('new',newname,newer[i-1]),newer[i-1]) for i in ni]
  corrections=['One canonical record retained under the first preserved ID.']
  # Keep the preserved editorial fields; retain all supplied primary evidence,
  # primary source URLs, placements, sides and interpretation limits from both.
  for field in ['text','reasoning','scope']:
   r[field]='Preserved draft '+field+':\n'+combine_text(ps,field)+'\n\nNew draft supplemental '+field+' (reported, unverified):\n'+combine_text(ns,field)
  for field in ['sources','refs','appliesTo','sides']:
   r[field]=union([v for a in ps+ns for v in a.get(field,[])])
  if len(ps)>1: r['summary']=combine_text(ps,'summary')
  if len(ps)>1: corrections.append('Combined preserved findings: '+', '.join(a['id'] for a in ps[1:]))
  if len(ns)>1: corrections.append('Reunited new findings split across multiple records.')
  for n in ns:
   if n.get('witness') != ps[0].get('witness'):
    corrections.append('Preserved witness retained; new witness proposal logged for review: '+str(n.get('witness')))
    deferred.append({'id':r['id'],'issue':'Witness classification differs','preserved':ps[0].get('witness'),'new':n.get('witness')})
  if any(n.get('witness') != ps[0].get('witness') for n in ns):
   r['scope']+=' Merge qualification: the supplemental witness classification is retained as a proposal, not adopted. The canonical witness remains the preserved value pending the decision logged in undecided.json.'
  r['reviewStatus']='draft, unverified';r['mergeStatus']='matched'
  entry=field_entry(r,sources,'matched; draft, unverified',corrections)
  for field in ['id','title','summary','mode','status','ref','tags','witness','languageContext','checked']:
   if field in entry['fields']: entry['fields'][field]={'sources':[s[0] for s in sources[:len(ps)]] if field=='summary' and len(ps)>1 else [sources[0][0]],'method':'preserved base' if field!='summary' or len(ps)==1 else 'combined preserved findings'}
  for field in ['text','reasoning','scope']: entry['fields'][field]['method']='all distinct source passages retained, with source-qualified corrections below'
  for field in ['sources','refs','appliesTo','sides']: entry['fields'][field]['method']='deduplicated union'
  if any(n.get('witness') != ps[0].get('witness') for n in ns):
   entry['fields']['scope']['sources'].append({'side':'Codex merge','date':'2026-10-20'})
   entry['fields']['scope']['method']+='; explicit hold on differing witness proposal'
  merged.append((locations[pi[0]-1],r,entry));matched_ids.add(r['id'])
 for i,old in enumerate(preserved,1):
  if i in used_old: continue
  r=copy.deepcopy(old);r['reviewStatus']='draft, unverified';r['mergeStatus']='preserved-only'
  entry=field_entry(r,[(source('preserved',locations[i-1],old),old)],'preserved-only; draft, unverified',[])
  merged.append((locations[i-1],r,entry))
 for i,new in enumerate(newer,1):
  if i in used_new: continue
  r=copy.deepcopy(new);corrections=[]
  if unit=='jeremiah' and i==5:
   r['id']=r['id'].replace('9-25-greek','9-26-greek');corrections.append('Corrected ID from Jeremiah 9:25 to 9:26; references already point to 9:26.')
  if unit=='samuel' and i in [18,20]:
   r['id']+='-new-20261020';corrections.append('Same-ID/different-content exception: kept both versions; new version receives -new-20261020 suffix.')
  r['reviewStatus']='draft, unverified';r['mergeStatus']='new-only' if not (unit=='samuel' and i in [18,20]) else 'same-id-variant'
  if r['mergeStatus']=='new-only': new_only_ids.add(r['id'])
  if unit in ['samuel','kings']:
   filename= ('1-' if r['ref'].startswith('1 ') else '2-')+unit+'-second-pass-records.json'
  else: filename=OLD_STEMS[unit][0]+'-second-pass-records.json'
  entry=field_entry(r,[(source('new',newname,new),new)],r['mergeStatus']+'; draft, unverified',corrections)
  if r['id']!=new['id']:
   entry['fields']['id']['sources'].append({'side':'Codex correction','date':'2026-10-20'})
   entry['fields']['id']['method']='new source ID corrected/disambiguated: '+' '.join(corrections)
  merged.append((filename,r,entry))
 for filename,r,entry in merged:
  assert r['id'] not in all_ids, 'ID collision: '+r['id']
  all_ids.add(r['id']);outputs[filename].append(r);provenance.append(entry)
  for inp in entry['inputs']: mapping.append({'source':inp,'mergedId':r['id']})
 for filename,a in outputs.items(): write_json(DRAFT/filename,a)
 manifest.extend({'file':'research/claude-drafts/'+fn,'ids':[r['id'] for r in a]} for fn,a in outputs.items())
 counts[unit]={'preserved':len(preserved),'new':len(newer),'merged':len(merged),'matched':len(MATCHES[unit])}

# Apply exactly the source-check resolutions authorized by the owner.
def edit_record(prefix, editor, description, fields):
 found=[]
 for item in manifest:
  path=ROOT/item['file'];a=json.loads(path.read_text())
  for r in a:
   if r['id'].startswith(prefix):
    original_id=r['id'];editor(r);found.append(original_id)
  write_json(path,a)
 assert len(found)==1,(prefix,found)
 entry=next(e for e in provenance if e['id']==found[0]);entry['corrections'].append(description)
 for field in fields: entry['fields'][field]={'sources':entry['inputs']+[{'side':'Codex source check','date':'2026-10-20'}],'method':description}

def ps59(r):
 r['scope']=r['scope'].replace('No tag applies because the KJV, the Hebrew and the Greek agree with each other here.','This record compares the requests in verses 11 and 13; it does not claim that the KJV, Hebrew and Greek agree in all details. Greek 58:12 has “your law” where Hebrew 59:12/KJV 59:11 has “my people”; the separate translation finding retains Brenton’s variant note.')
 r['reasoning']=r['reasoning'].replace('Within a few lines the speaker asks both that they live, scattered, and that they cease to be.','The KJV and Hebrew juxtapose requests to spare and to consume. The Greek also juxtaposes not killing and destruction, but its destruction clause is not grammatically identical to the Hebrew imperatives. This does not establish inconsistent intentions.')
edit_record('slay-them-not-and-consume-them',ps59,'Removed blanket agreement; qualified Greek grammar and cross-referenced the law/people finding.',['scope','reasoning'])

def ps59law(r):
 r['sources']=union(r['sources']+[{'label':'Brenton English Psalm 58:12 and variant note (law / people)','url':'https://ebible.org/eng-Brenton/PSA058.htm'}])
 r['scope']+=' Source check: Brenton’s English footnote reports that some Greek manuscripts read λαοῦ (“people”). This is an attributed edition note, not an independent collation of manuscripts.'
edit_record('slay-them-not-lest-my-people',ps59law,'Retained your-law finding and Brenton’s law/people variant; added the English footnote source.',['sources','scope'])

def isa159(r):
 r['scope']+=' Source-check qualification: the new draft’s direct “lion = Arabs” alignment is not established. In Greek 15:9 Arabs occurs in the Dimon clause; Ariel occurs later, nearer the Hebrew lion clause. The preserved clause positions govern this record; no word-for-word substitution or reconstruction of a Hebrew source is asserted.'
edit_record('bajith-and-lions-upon-moab',isa159,'Kept preserved Isaiah 15:9 wording; explicitly qualified the new lion/Arabs claim.',['scope'])

def isa157(r):
 r['id']='the-brook-of-the-willows-or-arabs-against-the-valley-greek-isaiah-15-7'
 r['ref']='Isaiah 15:7';r['title']='Isaiah 15:7: brook of the willows and Arabs against the valley — a clause-level difference'
 r['summary']='The KJV says the possessions are carried to the brook of the willows. Brenton’s Greek instead brings Arabs against the valley. This compares the clauses, not a demonstrated word-for-word substitution.'
 r['text']=r['text'].split(' KJV Isaiah 15:9:')[0]+' Sources: https://bolls.life/get-text/WLC/23/15/ and https://ebible.org/grcbrent/ISA15.htm.'
 r['reasoning']='The KJV and Hebrew describe possessions being carried to a brook; Brenton’s Greek describes Arabs being brought against a valley. The actors, action and object differ across the clauses. The comparison does not establish that a single Hebrew word was directly translated as Arabs.'
 r['scope']='T is proposed only at Isaiah 15:7. This is a clause-level difference in the cited editions, not a claim about the original reading, every manuscript, or a direct lion/Arabs substitution at 15:9. The separate preserved 15:9 record supplies the qualified clause alignment. Plain English renderings are explanations, not KJV quotations or lexicon definitions.'
 r['refs']=[x for x in r.get('refs',[]) if x['chapter']==15 and x['verse']==7]
 r['appliesTo']=['Isaiah 15:7'];r['sides']=[x for x in r.get('sides',[]) if x['ref']=='Isaiah 15:7']
old157='the-brook-of-the-willows-and-lions-upon-moab-or-arabs-upon-the-valley-greek-isaiah-15-7-and-15-9'
edit_record(old157,isa157,'Separated the new Isaiah 15:7 finding; narrowed all fields to a clause-level comparison and removed duplicate 15:9 coverage.',['id','ref','title','summary','text','reasoning','scope','refs','appliesTo','sides'])
# Propagate this deliberately changed ID through provenance and the crosswalk.
new157='the-brook-of-the-willows-or-arabs-against-the-valley-greek-isaiah-15-7'
for entry in provenance:
 if entry['id']==old157: entry['id']=new157
for entry in mapping:
 if entry['mergedId']==old157: entry['mergedId']=new157

def isa6511(r):
 r['witness']='Hebrew and Septuagint'
 r['summary']+=' The Hebrew Gad/Meni name interpretation is also reported in NET’s translator notes; this does not decide the original reading.'
 r['reasoning']=r['reasoning'].replace('Gad (גַּד) and Meni (מְנִי) are written as two words with the article/prefix ל.','The prefixed ל is a preposition; it does not by itself prove that the words are proper names. NET’s translator notes identify Gad and Meni as deity names and cite HALOT.')
 r['scope']=r['scope'].replace('Merge qualification: the supplemental witness classification is retained as a proposal, not adopted. The canonical witness remains the preserved value pending the decision logged in undecided.json.','Source-check resolution: Hebrew and Septuagint is adopted for the combined finding, based on the supported Gad/Meni name reading as well as the Greek contrast.')
 r['scope']+=' Source-check qualification: the Gad/Meni proper-name interpretation is supported by NET translator notes citing HALOT, rather than by prefix spelling alone. The older scope limits the original Greek finding; the supplemental name reading does not establish a particular cult history or a preferred original text.'
 r['sources']=union(r['sources']+[{'label':'NET Isaiah 65:11 translator notes: Gad and Meni; HALOT references','url':'https://classic.net.bible.org/passage.php?passage=Isa+65:11'}])
edit_record('that-troop-and-that-number',isa6511,'Retained Greek evidence and sourced Gad/Meni interpretation; corrected the prefix explanation; adopted Hebrew and Septuagint from the supported combined finding.',['summary','reasoning','scope','sources','witness'])
deferred=[d for d in deferred if not d['id'].startswith('that-troop-and-that-number')]

def chr1714(r):
 r['scope']=r['scope'].replace('Merge qualification: the supplemental witness classification is retained as a proposal, not adopted. The canonical witness remains the preserved value pending the decision logged in undecided.json.','Merge qualification: retain the preserved Septuagint label only for its Greek my/his contrast at 1 Chronicles 17:14. The additional my/thy comparison with 2 Samuel 7:16 is an internal passage comparison, not a new translation tag; the untagged supplemental draft does not revoke the retained Greek finding.')
edit_record('in-my-house-and-in-my-kingdom',chr1714,'Retained the independently sourced Greek contrast and its Septuagint label; kept the added internal parallel distinct in scope.',['scope'])
deferred=[d for d in deferred if not d['id'].startswith('in-my-house-and-in-my-kingdom')]

def ps187(r):
 r['scope']+=' Source check: Hebrew Psalm 18:8 (KJV 18:7) and Greek Psalm 17:8 print mountains; Hebrew and Greek 2 Samuel 22:8 print heaven. Both drafts’ wording contrast is supported; that alone does not demonstrate incompatible events or identify an original reading.'
edit_record('foundations-of-the-hills-or-foundations-of-heaven-psalm-18-7-2',ps187,'Retained preserved Greek sourcing and both drafts’ limits; confirmed mountains/heaven contrast.',['scope'])

# Keep both notes verbatim in source-labelled folders. Reading claims are separately
# indexed as reported, not verified; quote checking is not chapter reading.
reading=[];notes_inventory=[]
for unit in UNITS:
 for side,stems in [('preserved',OLD_STEMS[unit]),('new',[('1-2-'+unit) if unit in ['samuel','kings'] else unit])]:
  for stem in stems:
   name=stem+'-second-pass-notes.md';raw=old_bytes(name) if side=='preserved' else (NEW/name).read_bytes()
   dest=OUT/'notes'/side/name;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(raw)
   input_hashes[side+'/'+name]=digest(raw)
   notes_inventory.append({'side':side,'file':str(dest.relative_to(ROOT)),'sha256':digest(raw)})
   text=raw.decode(); blocks=re.split(r'\n\s*\n',text)
   claims=[b for b in blocks if re.search(r'\bread\b|reading|compared|chapter|coverage',b,re.I)]
   reading.append({'side':side,'file':name,'status':'reported, not verified','reportedPassages':claims})

# Merge all three owner-question versions, retaining every distinct body and
# every source/date/status. Equal entries are coalesced, variants are explicit.
with tarfile.open(BACKUPS/'20261020-062910/research-drafts.tar') as tar:
 m=next(m for m in tar.getmembers() if m.name.endswith('/owner-questions.md'));arch=tar.extractfile(m).read()
owner_sources=[('preserved',old_bytes('owner-questions.md')),('archive-20261020-062910',arch),('new',(NEW/'owner-questions.md').read_bytes())]
questions=[]
for side,raw in owner_sources:
 (OUT/'notes'/side).mkdir(parents=True,exist_ok=True);(OUT/'notes'/side/'owner-questions.md').write_bytes(raw)
 input_hashes[side+'/owner-questions.md']=digest(raw)
 parts=re.split(r'(?m)^## ',raw.decode())[1:]
 for part in parts:
  title,_,body=part.partition('\n');body=body.rstrip()
  exact=next((q for q in questions if q['heading']==title and q['body']==body),None)
  if exact: exact['sources'].append(side);continue
  date=re.match(r'\d{4}-\d\d-\d\d',title)
  markers=[line.strip() for line in (title+'\n'+body).splitlines() if re.search(r'ANSWERED|SUPERSEDED|Owner.s answer|Decided:|held|not issued|no record',line)]
  questions.append({'heading':title,'date':date.group() if date else None,'sources':[side],'statusText':markers,'body':body})
write_json(OUT/'owner-questions-merged.json',questions)
owner=['# Merged owner questions — three source versions','', 'Dates and status statements below are retained as historical reports, not newly adopted rulings. Source variants remain explicit.','']
for q in questions: owner+=['## '+q['heading'],'','Source version(s): '+', '.join(q['sources'])+'.','',q['body'],'']
(DRAFT/'owner-questions.md').write_text('\n'.join(owner))

# Record every record's final field hashes, including Codex-added metadata.
byid={}
for item in manifest:
 a=json.loads((ROOT/item['file']).read_text());item['ids']=[r['id'] for r in a]
 for r in a:
  assert r['id'] not in byid,r['id'];byid[r['id']]=r
for entry in provenance:
 if entry['id'].startswith(('that-troop-and-that-number','in-my-house-and-in-my-kingdom')):
  entry['corrections']=[c for c in entry['corrections'] if not c.startswith('Preserved witness retained; new witness proposal logged for review:')]
 for field,value in byid[entry['id']].items():
  entry['fields'].setdefault(field,{'sources':[{'side':'Codex merge','date':'2026-10-20'}],'method':'draft merge metadata'})
  entry['fields'][field]['sha256']=digest(json.dumps(value,ensure_ascii=False,sort_keys=True).encode())
  if field in ['reviewStatus','mergeStatus']:
   entry['fields'][field]['sources']=[{'side':'Codex merge','date':'2026-10-20'}]
   entry['fields'][field]['method']='draft merge metadata; does not supersede original intended publication status'
write_json(OUT/'field-provenance.json',provenance)
write_json(OUT/'record-crosswalk.json',mapping)
write_json(OUT/'manifest.json',{'base':BASE,'branch':'research-merge-second-pass','counts':counts,'files':manifest,'total':len(byid),'inputHashes':input_hashes,'notes':notes_inventory})
write_json(OUT/'reported-reading-claims.json',reading)
write_json(OUT/'undecided.json',deferred)
after=protected_state();assert before==after,'Protected state changed';write_json(OUT/'protected-state-after.json',after)
print(json.dumps({'counts':counts,'total':len(byid),'newOnly':len(new_only_ids),'matched':len(matched_ids),'ownerQuestionVariants':len(questions),'witnessDecisionsHeld':len(deferred),'protectedStateUnchanged':True},indent=2))
