import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {draftPreviewEnabled, loadDraftDebates, packageDraftDebates} from './draft-debates.mjs';
import {releaseInfo} from './release-info.mjs';
import {assess, report} from './check-readability.mjs';

const productionIdentity=releaseInfo(process.cwd(),{drafts:false}),draftIdentity=releaseInfo(process.cwd(),{drafts:true});
assert.notEqual(productionIdentity.sourceHash,draftIdentity.sourceHash);
assert.equal(productionIdentity.draftOnly,undefined);
assert.equal(draftIdentity.draftOnly,true);
assert.equal(draftIdentity.buildNumber,productionIdentity.buildNumber);
assert.equal(draftPreviewEnabled({}),false);
assert.equal(draftPreviewEnabled({BIBLELENS_DRAFTS:'0'}),false);
assert.equal(draftPreviewEnabled({BIBLELENS_DRAFTS:'1'}),true);
assert.throws(()=>draftPreviewEnabled({BIBLELENS_DRAFTS:'yes'}));
assert.throws(()=>draftPreviewEnabled({BIBLELENS_DRAFTS:'1',NODE_ENV:'production'}));
const untouched={'/debates.js':{body:'original'}};
assert.equal(packageDraftDebates(untouched,{}),false);
assert.deepEqual(untouched,{'/debates.js':{body:'original'}});
const data=loadDraftDebates();
assert.equal(data.candidates.length,40);
assert.equal(data.candidates.filter(row=>row.recommended).length,30);
assert.equal(new Set(data.candidates.map(row=>row.id)).size,40);
const caseLines=[];
for(const row of data.candidates){
 assert.equal(row.review_status,'draft');assert.equal(row.evidence_tier,null);
 for(const side of [row.side_a,row.side_b]){
  assert.ok(side.case.length);for(const line of side.case){assert.ok(row.summary_60_seconds.includes(line));assert.equal(assess(line).tooLong,false);assert.equal(assess(line).unexplained,false);caseLines.push(line);}
  for(const entry of side.passages){assert.match(entry.href,/^#read\/\d+\/\d+\/\d+$/);assert.ok(entry.verses.length);}
 }
 assert.ok(row.sourceRecords.every(record=>record.proposal.id===record.id));
 assert.ok(row.sources.length);
}
report([{name:'Phase 3 exact draft case excerpts',lines:caseLines}]);
// Exercise actual draft card rendering with hostile values, not a separate
// escaping implementation. Drafts must never become a path for script markup.
const context={window:{addEventListener(){}},document:{addEventListener(){}},URL,URLSearchParams,Map,Set};
vm.createContext(context);
vm.runInContext(fs.readFileSync('src/media-slots.js','utf8'),context);
vm.runInContext(fs.readFileSync('src/draft-debates.js','utf8').replace('/*__DRAFT_DEBATES__*/{}',()=>JSON.stringify(data)),context);
const hostile=structuredClone(data.candidates[0]);
hostile.question='<img src=x onerror=alert(1)>';hostile.side_a.kjv_refs=['<script>attack()</script>'];
hostile.sourceRecords[0].proposal.proposed_verdict='" onmouseover="attack()';hostile.id='bad"/><img src=x>';
const html=context.window.BibleLensDraftDebates.card(hostile);
assert.ok(html.includes('data-media-kind="placeholder"'));
assert.ok(html.includes('Credit: Pending review'));
assert.ok(html.includes('Licence: Pending review'));
assert.ok(!html.includes('<img'));assert.ok(!html.includes('<script'));assert.ok(html.includes('&lt;img'));assert.ok(html.includes('href="#debate/bad%22%2F%3E%3Cimg%20src%3Dx%3E?draft=1"'));
// The production artifact audit runs after the normal web and mobile builds.
if(process.argv.includes('--production')){
 for(const file of ['dist/server/index.js',...fs.readdirSync('www/assets').filter(name=>/\.js$/.test(name)).map(name=>'www/assets/'+name)]){
  const text=fs.readFileSync(file,'utf8');
  for(const marker of ['headline-31','Preview draft Big Questions','DRAFT PREVIEW','phase3-draft-notice'])assert.ok(!text.includes(marker),`${file}: leaked ${marker}`);
 }
 assert.ok(!fs.readFileSync('www/index.html','utf8').includes('Preview draft Big Questions'));
 assert.equal(JSON.parse(fs.readFileSync('www/release.json','utf8')).draftOnly,undefined);
}
console.log('PASS: draft build gate, 40 source joins, exact cases, quotes, safe cards and production exclusion');
