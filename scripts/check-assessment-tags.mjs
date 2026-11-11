import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import postcss from 'postcss';
import {DOMParser} from '@xmldom/xmldom';
import {debateVerdict} from '../worker/debates.mjs';

const read=file=>fs.readFileSync(file,'utf8');
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const context={window:{},esc,uiTitleCase:value=>value,ENTRIES:[],passagePillText:refs=>refs.join(', ')};
vm.createContext(context);vm.runInContext(read('src/debate-ui.js'),context);
const ui=context.window.BibleLensDebates;
const parse=html=>new DOMParser().parseFromString('<root>'+html+'</root>','text/xml');
const records=JSON.parse(read('data/evidence.json'));
for(const record of records){
 const label=debateVerdict(record),node=parse(ui.badge({...record,verdict:label})).getElementsByTagName('span')[0];
 assert.equal(node.textContent,label,'Keep the existing editorial wording');
 assert.equal(node.getAttribute('data-status'),record.status);
 assert.equal(node.getAttribute('data-assessment'),label.toLowerCase());
}
const acceptedSource=read('src/accepted-questions.js');
vm.runInContext(acceptedSource.slice(acceptedSource.indexOf(' const href='),acceptedSource.indexOf(' const subjects='))+';this.acceptedCard=card;',context);
const accepted=JSON.parse(read('data/rc1-accepted.json')).questions;
for(const row of accepted){
 const doc=parse(context.acceptedCard(row)),spans=[...Array(doc.getElementsByTagName('span').length)].map((_,i)=>doc.getElementsByTagName('span')[i]);
 const tags=spans.filter(node=>node.hasAttribute('data-assessment'));
 assert.deepEqual(tags.map(node=>node.textContent),row.labels,'Every label keeps its own text, even on multi-label records');
 assert.deepEqual(tags.map(node=>node.getAttribute('data-assessment')),row.labels.map(label=>label.toLowerCase()));
 assert.equal(doc.getElementsByTagName('a')[0].getAttribute('href'),row.href||'#debate/'+row.id);
 assert.equal(spans.find(node=>node.getAttribute('class')==='action-link').textContent,'View question');
}
const fallback=context.acceptedCard({...accepted[0],labels:[],topic:true});
assert.match(fallback,/Passage comparison/);assert(!fallback.includes('data-assessment'),'A record type is not relabeled as an assessment');
const hostile=context.acceptedCard({...accepted[0],labels:['"><img src=x onerror=bad>']});
assert(!hostile.includes('<img'),'Escape the assessment text and attribute');
const card=ui.card({id:'sample',mode:'history',status:'Context',ref:'Genesis 1:1',title:'Existing title',summary:'Existing summary.',readingMinutes:2});
assert.match(card,/View record/);assert.match(card,/2 min read/);assert(!card.includes('View details'),'Rejected proposal 16 is not introduced');

const rules=[];postcss.parse(read('src/overrides.css')).walkRules(rule=>{if(!rule.parent.name)rules.push(rule);});
const value=(selector,prop)=>rules.filter(rule=>rule.selector===selector).flatMap(rule=>rule.nodes.filter(node=>node.prop===prop)).at(-1)?.value;
const reader='html body.lens-app #chapter-text .verse-body .lens-verse-evidence .verse-study-pill';
const tag='html body.lens-app #main #debates-view.directory-hub .phase2-debate-card .phase2-verdict[data-assessment]';
for(const prop of ['font','letter-spacing','background','border','border-radius','padding'])assert.equal(value(tag,prop),value(reader,prop),'Match Read verse tag '+prop);
assert.equal(value(tag,'white-space'),'normal');assert.equal(value(tag,'text-transform'),'uppercase');
const palette=new Map();
for(const rule of rules){const color=rule.nodes.find(node=>node.prop==='--assessment-rgb');if(color)for(const [,label]of rule.selector.matchAll(/\[data-assessment="([^"]+)"\]/g))palette.set(label,color.value);}
for(const label of ['conflicts with evidence','evidence matches the text','wording differs','not settled','interpretation remains open'])assert(palette.has(label));
assert.equal(new Set(['conflicts with evidence','evidence matches the text','wording differs','not settled','interpretation remains open'].map(label=>palette.get(label))).size,5,'Keep open and not-settled assessments distinct');
assert(value('html body.lens-app.dark #main #debates-view.directory-hub .phase2-debate-card .phase2-verdict[data-assessment]','color').includes('70%,white'));
console.log('PASS: existing verdicts, separate accepted labels, unchanged card actions/links, type-label fallback, escaping, five colors, and exact Read verse tag size. Browser geometry remains separate.');
