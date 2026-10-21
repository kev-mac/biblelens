#!/usr/bin/env python3
"""Validate the owner-authorized findings review and regenerate current review counts."""
import collections, hashlib, json, pathlib, subprocess
OUT=pathlib.Path(__file__).resolve().parent;ROOT=OUT.parents[2]
def load(name):return json.loads((OUT/name).read_text())
def save(name,value):(OUT/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def digest(v):return hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True).encode()).hexdigest()
def table(headers,rows):
 def esc(v):return str(v).replace('|','\\|').replace('\n','<br>')
 return '\n'.join(['| '+' | '.join(headers)+' |','|'+'|'.join(['---']*len(headers))+'|']+['| '+' | '.join(esc(v) for v in row)+' |' for row in rows])
m=load('manifest.json');review=load('findings-review-changes.json');quotes=load('quote-checks.json');prov=load('field-provenance.json');cross=load('record-crosswalk.json')
records=[r for f in m['files'] for r in json.loads((ROOT/f['file']).read_text())];by={r['id']:r for r in records};qm={q['id']:q for q in quotes['records']}
assert len(records)==len(by)==m['total']==review['finalRecords']==238
assert set(by)==set(qm)=={p['id'] for p in prov}
assert all(r['reviewStatus']=='draft, unverified' for r in records)
for f in m['files']:assert f['ids']==[r['id'] for r in json.loads((ROOT/f['file']).read_text())]
for p in prov:
 assert set(p['fields'])==set(by[p['id']])
 for k,v in by[p['id']].items():assert p['fields'][k]['sha256']==digest(v),(p['id'],k)
assert len(cross)==303
assert len({(x['source']['side'],x['source']['file'],x['source']['id']) for x in cross})==303
for x in cross:
 if 'mergedId' in x:assert x['mergedId'] in by
 elif 'mergedIds' in x:assert set(x['mergedIds'])<=set(by)
 else:assert x['retiredMergedId'] in review['droppedIds']
assert not set(review['droppedIds'])&set(by)
assert review['replacedBySplit'] not in by
assert all(qm[x['id']]['quoteResult']=='PASS' for x in review['changedRecords'])
published={r['id'] for r in json.loads((ROOT/'data/evidence.json').read_text())};assert not set(by)&published
mergefiles={f['file'] for f in m['files']}
for path in (ROOT/'research/claude-drafts').glob('*-records.json'):
 if str(path.relative_to(ROOT)) in mergefiles:continue
 try:a=json.loads(path.read_text())
 except ValueError:continue
 if isinstance(a,list):assert not {r['id'] for r in a if isinstance(r,dict) and 'id' in r}&set(by)
