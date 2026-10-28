import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {b4Proposals,b4Content,contentFiles,neutralTree} from './b4-neutral.mjs';
import {findings,framingAudit} from './check-neutral-framing.mjs';
import {copyLiterals} from './copy-literals.mjs';
import {loadDraftDebates} from './draft-debates.mjs';
import {corpusConfig} from '../research/b4/corpus-config-proposal.mjs';
import {report,words,assess} from './check-readability.mjs';
const read=file=>fs.readFileSync(file,'utf8'),json=file=>JSON.parse(read(file));
const baseline=file=>execFileSync('git',['show','codex/b3:'+file],{encoding:'utf8',maxBuffer:64*1024*1024});
for(const file of [...contentFiles,'data/books.json','data/chapters.json','src/data.js','src/sync-core.js','src/sync.js','worker/sync.mjs','db/schema.ts','package.json','CLAUDE.md']){if(file==='package.json'){assert.equal(json(file).buildNumber,275);assert.deepEqual(json(file).dependencies,JSON.parse(baseline(file)).dependencies);}else assert.equal(read(file),['src/sync-core.js','src/sync.js','worker/sync.mjs'].includes(file)?execFileSync('git',['show','853c116:'+file],{encoding:'utf8'}):baseline(file),file+' changed a pinned source');}
const ledgerLabel=text=>Object.entries({'Real conflict':'Wording differs','Can be reconciled':'Readings can fit together','Different detail':'Details differ','Open question':'Interpretation remains open','Evidence agrees':'Evidence matches the text','Evidence disagrees':'Evidence points elsewhere','not a debate':'Instruction in context'}).reduce((value,[from,to])=>value.split(from).join(to),text);
const normalizedLedger=rows=>rows.map(row=>({...row,proposed_verdict:ledgerLabel(row.proposed_verdict),reason:ledgerLabel(row.reason),notes:row.notes.map(ledgerLabel)}));
assert.deepEqual(normalizedLedger(json('research/verdict-ledger/ledger.json')),normalizedLedger(JSON.parse(baseline('research/verdict-ledger/ledger.json'))),'Ledger changes must be limited to accepted label names');
const archiveNow=json('research/headline-debates/candidates.json'),archiveBefore=JSON.parse(baseline('research/headline-debates/candidates.json'));
for(const key of ['base_commit','evidence_sha256','kjv_sha256'])delete archiveNow[key],delete archiveBefore[key];
assert.deepEqual(archiveNow,archiveBefore,'Headline content changed while refreshing pins');
assert.equal(json('package.json').buildNumber,275);
assert.deepEqual(json('research/b4/wording-proposals.json'),b4Proposals(),'Regenerate B4 proposals after any wording-rule change');
let changed=0;
for(const file of contentFiles){
 const original=json(file),draft=JSON.parse(b4Content(file,{BIBLELENS_DRAFTS:'1'}));
 assert.equal(b4Content(file,{}),read(file),'Normal builds must use accepted text');
 const compare=(a,b,path=[])=>{
  if(Array.isArray(a)){assert.equal(a.length,b.length);a.forEach((v,i)=>compare(v,b[i],[...path,i]));return;}
  if(a&&typeof a==='object'){assert.deepEqual(Object.keys(a),Object.keys(b));for(const key of Object.keys(a))compare(a[key],b[key],[...path,key]);return;}
  if(a===b)return;changed++;assert.equal(typeof a,'string');assert.equal(typeof b,'string');
  assert(!path.some(key=>['id','mode','status','checked','tag','tags','witness','sources','sides','quote','refs','ref','quote_checks','provenance'].includes(key)),file+': protected field '+path.join('.'));
  assert.deepEqual(a.match(/“[^”]*”|"[^"\n]*"/g)||[],b.match(/“[^”]*”|"[^"\n]*"/g)||[],file+': quote changed '+path.join('.'));
  assert.deepEqual(a.match(/\d+/g)||[],b.match(/\d+/g)||[],file+': numbers changed '+path.join('.'));
 };
 compare(original,draft);
}
assert.deepEqual(corpusConfig.files,{books:'data/books.json',chapters:'data/chapters.json',evidence:'data/evidence.json'});
assert.deepEqual(corpusConfig.editions,['web','kjv','asv']);assert.equal(corpusConfig.id,'bible');
const readings=json('research/b4/reading-proposals.json');assert.equal(readings.ownerAccepted,false);assert.equal(readings.records.length,40);
for(const [i,row] of readings.records.entries()){
 assert.equal(row.id,`headline-${String(i+1).padStart(2,'0')}`);assert.equal(row.decisionId,`B${String(i+1).padStart(2,'0')}`);assert.equal(row.selectionAccepted,i<30);assert.equal(row.reviewStatus,'draft');assert.equal(row.readings.length,2);assert(row.sources.length);assert(row.limits&&row.attributionReview);
}
const before=read('research/b4/B1-decisions-before.md'),after=read('research/b4/B1-decisions.md');
const ids=text=>[...text.matchAll(/^\| ([A-M]\d+[a-z]?) \|/gm)].map(match=>match[1]);assert.deepEqual(ids(after),ids(before),'Decision IDs/order changed');
const cells=text=>text.split('\n').filter(line=>/^\| [A-M]\d+[a-z]? \|/.test(line)).map(line=>line.split('|').at(-2).trim());
const canonical=text=>text.toLowerCase().replace(/wording differs/g,'real conflict').replace(/readings can fit together/g,'can be reconciled').replace(/details differ/g,'different detail').replace(/interpretation remains open/g,'open question').replace(/instruction in context/g,'not a debate').replace(/evidence matches the text/g,'evidence agrees').replace(/evidence points elsewhere/g,'evidence disagrees').replace(/what the evidence shows/g,'verdict').replace(/big questions/g,'debates').replace(/big question/g,'debate').replace(/text comparisons/g,'contradictions').replace(/difference between passages|text comparison/g,'contradiction').replace(/establish(?:es|ed|ing)?/g,'prove').replace(/prov(?:e[sd]?|ing|en)/g,'prove');
assert.deepEqual(cells(after).filter((_,i)=>ids(after)[i]!=='A00a').map(canonical),cells(before).filter((_,i)=>ids(before)[i]!=='A00a').map(canonical),'Recommended default changed');
assert(after.includes('ACCEPTED 2026-10-28: Wording differs;'),'Owner-approved label decision missing');
// New copy, including quoted copy, must fail without an exact quotation exception.
for(const text of ['This app is a debate tool.','This disproves the reading.','This proves the account.','Use it to debunk religion.','“This proves the account.”'])assert(findings(text).length,text);
assert.equal(findings('“that I may prove them, whether they will walk in my law, or no”').length,0);
assert.equal(findings('Explore scripture and its sources.').length,0);
for(const label of ['Evidence agrees','Evidence disagrees','Real conflict','Can be reconciled','Different detail','Open question','not a debate'])assert(findings(label,{labels:true}).length,'Obsolete label was accepted: '+label);
for(const label of json('research/b6/owner-decisions.json').A00a.labels)assert.equal(findings(label,{labels:true}).length,0,'Owner label was rejected: '+label);
const literals=copyLiterals('const internalVerdict=1; // proves\n const x=`Read ${fn("This proves it")}<p>Explore</p>`;');assert(literals.some(row=>row.text==='This proves it'));assert(!literals.some(row=>row.text.includes('// proves')));
const audit=framingAudit();assert.deepEqual(audit.violations,[]);assert.deepEqual(audit.renames,[]);
const loader=read('src/feature-loader.js'),scope=vm.createContext({});vm.runInContext(loader.slice(loader.indexOf('function requirements('),loader.indexOf('let routing=')),scope);
for(const hash of ['#questions','#questions?draft=1','#debates','#debate','#debate/missing'])assert.equal(JSON.stringify(scope.requirements(hash)),JSON.stringify(['debates']),'Cold feature route '+hash);
const drafts=loadDraftDebates();assert.equal(drafts.candidates.length,40);assert(drafts.candidates.every(row=>row.reading_review));
const lines=readings.records.flatMap(row=>row.readings.map(reading=>reading.summary));
const readabilityFailed=report([{name:'B4 main reading proposals',lines}]);
for(const line of lines)assert(!assess(line).tooLong,line);
assert.equal(readabilityFailed,false,'B4 reading proposals must meet the collection limits');
const mean=lines.reduce((sum,line)=>sum+assess(line).grade,0)/lines.length;assert(mean>=6&&mean<=8,'B4 collection grade must be 6–8');
console.log(`PASS: B4 pinned sources, ${changed} draft fields, exact quotations/numbers, IDs/defaults, B01–B30, corpus paths, framing negative controls and new reading limits.`);
