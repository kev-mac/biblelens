import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {debateCard,debatePage,compareEvidenceReferences,groupEvidenceDisplay} from '../worker/debates.mjs';

const records=JSON.parse(fs.readFileSync('data/evidence.json','utf8')),before=JSON.stringify(records);
const expected=[
 ['genesis-wife-sister-12','genesis-wife-sister-20','genesis-wife-sister-26'],
 ['genesis-bethel-naming-28','genesis-bethel-naming-35'],
 ['restore-the-lamb-fourfold-or-sevenfold-2-samuel-12-6-greek','restore-the-lamb-fourfold-or-sevenfold-2-samuel-12-6-greek-new-20261020'],
 ['a-bow-of-steel-or-a-bow-of-bronze-2-samuel-22-35-greek','a-bow-of-steel-or-a-bow-of-bronze-2-samuel-22-35-greek-new-20261020']
];
const grouped=groupEvidenceDisplay([...records].sort(compareEvidenceReferences));
assert.deepEqual(grouped.filter(group=>group.key).map(group=>group.recordIds),expected,'Only the four approved families are grouped');
assert.equal(grouped.length,records.length-5);
const read=params=>debatePage(records,new URLSearchParams(params));
for(const mode of ['text','science','history']){
 const included=records.filter(record=>mode==='text'?!['science','history'].includes(record.mode):record.mode===mode).sort(compareEvidenceReferences);
 const initial=read({mode}),defaults=[];
 assert.equal(initial.total,included.length);assert(!('displayGroups' in initial),'Default API response remains record-based');
 for(let page=0;page<Math.ceil(initial.total/24);page++)defaults.push(...read({mode,page} ).records);
 assert.deepEqual(defaults,included.map(debateCard),'Unrequested API results and their order are unchanged');
 const start=read({mode,group:'display'}),seen=[];
 assert.equal(start.total,included.length,'Total still counts records');
 for(let page=0;page<Math.ceil(start.displayTotal/24);page++){
  const result=read({mode,page,group:'display'});assert(result.displayGroups.length<=24);
  assert.deepEqual(new Set(result.records.map(row=>row.id)),new Set(result.displayGroups.flatMap(group=>group.recordIds)));
  for(const row of result.records)assert.deepEqual(row,debateCard(records.find(record=>record.id===row.id)),'Grouping cannot alter a member card');
  seen.push(...result.displayGroups.flatMap(group=>group.recordIds));
 }
 assert.equal(new Set(seen).size,included.length);assert.equal(seen.length,included.length,'No missing or repeated member across pages');
 assert.deepEqual(read({mode,page:999,group:'display'}).page,Math.ceil(start.displayTotal/24)-1);
}
for(const [mode,q] of [['history','wife sister'],['history','Bethel'],['text','fourfold sevenfold'],['text','bow bronze'],['text','Hebrew'],['text','no match zzzz']]){
 const matching=[];let first=read({mode,q});
 for(let page=0;page<Math.ceil(first.total/24);page++)matching.push(...read({mode,q,page}).records.map(row=>row.id));
 const displayed=[];first=read({mode,q,group:'display'});
 for(let page=0;page<Math.ceil(first.displayTotal/24);page++)displayed.push(...read({mode,q,page,group:'display'}).records.map(row=>row.id));
 assert.deepEqual(new Set(displayed),new Set(matching),'Search matches every original member, without adding nonmatching siblings');
}
for(const ids of expected)for(const id of ids){
 const record=records.find(row=>row.id===id),result=read({mode:record.mode==='history'?'history':'text',group:'display',id});
 assert.deepEqual(result.records.map(row=>row.id),[id]);assert.equal(result.total,1);assert.equal(result.displayTotal,1);assert(!result.displayGroups[0].key,'A single matching member stays an ordinary record');
}
const partial=new URLSearchParams({mode:'history',group:'display'});partial.append('id',expected[0][0]);partial.append('id',expected[0][2]);
assert.deepEqual(debatePage(records,partial).displayGroups[0].recordIds,[expected[0][0],expected[0][2]]);
for(const mode of ['history','text'])for(const status of ['Context','Textual conflict','Disagrees','missing']){
 const result=read({mode,status,group:'display'});assert(result.records.every(record=>record.status===status),'Status filters cannot inherit a sibling verdict');
}
const filler=Array.from({length:23},(_,index)=>({id:'fixture-'+index,mode:'history',status:'Context',ref:`Genesis 1:${index+1}`}));
const boundary=[...filler,...expected.slice(0,2).flatMap(ids=>ids.map(id=>records.find(record=>record.id===id)))];
const first=debatePage(boundary,new URLSearchParams({mode:'history',group:'display'})),last=debatePage(boundary,new URLSearchParams({mode:'history',group:'display',page:1}));
assert.equal(first.displayTotal,25);assert.equal(first.total,28);assert.deepEqual(first.displayGroups.at(-1).recordIds,expected[0]);assert.deepEqual(last.displayGroups[0].recordIds,expected[1],'Pagination never splits a group');
assert.equal(read({day:'2026-10-26',group:'display'}).total,1);
assert.equal(JSON.stringify(records),before,'No source record is mutated');

const escape=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const context={window:{},ENTRIES:[],esc:escape,uiTitleCase:value=>value,passagePillText:refs=>refs.join(' · ')};
vm.runInNewContext(fs.readFileSync('src/debate-ui.js','utf8'),context);
for(const group of grouped.filter(group=>group.key)){
 const members=group.recordIds.map(id=>debateCard(records.find(row=>row.id===id))),html=context.window.BibleLensDebates.groupCard(group,members);
 assert(html.startsWith('<article '),'A group is not a replacement record link');
 assert.equal((html.match(/<a /g)||[]).length,members.length);
 for(const member of members){assert(html.includes(`href="#debate/${member.id}"`));assert(html.includes(`data-status="${member.status}"`));assert(html.includes(escape(member.verdict)));}
 assert(html.includes(`${members.length} records`));assert(html.includes('data-assessment='),'Approved assessment chips remain in each member');
 if(group.kind==='versions'){assert(html.includes('Version 1')&&html.includes('Version 2'));assert(html.includes('aria-label="View version 1:')&&html.includes('aria-label="View version 2:'),'Versions have distinct accessible link names');}
}
const hostile=context.window.BibleLensDebates.groupCard({key:'safe',title:'<img src=x>',kind:'passages'},[{id:'safe',title:'" onmouseover="bad',ref:'<script>',status:'Context',mode:'history'}]);
assert(!hostile.includes('<img'));assert(!hostile.includes('<script>'));assert(hostile.includes('&quot;'));
console.log('PASS: four approved display groups, all 1,933 records preserved, unchanged default API, matching-only search/filter groups, atomic pagination, exact original links/assessment chips, escaping, daily selection, and no source mutation.');