for note in m['notes']:assert hashlib.sha256((ROOT/note['file']).read_bytes()).hexdigest()==note['sha256']
assert subprocess.check_output(['git','branch','--show-current'],cwd=ROOT,text=True).strip()=='research-merge-second-pass'
protected=load('protected-state-before.json')
assert subprocess.check_output(['git','rev-parse','main'],cwd=ROOT,text=True).strip()==protected['main_head']
assert not subprocess.check_output(['git','diff','HEAD','--','data/evidence.json','src/'],cwd=ROOT,text=True)
failed=[q for q in quotes['records'] if q['quoteResult']=='FAIL'];passed=len(records)-len(failed);checks=sum(len(q['checks']) for q in quotes['records'])
summary=load('summary.json');summary.update(mergedRecords=len(records),statusCounts=dict(collections.Counter(r['mergeStatus'] for r in records)),quotePass=passed,quoteFail=len(failed),quoteChecks=checks,witnessDecisionsHeld=len(load('undecided.json')),findingsReview={'changedOutputRecords':len(review['changedRecords']),'droppedRecords':len(review['droppedIds']),'splitReplacementRecords':len(review['addedIds']),'netAddedRecords':1,'editorialSection5':'skipped','witnessDecisionsResolved':2})
save('summary.json',summary)
review['quoteCheck']={'pass':passed,'fail':len(failed),'checks':checks,'changedOutputRecordsPassed':len(review['changedRecords']),'sourceErrors':0};save('findings-review-changes.json',review)
qdoc='# Per-record quote checks\n\n'+f'**{passed} PASS; {len(failed)} FAIL; {len(records)} records; {checks} checks.**\n\n'+quotes['normalization']+'\n\nThe unchanged scripture matching rules cover exact packaged KJV side/text quotations and supplied original-language text, with no Unicode normalization of WLC. Attributed sourceNotes (including the Isaiah publisher PDF excerpt) are checked separately against saved source evidence. PDF sources are excluded from the HTML verse matcher.\n\nEvery retained record was rerun, including all 16 changed/replacement output records. Cached publisher/WLC sources were reused. No source errors. PASS verifies quotations, not findings approval, lexical interpretations, manuscript consensus or publication readiness. [Full results](quote-checks.json); [source limits](findings-review-source-checks.md).\n\n'
qdoc+=table(['Reference','Record ID','Result','Scope'],[[q['ref'],'`'+q['id']+'`',q['quoteResult'],'All extracted quotation checks pass.' if q['quoteResult']=='PASS' else 'See JSON failures.'] for q in quotes['records']])+'\n';(OUT/'quote-checks.md').write_text(qdoc)
counts=summary['statusCounts'];rows=[['Source records',303],['Merged draft records',len(records)],['Matched canonical records',counts.get('matched',0)],['Preserved-only records',counts.get('preserved-only',0)],['New-only findings — draft, unverified',counts.get('new-only',0)],['Explicit same-ID Samuel variants retained',counts.get('same-id-variant',0)],['Changed / replacement output records',len(review['changedRecords'])],['Dropped findings',len(review['droppedIds'])],['Split replacement records (net +1)',2],['Quote PASS',passed],['Quote FAIL',len(failed)],['Witness classification decisions held',0],['Witness classification decisions resolved',2],['Merged owner-question entries',summary['ownerQuestionEntries']],['Verbatim notes versions retained',len(m['notes'])],['ID collisions',0]]
overview='''# Second-pass research merge review

Local draft review on `research-merge-second-pass`. All records remain **draft, unverified**; quotation PASS is not findings approval. Kevin authorized applying Claude’s findings handoff with the recommended answers. No commit, push, publication, app integration or main update was made.

'''+table(['Result','Count'],rows)+'''

250 prior drafts − 12 section-4 drops − 1 section-3.10 drop + 1 net record from the Isaiah 15 split = **238**. The Psalm recasts reuse their stable IDs and add no count. Other stable IDs are retained for provenance, including the two recast Jeremiah IDs. Section 5 editorial preferences were skipped.

- [Applied findings review: field changes, drops, split IDs and checks](findings-review-changes.json)
- [Quick checks and source limits](findings-review-source-checks.md)
- [Dropped observations / non-finding notes](findings-review-drops.md)
- [Field-by-field provenance](field-provenance.json)
- [Per-record quote PASS / FAIL](quote-checks.md)
- [Resolved witness decisions](undecided.md)
- [Source-to-output / retired-record crosswalk](record-crosswalk.json)
- [Historical merge log](merge-log.md)
- [Reading claims: reported, not verified](reported-reading-claims.md)

Isaiah 65:11 and the two formerly held records are Septuagint only. The Kings/Isaiah Ararat record is labelled Hebrew and Septuagint, with the Greek difference confined to 2 Kings 19:37: Brenton’s Isaiah 37:38 prints Armenia and agrees with the KJV. The original verbatim notes and historical quote-correction reports remain unchanged.
'''
(OUT/'README.md').write_text(overview)
p=OUT/'merge-log.md';s=p.read_text();notice='> Historical pre-findings-review merge log (250 records). Current active records: 238. For owner-authorized corrections, drops and the Isaiah split, see [findings-review-changes.json](findings-review-changes.json) and [README.md](README.md). Retired outputs remain traceable in the crosswalk and dropped-record archive.\n\n'
if not s.startswith('> Historical'):p.write_text(notice+s)
print(json.dumps({'records':len(records),'pass':passed,'fail':len(failed),'checks':checks,'changed':len(review['changedRecords']),'dropped':len(review['droppedIds']),'protectedAppAndMain':'unchanged'},indent=2))
