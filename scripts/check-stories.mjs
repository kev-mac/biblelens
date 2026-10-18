import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';

const catalog=JSON.parse(fs.readFileSync('data/stories.json','utf8'));
const books=JSON.parse(fs.readFileSync('data/books.json','utf8'));
const chapters=JSON.parse(fs.readFileSync('data/chapters.json','utf8'));
const nodes=new Map(),handlers={},loads=[];
const node=id=>{if(!nodes.has(id))nodes.set(id,{hidden:false,innerHTML:'',textContent:'',addEventListener(){},focus(){},showModal(){this.open=true;},close(){this.open=false;}});return nodes.get(id);};
const c={window:{addEventListener(){}},location:{hash:''},books,readingBook:0,$:node,esc:s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),categoryIcon:()=>'<svg></svg>',document:{body:{classList:{toggle(){},add(){},remove(){}}},addEventListener:(type,fn)=>{handlers[type]=fn;}},setView(){},loadChapter:(...args)=>loads.push(args),fetch:async()=>({ok:true,json:async()=>catalog})};
c.readRef=reference=>{const match=/^(.*?) (\d+):(\d+)/.exec(reference),book=match&&books.find(b=>b.name===match[1]);return book?{book:book.id,chapter:+match[2],verse:+match[3]}:null;};
vm.createContext(c);vm.runInContext(fs.readFileSync('src/stories.js','utf8'),c);
const seen=new Set();
for(const entry of catalog){
 assert(!seen.has(entry.book));seen.add(entry.book);assert(books.some(b=>b.name===entry.book));
 assert.deepEqual(Object.keys(entry).sort(),['book','stories']);
 for(const story of entry.stories){
  assert.deepEqual(Object.keys(story).sort(),['cross_references','passage','summary','title','topics']);
  for(const field of ['title','passage','summary'])assert.equal(typeof story[field],'string');
  assert(Array.isArray(story.cross_references));
  assert(story.topics.length<=5);assert.equal(new Set(story.topics).size,story.topics.length);
  for(const label of [story.passage,...story.cross_references]){
   const ref=c.storyReference(label);assert(ref,label);
   for(const [chapter,verse]of [[ref.chapter,ref.verse],[ref.endChapter,ref.endVerse]]){
    const data=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[ref.book+':'+chapter],'base64')));
    assert(data.verses.some(v=>v.n===verse),label);
   }
   assert(ref.endChapter>ref.chapter||ref.endChapter===ref.chapter&&ref.endVerse>=ref.verse,label);
  }
 }
}
vm.runInContext('storiesActive=true',c);await c.renderStoriesView();
assert.equal((node('#stories-list').innerHTML.match(/class="story-card"/g)||[]).length,catalog[0].stories.length);
assert(node('#reader-layout').hidden);assert(!node('#stories-view').hidden);
assert(node('#stories-list').innerHTML.includes('data-cite="42/1/1" data-cite-end="3"'));
assert(c.storiesFilterButton().includes('aria-pressed="true"'));
const malicious=c.storyCard({...catalog[0].stories[0],title:'<img onerror="bad">'});assert(!malicious.includes('<img'));
c.readingBook=1;await c.renderStoriesView();assert(node('#stories-list').innerHTML.includes('No stories have been added'));
handlers.click({target:{closest:s=>s==='[data-story-passage]'?{dataset:{storyPassage:'Genesis 6:9 - 9:17'}}:null}});
assert.deepEqual(loads,[[0,6,9]]);assert(!node('#reader-layout').hidden);assert(node('#stories-view').hidden);
// A delayed catalog response cannot replace the newly selected book.
let resolve;vm.runInContext('storiesRequest=null;storiesActive=true',c);c.readingBook=0;c.fetch=()=>new Promise(r=>{resolve=r;});
const stale=c.renderStoriesView();c.readingBook=1;const fresh=c.renderStoriesView();resolve({ok:true,json:async()=>catalog});await Promise.all([stale,fresh]);
assert(node('#stories-list').innerHTML.includes('No stories have been added'));
console.log('PASS: Genesis story bounds, escaped cards, book-wide selection, empty books, passage navigation and stale-response protection.');

const origin=catalog[0].stories.find(s=>s.topics.some(t=>catalog[0].stories.some(other=>other!==s&&other.topics.includes(t))));
const theme=origin.topics.find(t=>catalog[0].stories.some(other=>other!==origin&&other.topics.includes(t)));
await c.openStoryTopic(theme,origin.passage);
assert(node('#story-topic-sheet').open);assert.equal(node('#story-topic-heading').textContent,theme);
assert(!node('#story-topic-body').innerHTML.includes(`data-story-passage="${origin.passage}"`));
assert(node('#story-topic-body').innerHTML.includes('data-story-topic='));
await c.openStoryTopic('No matches',origin.passage);assert(node('#story-topic-body').innerHTML.includes('No other stories'));
c.closeStoryTopic();assert(!node('#story-topic-sheet').open);
const unsafe=c.storyCard({...origin,topics:['<script>"&']});assert(!unsafe.includes('<script>'));
console.log('PASS: Topic pivot filters, origin exclusion, empty results, closing and escaped themes.');
