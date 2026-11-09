import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync('src/accepted-questions.js','utf8');
const questions=JSON.parse(fs.readFileSync('data/rc1-accepted.json')).questions;
function fixture({fail=false,deferred=false}={}){
 let html='',finish;const calls=[];
 const control={setAttribute(){},textContent:'',focus(){},onclick:null};
 const host={set innerHTML(value){html=value;},get innerHTML(){return html;},querySelector(){return control;}};
 const ready=deferred?new Promise(resolve=>finish=resolve):Promise.resolve();
 const context={window:{BibleLensDebateStore:{read:()=>({saved:false,stance:null})}},document:{addEventListener(){},getElementById:id=>id==='accepted-question-filters'?null:host,querySelector:()=>control},location:{hash:'#debate/headline-01'},fetch:async()=>({ok:true,json:async()=>questions}),URLSearchParams,setTimeout,clearTimeout,navigationRestore:false,restoreNavigation(){},uiTitleCase:value=>value,scriptureComparison:value=>'Bible vs. '+(value==='text'?'Bible':value),passagePillText:refs=>refs.join(', '),readRef(){},setView(value){context.view=value;}};
 context.window.BibleLensFeatures={async load(name){calls.push(name);await ready;if(fail)throw Error('Study feature unavailable');context.referenceLink=ref=>'<a data-cite="fixture" data-cite-context="true">'+ref+'</a>';}};
 vm.createContext(context);vm.runInContext(source,context);
 return {context,host,control,calls,get html(){return html;},finish:()=>finish?.()};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
for(const row of questions){
 const app=fixture();assert.equal(typeof app.context.referenceLink,'undefined','Cold Evidence has no reader helper.');
 assert(app.context.window.BibleLensAcceptedQuestions.route('#debate/'+row.id));await tick();
 assert.deepEqual(app.calls,['study'],row.id+': explicitly load the feature before rendering citations.');
 assert(app.html.includes('data-accepted-save'),row.id+': full question renders from a cold route.');
 assert(app.html.includes('data-cite-context="true"'),row.id+': citation context remains interactive.');
 assert(!app.html.includes('Question Unavailable'),row.id);
}
const offline=fixture({fail:true});offline.context.window.BibleLensAcceptedQuestions.route('#debate/'+questions[0].id);await tick();assert(offline.html.includes('data-accepted-detail-retry'),'A failed required feature is retryable, not reported as missing research.');
const stale=fixture({deferred:true});stale.context.window.BibleLensAcceptedQuestions.route('#debate/'+questions[0].id);await tick();stale.context.window.BibleLensAcceptedQuestions.route('#discover');stale.finish();await tick();assert(!stale.html.includes('data-accepted-save'),'Late feature completion cannot replace another destination.');
assert.equal(stale.context.window.BibleLensAcceptedQuestions.route('#questions?collection=featured&draft=1'),false,'Production featured routes do not override explicit draft navigation.');
console.log('PASS: all 30 cold question routes load required citation helpers; retry, stale navigation and draft boundaries remain explicit. This is a module regression, not browser/device verification.');
