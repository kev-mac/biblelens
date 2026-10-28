// Run from the repository root. Read-only checks for the reviewed draft subset.
import fs from 'node:fs';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {validateWitnesses} from '../../../scripts/witness-labels.mjs';
import {timelineCatalog} from '../../../scripts/timeline-catalog.mjs';
import {assess,words} from '../../../scripts/check-readability.mjs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const audit=read('research/codex-reviews/2026-10-26/audit.json'), decisions=new Map(audit.decisions.map(d=>[d.id,d]));
const books=read('data/books.json'),chapters=read('data/chapters.json');
const packed=new Map(Object.entries(chapters).map(([key,raw])=>[key,JSON.parse(zlib.gunzipSync(Buffer.from(raw,'base64')))]));
const verse=ref=>{const m=/^(.*?) (\d+):(\d+)$/.exec(ref),b=books.find(b=>b.name===m?.[1]);assert(b,ref);const v=packed.get(`${b.id}:${+m[2]}`)?.verses.find(v=>v.n===+m[3]);assert(v,ref);return v.kjv;};
const profiles=[],evidence=[],events=[];const current=new Map(),original=new Map(),ready=[];
for(const f of Object.keys(audit.input_sha256).filter(f=>f.endsWith('records.json'))){
 const before=JSON.parse(execFileSync('git',['show',`${audit.draft_commit}:research/claude-drafts/${f}`],{encoding:'utf8'}));
 const after=read('research/claude-drafts/'+f);
 for(const r of Array.isArray(before)?before:before.events)original.set(r.id,r);
 for(const r of Array.isArray(after)?after:after.events){current.set(r.id,r);if(decisions.get(r.id)?.verdict==='return to research')continue;
  ready.push({file:f,record:r});
  if(f.includes('characters'))profiles.push(r);else if(f==='academic-cards-records.json')events.push(r);else evidence.push(r);
 }
 if(after.history_records)evidence.push(...after.history_records);
}
let returned=0;for(const [id,r]of original)if(decisions.get(id).verdict==='return to research'){assert.deepEqual(current.get(id),r,id+' returned record changed');returned++;}
validateWitnesses(evidence,books,chapters);
for(const r of evidence)for(const ref of r.refs){assert.equal(books[ref.book].name+' '+ref.chapter+':'+ref.verse,ref.label);verse(ref.label);}
const src=fs.readFileSync('scripts/characters.mjs','utf8').replace(/^import .*;$/gm,'').replaceAll('export ','');
const combined=[...read('src/data/characters.json'),...profiles];
const count=vm.runInNewContext(src+'\nvalidateCharacters()', {fs:{...fs,readFileSync:(f,...args)=>f==='src/data/characters.json'?JSON.stringify(combined):fs.readFileSync(f,...args)},zlib,Buffer});
const errors=[];const kjv=[];
for(const r of evidence){
 for(const m of r.text.matchAll(/KJV ([^:]+ \d+:\d+(?:[–-]\d+|, \d+)?):\s*“([^”]+)”/g)){
  const match=/^(.*?) (\d+):(\d+)(?:([–-]|, )(\d+))?$/.exec(m[1]);let refs=[];
  if(match[4]===', ')refs=[+match[3],+match[5]];else for(let v=+match[3];v<=+(match[5]||match[3]);v++)refs.push(v);
  const full=refs.map(v=>verse(`${match[1]} ${match[2]}:${v}`)).join(' ');const pass=full.includes(m[2]);kjv.push({id:r.id,ref:m[1],quote:m[2],pass});if(!pass)errors.push({type:'KJV quote',id:r.id,ref:m[1],quote:m[2]});
 }
}
const people=read('data/reference/people.json'),allIds=new Set(combined.map(p=>p.id));
for(const r of profiles){
 const binding=r.reference_binding,p=people.find(p=>p.sourceRecord===binding.sourceRecord);assert.equal(p.id,binding.reference_id,r.id);assert.equal(binding.inherit_family_edges,false);
 assert.equal(r.lineage_bindings.policy,'explicit_only');for(const link of r.lineage_bindings.links){assert(allIds.has(link.profile_id));assert(r.lineage[link.relation].includes(link.label));}
 for(const ref of r.narrative_anchors.key_verses)verse(ref);
}
const lines=[];for(const r of evidence)for(const f of ['summary','reasoning','scope'])lines.push({id:r.id,field:f,text:r[f],group:r.mode==='history'?'History':'Evidence'});
for(const r of profiles)lines.push({id:r.id,field:'summary',text:r.summary,group:'People'});
const segmenter=new Intl.Segmenter('en',{granularity:'sentence'}), long=[];
for(const l of lines){const a=assess(l.text);if(a.tooLong||a.unexplained){for(const s of segmenter.segment(l.text.replace(/“[^”]*”|"[^"\n]*"/g,' '))){const n=words(s.segment).length;if(n>20)long.push({...l,text:s.segment,words:n});}if(a.unexplained)long.push({...l,jargon:a.counts.filter(c=>c.unexplained)});}}
const stats={returnedUnchanged:returned,evidenceSchema:evidence.length,characterSchema:count,proposedProfiles:profiles.length,timelineDrafts:events.length,kjvQuotes:kjv.length,kjvQuoteErrors:errors.length};
if(events.length&&evidence.some(e=>e.mode==='history'))stats.timelineSchema=timelineCatalog({events},[...read('data/evidence.json'),...evidence]).length;
for(const g of ['Evidence','People','History']){const scores=lines.filter(l=>l.group===g).map(l=>assess(l.text).grade).filter(x=>x!==null);if(scores.length)stats[g+'MeanGrade']=scores.reduce((a,b)=>a+b,0)/scores.length;}

assert.equal(returned,13);
assert.equal(profiles.length,138);
assert.equal(evidence.filter(r=>r.mode==='history').length,4);
assert.equal(events.length,4);
assert.equal(evidence.length,49);
assert.equal(count,185);
assert.equal(errors.length,0,JSON.stringify(errors));
assert.equal(long.length,0,JSON.stringify(long));
for(const g of ['Evidence','People','History']) assert(stats[g+'MeanGrade']<=8,g+' exceeds grade 8');
const originalAccepted=audit.decisions.filter(d=>d.verdict==='accept with fixes');
for(const d of originalAccepted)assert(ready.some(({record:r})=>(r.draft_input_ids||[r.draft_input_id||r.id]).includes(d.id)),d.id+' lost');
assert.equal(originalAccepted.length,188);
assert.equal(ready.length,187);
for(const r of evidence){
 for(const field of ['title','ref','summary','text','reasoning','scope','checked'])assert(r[field]?.trim(),r.id+' '+field);
 for(const s of r.sources)assert(s.label&&new URL(s.url).protocol==='https:',r.id+' source');
 if(r.mode==='history')assert.equal(r.status,'Context');
}
let keyVerses=0,storyLinks=0;const otherProse=[];
for(const r of profiles){
 keyVerses+=r.narrative_anchors.key_verses.length;storyLinks+=r.narrative_anchors.linked_stories.length;
 for(const [field,v]of Object.entries({origin:r.geography.origin,residence:r.geography.residence,aliases:r.aliases,lineage:Object.values(r.lineage||{}).flat()})){
  for(const t of Array.isArray(v)?v:[v])if(typeof t==='string'){const score=assess(t);assert(!score.tooLong&&!score.unexplained,r.id+' '+field+': '+t);otherProse.push({id:r.id,field});}
 }
}
for(const e of events)for(const f of ['traditional_date','review_status']){const score=assess(e[f]);assert(!score.tooLong&&!score.unexplained,e.id+' '+f);}
const flatVerses=[];
for(const [key,chapter]of packed){const [id,c]=key.split(':');for(const v of chapter.verses)flatVerses.push({ref:books.find(b=>b.id===+id).name+' '+c+':'+v.n,text:v.kjv});}
const profileQuotes=[];
for(const r of profiles)for(const m of r.summary.matchAll(/“([^”]+)”/g)){
 const matches=flatVerses.filter(v=>v.text.includes(m[1])).map(v=>v.ref);
 assert(matches.length,r.id+' unmatched quote: '+m[1]);
 const anchored=matches.filter(ref=>r.narrative_anchors.key_verses.includes(ref));
 profileQuotes.push({id:r.id,quote:m[1],matches:anchored.length?anchored:matches.slice(0,3),totalMatches:matches.length});
}
const prohibited={eli:['phinehas'],jeroboam:['nadab'],jehu:['jehoshaphat'],hur:['bezalel'], 'joseph-husband-of-mary':['jesus'],'mary-mother-of-jesus':['joseph']};
for(const r of profiles)for(const link of r.lineage_bindings.links)assert(!prohibited[r.id]?.includes(link.profile_id),r.id+' wrong family identity');
for(const [id,target]of [['mary-mother-of-jesus','joseph-husband-of-mary'],['joseph-husband-of-mary','mary-mother-of-jesus'],['andrew','peter'],['peter','andrew'],['james-son-of-zebedee','john-son-of-zebedee'],['john-son-of-zebedee','james-son-of-zebedee']])assert(profiles.find(r=>r.id===id).lineage_bindings.links.some(l=>l.profile_id===target),id+' missing reciprocal link');
const baseEsther=read('data/evidence.json').find(r=>r.id==='god-named-in-the-greek-of-esther-where-the-kjv-names-none');
const extended=evidence.find(r=>r.id===baseEsther.id);
for(const field of ['refs','appliesTo','sides','sources'])for(const item of baseEsther[field])assert(extended[field].some(x=>JSON.stringify(x)===JSON.stringify(item)),'Esther lost '+field);
assert(!flatVerses.filter(v=>v.ref.startsWith('Esther ')).some(v=>/\b(?:god|gods|lord)\b/i.test(v.text)));
for(const r of evidence)for(const id of r.draft_related_records||[])assert(read('data/evidence.json').some(e=>e.id===id),'Missing related record '+id);
const files={};for(const f of Object.keys(audit.input_sha256).filter(f=>f.endsWith('records.json')))files[f]=crypto.createHash('sha256').update(fs.readFileSync('research/claude-drafts/'+f)).digest('hex');
stats.acceptedInputs=188;stats.readyProposals=187;stats.profileKeyVerses=keyVerses;stats.profileStoryLinks=storyLinks;stats.profileQuotes=profileQuotes.length;stats.otherProfileProse=otherProse.length;
console.log(JSON.stringify({stats,files,kjv,profileQuotes},null,2));
