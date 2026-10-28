import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {validateCommandments,redLetters} from './commandments.mjs';
import worker from './built-worker.mjs';
const read=name=>JSON.parse(fs.readFileSync('data/'+name+'.json','utf8'));
const records=read('evidence'),books=read('books'),chapters=read('chapters'),red=redLetters(),commands=records.filter(r=>r.mode==='commandments');
assert.equal(validateCommandments(records,books,chapters,red),commands.length);
const pilot=JSON.parse(fs.readFileSync('research/claude-drafts/commandments-pilot-records.json','utf8'));
const pilotRecords=commands.filter(r=>pilot.some(p=>p.id===r.id));
assert.equal(pilotRecords.length,42);
assert.equal(pilotRecords.filter(r=>r.tenCommandments).length,10);
assert.equal(pilotRecords.filter(r=>r.wordsOfJesus).length,17);
assert.equal(new Set(pilotRecords.map(r=>r.theme)).size,12);
const fixture=commands[0];
for(const change of [{tags:['V']},{theme:'invalid'},{commandmentType:'invalid'},{wordsOfJesus:true},{repeatedIn:['Deuteronomy 5:999']},{relatedRecords:['missing']}])assert.throws(()=>validateCommandments([{...fixture,...change}],books,chapters,red));
const reader=fs.readFileSync('src/reader.js','utf8'),marked=fs.readFileSync('src/marked.js','utf8');
const ctx={books,RED_LETTERS:red,esc:String,readRef:ref=>{const m=/^(.*?) (\d+):(\d+)/.exec(ref),b=m&&books.find(b=>b.name===m[1]);return b?{book:b.id,chapter:+m[2],verse:+m[3]}:null;},markedTheme:'all',markedCommandmentType:'all',markedKind:'commandments',markedChapterSelection:0};vm.createContext(ctx);
vm.runInContext(reader.slice(reader.indexOf('const comparisonCache='),reader.indexOf('function scienceDetails(')),ctx);
vm.runInContext(marked.slice(marked.indexOf('function markedChoices'),marked.indexOf('function markedVerseRow')),ctx);
for(const book of [1,4,39]){
 const response=await worker.fetch(new Request('https://test/api/marked-comparisons?book='+book),{},{});assert.equal(response.status,200);ctx.markedData=await response.json();
 const found=ctx.markedData.records.filter(r=>r.mode==='commandments');assert.equal(found.length,commands.filter(r=>r.refs.some(ref=>ref.book===book)).length);
 for(const r of found){assert(ctx.markedRecordVisible(r));assert.equal(ctx.filterCategory(r),'commandments');assert.equal(ctx.comparisonTone(r),'commandments');assert(ctx.categoryRank(r)>ctx.categoryRank({tag:'V'}));assert(ctx.categoryRank(r)<ctx.categoryRank({tag:'Q'}));assert(ctx.markedMatchingPlacements(r).length);}
 ctx.markedTheme='Family';for(const r of found)assert.equal(ctx.markedCommandmentMatches(r),r.theme==='Family');ctx.markedTheme='all';
 ctx.markedCommandmentType='ritual';for(const r of found)assert.equal(ctx.markedCommandmentMatches(r),r.commandmentType==='ritual');ctx.markedCommandmentType='all';
}
assert(!ctx.commandmentLabels({...fixture,wordsOfJesus:true}).includes('Words of Jesus'));
assert(ctx.commandmentLabels({...commands.find(r=>r.wordsOfJesus),wordsOfJesus:false}).includes('Words of Jesus'));
assert(!ctx.commandmentLabels({...fixture,repeatedIn:['Matthew 22:37']}).includes('Words of Jesus'));
assert(ctx.commandmentLabels(fixture).includes('Ten Commandments'));
assert(ctx.commandmentLabels(fixture).includes('Old Testament'));assert(ctx.commandmentLabels(commands.find(r=>r.wordsOfJesus)).includes('New Testament'));
assert(ctx.commandmentRepetitions(commands.find(r=>r.repeatedIn?.some(ref=>ref.includes('-')))).includes('data-cite-end='));
ctx.markedSummary=r=>r.id;const pinned=commands.find(r=>r.tenCommandments&&r.theme==='Property and economics'),ordinary=commands.find(r=>!r.tenCommandments&&r.theme===pinned.theme);
const html=ctx.markedCommandmentGroups([ordinary,pinned]);assert(html.indexOf(pinned.id)<html.indexOf(ordinary.id));assert(html.includes('Property and economics'));assert(html.includes('marked-count">2'));assert(html.includes('<details class="marked-theme-group"><summary'));assert(!html.includes('<details class="marked-theme-group" open>'));assert(html.includes('marked-theme-content'));
for(const [book,chapter] of [[1,20],[4,6],[39,5],[39,6],[39,7],[39,22]]){const response=await worker.fetch(new Request(`https://test/api/comparisons?book=${book}&chapter=${chapter}&mode=commandments`),{},{});assert.equal(response.status,200);const data=await response.json();assert(data.items.some(r=>r.placementRole==='key'));assert(data.items.every(r=>r.mode==='commandments'&&!r.activeTags.length));}
assert(marked.includes('id="marked-theme-filter"'));assert(marked.includes('id="marked-type-filter"'));assert(marked.includes('data-commandment-type='));
console.log('PASS: 42 commandments, 10 Ten Commandments, 17 derived Jesus labels, 12 themes, schema rejection, book/chapter API visibility, theme/type filtering, pinned order and range citations.');
