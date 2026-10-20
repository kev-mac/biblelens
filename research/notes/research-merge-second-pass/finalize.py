#!/usr/bin/env python3
"""Write review tables and verify invariants without editing research records."""
import collections, hashlib, json, pathlib, subprocess
OUT=pathlib.Path(__file__).resolve().parent;ROOT=OUT.parents[2]
def load(name):return json.loads((OUT/name).read_text())
def save(name,value):(OUT/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def esc(value):return str(value).replace('|','\\|').replace('\n','<br>')
def table(headers,rows):return ['| '+' | '.join(headers)+' |','|'+'|'.join(['---']*len(headers))+'|']+['| '+' | '.join(esc(v) for v in row)+' |' for row in rows]
def digest(b):return hashlib.sha256(b).hexdigest()
m=load('manifest.json');provenance=load('field-provenance.json');quotes=load('quote-checks.json');crosswalk=load('record-crosswalk.json')
records=[r for f in m['files'] for r in json.loads((ROOT/f['file']).read_text())];byid={r['id']:r for r in records};qmap={q['id']:q for q in quotes['records']}
assert len(records)==len(byid)==m['total']==250
assert set(byid)==set(qmap)=={p['id'] for p in provenance}
assert all(r['reviewStatus']=='draft, unverified' for r in records)
assert len(crosswalk)==303
inputs=[(x['source']['side'],x['source']['file'],x['source']['id']) for x in crosswalk]
assert len(inputs)==len(set(inputs)), 'An input record mapped more than once'
assert all(x['mergedId'] in byid for x in crosswalk)
assert not any('jeremiah-9-25-greek' in r['id'] for r in records)
assert len([r for r in records if r['mergeStatus']=='same-id-variant'])==2
for p in provenance:
 assert set(p['fields'])==set(byid[p['id']])
 for field,v in byid[p['id']].items():assert p['fields'][field]['sha256']==digest(json.dumps(v,ensure_ascii=False,sort_keys=True).encode())
published={r['id'] for r in json.loads((ROOT/'data/evidence.json').read_text())}
assert not set(byid)&published
other_collisions=[]
merge_files={f['file'] for f in m['files']}
for path in (ROOT/'research/claude-drafts').glob('*-records.json'):
 if str(path.relative_to(ROOT)) in merge_files:continue
 try:array=json.loads(path.read_text())
 except ValueError:continue
 if isinstance(array,list):other_collisions += [(r['id'],str(path)) for r in array if isinstance(r,dict) and r.get('id') in byid]
assert not other_collisions
before=load('protected-state-before.json');after={}
for key in before:
 if key=='main_head':after[key]=subprocess.check_output(['git','rev-parse','main'],cwd=ROOT,text=True).strip()
 elif key=='review_head':after[key]=subprocess.check_output(['git','rev-parse','codex/content-review-20261020'],cwd=ROOT,text=True).strip()
 elif key=='main_status':after[key]=subprocess.check_output(['git','status','--porcelain=v1','-uall'],cwd='/Users/kevin/git/BibleLens',text=True)
 else:after[key]=digest(pathlib.Path(key).read_bytes())
assert before==after,'Protected files or refs changed'
save('protected-state-after.json',after)
assert all(digest((ROOT/n['file']).read_bytes())==n['sha256'] for n in m['notes'])
failed=[q for q in quotes['records'] if q['quoteResult']=='FAIL'];passed=len(records)-len(failed)

merge=['# Second-pass research merge — local draft review','',
 'Branch/worktree: `research-merge-second-pass`. Base: `codex/content-review-20261020` at `'+m['base']+'`.','',
 '303 source records reconcile to 250 draft records. No application data or UI was integrated. All output records remain **draft, unverified**, including records whose quotations pass. The intended publication `status` fields are retained from the drafts; they are not acceptance decisions.','',
 'Preserved editorial fields remain the base. Matched records retain source-labelled evidence, citations, placements and qualifications from both sides. Where witness classifications conflict, the preserved classification governs and the new proposal is held explicitly.','',
 'Full field origins and final field hashes: [field-provenance.json](field-provenance.json). Every input maps to an output in [record-crosswalk.json](record-crosswalk.json).','']
rows=[]
for p in provenance:
 sides=', '.join(dict.fromkeys(x['side'] for x in p['inputs']))
 changes=' '.join(p['corrections']) or 'Retained as a separate draft; no substantive wording correction.'
 if byid[p['id']]['mergeStatus']=='matched':changes='Preserved base; evidence, sources and limits from both sides retained. '+changes
 rows.append([byid[p['id']]['ref']+' — `'+p['id']+'`',sides,p['status'],changes])
merge+=table(['Finding / output ID','Source side(s)','Status','Corrections made'],rows)
(OUT/'merge-log.md').write_text('\n'.join(merge)+'\n')

qdoc=['# Per-record quote checks','',f'**{passed} PASS; {len(failed)} FAIL; {len(records)} records; {sum(len(q["checks"]) for q in quotes["records"])} checks.**','',
 quotes['normalization'],'',
 'Checks cover KJV side quotations, explicitly labelled KJV excerpts in `text`, supplied original-language runs in `text`, explicit Brenton English quotations and the selected printed-edition omissions. Where a printed verse label is supplied, it is checked; otherwise the result identifies the matching verse in a cited chapter. See JSON for every extracted quote, source, claimed reference and matching location.','',
 'PASS verifies the tested quotations only. It does not independently verify lexical glosses, interpretation, historical claims, exhaustive chapter reading or readiness for publication. FAIL means at least one quotation, placement or source requirement failed; it does not by itself refute the underlying finding.','',
 'Primary texts came from the supplied WLC/SBLGNT endpoints, packaged KJV and the publisher’s Brenton HTML archives. Source content and hashes are in [quote-source-cache.json](quote-source-cache.json); full results are in [quote-checks.json](quote-checks.json). No source requests remain failed.','']
qrows=[]
for q in quotes['records']:
 bad=[c for c in q['checks'] if c['result']=='FAIL']; reasons=[]
 for c in bad:
  reason=c['edition']+' '+c.get('field','quote')
  if c.get('checkedSources')==[]:reason+=': no address supplied/extracted for that quoted edition'
  elif c.get('otherVerseMatches'):reason+=': found at a different verse'
  elif c.get('field')=='sides':reason+=': not an exact substring at its side reference'
  else:reason+=': exact quote/printed location not reproduced'
  if reason not in reasons:reasons.append(reason)
 qrows.append([q['ref'],'`'+q['id']+'`',q['quoteResult'],'; '.join(reasons) or 'All extracted quote checks pass.'])
qdoc+=table(['Reference','Record ID','Result','Failure / scope'],qrows)
(OUT/'quote-checks.md').write_text('\n'.join(qdoc)+'\n')

undecided=load('undecided.json')
udoc=['# Items not decided','',
 'The following witness classifications need editorial review. Both sides’ supplied evidence is retained; no expanded classification was silently adopted.','']
udoc+=table(['Record','Preserved classification kept','New proposal held'],[[u['id'],u['preserved'],u['new']] for u in undecided])
udoc+=['',f'{len(failed)} records remain held for quote correction or source review. Exact check results are in quote-checks.json. Quote corrections do not approve a finding or resolve the two classification holds.','']
udoc+=table(['Reference','Record ID','Result'],[[q['ref'],q['id'],'FAIL — quote/source correction needed'] for q in failed])
udoc+=['','All 133 new-only findings remain draft, unverified. No final acceptance, rejection, witness expansion or publication decision is made by this merge.','',
 'The three historical owner-question versions are combined in research/claude-drafts/owner-questions.md. Historical “Decided” statements remain attributed reports, not new owner authorization.','']
(OUT/'undecided.md').write_text('\n'.join(udoc))

reading=load('reported-reading-claims.json');rdoc=['# Reading and coverage claims','',
 '**Every claim here is reported, not verified.** Both versions’ notes are retained verbatim under notes/preserved and notes/new. Quote verification is not a chapter-reading audit.','']
rdoc+=table(['Side','Notes file','Status','Opening reported coverage statement'],[[x['side'],x['file'],x['status'],x['reportedPassages'][0] if x['reportedPassages'] else 'See complete notes; no matching coverage wording extracted.'] for x in reading])
rdoc+=['','All matching reported passages, including qualifications elsewhere in the notes: [reported-reading-claims.json](reported-reading-claims.json).','']
(OUT/'reported-reading-claims.md').write_text('\n'.join(rdoc))
summary={'branch':'research-merge-second-pass','base':m['base'],'inputRecords':303,'mergedRecords':250,'statusCounts':dict(collections.Counter(r['mergeStatus'] for r in records)),'quotePass':passed,'quoteFail':len(failed),'quoteChecks':sum(len(q['checks']) for q in quotes['records']),'ownerQuestionEntries':len(load('owner-questions-merged.json')),'notesVersionsPreserved':len(m['notes']),'witnessDecisionsHeld':len(undecided),'protectedStateUnchanged':True,'idCollisions':0,'publishedIdCollisions':0,'otherDraftIdCollisions':0}
if (OUT/'quote-corrections.json').exists():
 corrections=load('quote-corrections.json')
 assert corrections['recordsCorrected']==28
 assert all(qmap[c['id']]['quoteResult']=='PASS' for c in corrections['records'])
 summary['quoteCorrectionsFromCheckpoint']={'checkpoint':corrections['baselineCheckpoint'],'originalFailed':28,'corrected':28}
 doc=['# Quote corrections after the unverified draft checkpoint','',
 'All 28 failing checkpoint records were corrected against packaged KJV and the cited editions. The scripture checks remain strict; no checks were disabled. Copied footnotes are retained as separately attributed source notes and verified independently. The two classification holds remain unchanged.','',
 'Checkpoint `4fe1e7d` preserves the original quotations and reports. Full before/after details: [quote-corrections.json](quote-corrections.json). Current per-record checks: [quote-checks.md](quote-checks.md).','']
 doc+=table(['Reference / record','Changed fields','Corrections','Current result'],[[c['ref']+' — '+c['id'],', '.join(c['changedFields']),'; '.join(dict.fromkeys(x['reason'] for x in c['changes'])),qmap[c['id']]['quoteResult']] for c in corrections['records']])
 (OUT/'quote-corrections.md').write_text('\n'.join(doc)+'\n')
save('summary.json',summary)
overview=['# Second-pass research merge review','',
 'This is a local draft merge on branch/worktree `research-merge-second-pass`, based on the preserved review branch. Main, the paused task, the queue and ledger are unchanged. Checkpoint label: Unverified draft checkpoint. Nothing was pushed or published; this checkpoint does not approve the findings.','']
overview+=table(['Result','Count'],[['Source records',303],['Merged draft records',250],['Matched canonical records',51],['Preserved-only records',64],['New-only findings — draft, unverified',133],['Explicit same-ID Samuel variants retained',2],['Quote PASS',passed],['Quote FAIL',len(failed)],['Witness classification decisions held',len(undecided)],['Merged owner-question entries',summary['ownerQuestionEntries']],['Verbatim notes versions retained',len(m['notes'])],['ID collisions',0]])
overview+=['','- [Merge log: every finding, source side, status and correction](merge-log.md)','- [Field-by-field provenance](field-provenance.json)','- [Per-record quote PASS / FAIL](quote-checks.md)','- [Items not decided](undecided.md)','- [Merged owner questions](../../claude-drafts/owner-questions.md)','- [Reading claims: reported, not verified](reported-reading-claims.md)','- [Machine-readable source-to-output crosswalk](record-crosswalk.json)','',
 'Source-check resolutions: Psalm 59’s blanket agreement removed; your-law finding retained with Brenton’s variant note; Isaiah 15:9 uses preserved clause alignment and qualifies lion/Arabs; Isaiah 15:7 stands separately as a clause-level difference; Isaiah 65:11 retains Greek evidence plus the attributed Gad/Meni interpretation and its limits; Psalm 18’s mountains/heaven contrast retains Greek sourcing and qualification.','',
 'Jeremiah’s 9:25 ID is corrected to 9:26. The new versions of the two same-ID Samuel records carry `-new-20261020`; their preserved versions retain their original IDs.','',
 'No later work on Psalm headings, eras or the Jesus profile has started.','']
if (OUT/'quote-corrections.json').exists():overview+=['Quote corrections after checkpoint `4fe1e7d`: [28-record correction log](quote-corrections.md). These remain draft research corrections, not acceptance or publication approval.','']
(OUT/'README.md').write_text('\n'.join(overview))
print(json.dumps(summary,indent=2))
