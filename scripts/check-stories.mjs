import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import {validateStories} from './stories.mjs';

const catalog=JSON.parse(fs.readFileSync('data/stories.json','utf8'));
const books=JSON.parse(fs.readFileSync('data/books.json','utf8'));
const chapters=JSON.parse(fs.readFileSync('data/chapters.json','utf8'));
const topics=JSON.parse(fs.readFileSync('data/reference/topics.json','utf8'));
const options={books,chapters,topics};
const total=validateStories(catalog,options);
const genesis=catalog.find(entry=>entry.book==='Genesis');
const exodus=catalog.find(entry=>entry.book==='Exodus');
assert(genesis&&exodus,'Both reviewed story batches must be present');
const changed=mutate=>{const copy=structuredClone(catalog);mutate(copy);return copy;};
assert.throws(()=>validateStories(changed(c=>c.reverse()),options),/book order/);
assert.throws(()=>validateStories(changed(c=>c[1].stories[0].title=c[0].stories[0].title),options),/Duplicate story/);
assert.throws(()=>validateStories(changed(c=>c[0].stories.push({...c[0].stories[0],title:c[0].stories[0].title+'!'})),options),/Duplicate story/);
assert.throws(()=>validateStories(changed(c=>c[1].stories[0].passage='Genesis 1:1'),options),/Wrong story book/);
assert.throws(()=>validateStories(changed(c=>c[1].stories[0].passage='Exodus 1:1-41:1'),options),/Missing story chapter/);
assert.throws(()=>validateStories(changed(c=>c[1].stories[0].cross_references=['Acts 7:999']),options),/Missing story verse/);
assert.throws(()=>validateStories(changed(c=>c[1].stories[0].topics=['Invented theme']),options),/Invalid story topics/);
assert.throws(()=>validateStories(changed(c=>c[1].stories[0].passage='Exodus 2:1-1:1'),options),/Reversed story passage/);
const nodes=new Map(),handlers={},loads=[];
const node=id=>{if(!nodes.has(id))nodes.set(id,{hidden:false,innerHTML:'',textContent:'',setAttribute(name,value){this[name]=value;},addEventListener(){},focus(){},showModal(){this.open=true;},close(){this.open=false;}});return nodes.get(id);};
const c={AbortSignal,window:{addEventListener(){}},location:{hash:''},books,readingBook:0,$:node,esc:s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),categoryIcon:()=>'<svg></svg>',document:{body:{classList:{toggle(){},add(){},remove(){}}},getElementById:id=>({...node(id),classList:{add(){}},scrollIntoView(){}}),addEventListener:(type,fn)=>{handlers[type]=fn;}},setView(){},loadChapter:(...args)=>loads.push(args),fetch:async()=>({ok:true,json:async()=>catalog})};
c.readRef=reference=>{const match=/^(.*?) (\d+):(\d+)/.exec(reference),book=match&&books.find(b=>b.name===match[1]);return book?{book:book.id,chapter:+match[2],verse:+match[3]}:null;};
c.window.BibleLensReferences={json:async path=>(await c.fetch(path)).json()};
vm.createContext(c);
// Load the real shared passage-pill formatter before the story renderer.
vm.runInContext(fs.readFileSync('src/app.js','utf8').split('\n').find(line=>line.startsWith('function passagePillText(')),c);
vm.runInContext(fs.readFileSync('src/stories.js','utf8'),c);
const seen=new Set();
for(const entry of catalog){
 assert(!seen.has(entry.book));seen.add(entry.book);assert(books.some(b=>b.name===entry.book));
 assert.deepEqual(Object.keys(entry).sort(),['book','stories']);
 for(const story of entry.stories){
  assert.deepEqual(Object.keys(story).sort(),['cross_references','passage','summary','title','topics']);
  for(const field of ['title','passage','summary'])assert.equal(typeof story[field],'string');
  assert(Array.isArray(story.cross_references));
  assert(story.summary.trim().split(/\s+/).length<=300,story.title+' exceeds the approved word limit');
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
assert.equal((node('#stories-list').innerHTML.match(/class="story-card"/g)||[]).length,24,'The unfiltered Stories page browses the full collection in pages');
assert.match(node('#stories-search').placeholder,/Search \d+ stories/);
assert.equal(node('#stories-results').hidden,false);
assert.match(node('#stories-results').textContent,new RegExp('of '+total+' stories'));
const firstPage=node('#stories-list').innerHTML;await c.renderStoriesView();assert.equal(node('#stories-list').innerHTML,firstPage,'Returning to browse preserves a stable first page');
assert(!node('#reader-layout').hidden);assert(!node('#stories-view').hidden);
assert(c.storyCard(genesis.stories[0]).includes('data-story-passage="Genesis 1:1 - 2:3"'));
assert.equal(c.storiesFilterButton(),'');
const malicious=c.storyCard({...genesis.stories[0],title:'<img onerror="bad">'});assert(!malicious.includes('<img'));
for(const entry of catalog){
 vm.runInContext('storiesBook='+JSON.stringify(entry.book),c);await c.renderStoriesView();
 assert.equal((node('#stories-list').innerHTML.match(/class="story-card"/g)||[]).length,Math.min(24,entry.stories.length));
 assert(node('#stories-list').innerHTML.includes('id="story-'+c.storySlug(entry.stories[0].title)+'"'));
}
vm.runInContext("storiesBook='Exodus';storiesSearch='no matches for this query'",c);await c.renderStoriesView();assert(node('#stories-list').innerHTML.includes('No stories match'));
vm.runInContext("storiesSearch=''",c);
vm.runInContext("storiesBook='Genesis';storiesTheme='Obedience'",c);await c.renderStoriesView();assert.equal((node('#stories-list').innerHTML.match(/class="story-card"/g)||[]).length,Math.min(24,genesis.stories.filter(story=>story.topics.includes('Obedience')).length));
vm.runInContext("storiesTheme='';storiesSearch='noah'",c);await c.renderStoriesView();assert(node('#stories-list').innerHTML.includes('Noah'));
// Keywords can occur in different fields and in either order.
for(const query of ['jonah fish','fish jonah','  JONAH   FISH  ','Jonah, fish']){
 vm.runInContext("storiesBook='';storiesTheme='';storiesSearch="+JSON.stringify(query),c);await c.renderStoriesView();
 assert(node('#stories-list').innerHTML.includes('id="story-jonah-flees-and-is-swallowed"'),query);
 assert.equal(node('#stories-list')['aria-busy'],'false');
}
vm.runInContext("storiesSearch='jonah fish zqxvblorp'",c);await c.renderStoriesView();assert(node('#stories-list').innerHTML.includes('No stories match'));
vm.runInContext("storiesBook='Genesis';storiesSearch='jonah fish'",c);await c.renderStoriesView();assert(node('#stories-list').innerHTML.includes('No stories match'),'Book filters still constrain keyword search');
vm.runInContext("storiesSearch=''",c);
handlers.click({target:{closest:s=>s==='[data-story-passage]'?{dataset:{storyPassage:'Genesis 6:9 - 9:17'}}:null}});
assert.deepEqual(loads,[[0,6,9]]);assert(!node('#reader-layout').hidden);assert(node('#stories-view').hidden);
// A delayed catalog response cannot replace the newly selected book.
let resolve;vm.runInContext('storiesRequest=null;storiesActive=true',c);c.readingBook=0;vm.runInContext("storiesBook='Genesis'",c);c.fetch=()=>new Promise(r=>{resolve=r;});
const stale=c.renderStoriesView();assert.equal(node('#stories-list')['aria-busy'],'true');c.readingBook=1;vm.runInContext("storiesBook='Exodus'",c);const fresh=c.renderStoriesView();resolve({ok:true,json:async()=>catalog});await Promise.all([stale,fresh]);
assert.equal((node('#stories-list').innerHTML.match(/class="story-card"/g)||[]).length,Math.min(24,exodus.stories.length));
assert.equal(node('#stories-list')['aria-busy'],'false');
assert(!node('#stories-list').innerHTML.includes('id="story-'+c.storySlug(genesis.stories[0].title)+'"'));
console.log(`PASS: ${total} stories in canon order, unique titles/slugs, reference bounds, topic vocabulary, per-book/all-book selection, empty search, passage navigation and stale-response protection.`);

c.location.hash='#stories/exodus/the-burning-bush';
await c.routeLinkedStory();
assert(node('#stories-list').innerHTML.includes('id="story-the-burning-bush"'));
assert.equal(node('#stories-book').value,'Exodus');
assert(!node('#stories-list').innerHTML.includes('Story not found'));
c.location.hash='';
handlers.click({target:{closest:s=>s==='[data-story-passage]'?{dataset:{storyPassage:'Exodus 3:1 - 4:17'}}:null}});
assert.deepEqual(loads.at(-1),[1,3,1]);

const origin=genesis.stories.find(s=>s.topics.some(t=>genesis.stories.some(other=>other!==s&&other.topics.includes(t))));
const theme=origin.topics.find(t=>genesis.stories.some(other=>other!==origin&&other.topics.includes(t)));
await c.openStoryTopic(theme,origin.passage);
assert(node('#story-topic-sheet').open);assert.equal(node('#story-topic-heading').textContent,theme);
assert(!node('#story-topic-body').innerHTML.includes(`data-story-passage="${origin.passage}"`));
assert(!node('#story-topic-body').innerHTML.includes('class="story-themes"'),'Story cards reserve this space for narrative');
await c.openStoryTopic('No matches',origin.passage);assert(node('#story-topic-body').innerHTML.includes('No other stories'));
c.closeStoryTopic();assert(!node('#story-topic-sheet').open);
const unsafe=c.storyCard({...origin,topics:['<script>"&']});assert(!unsafe.includes('<script>'));
const shared=exodus.stories.find(story=>story.topics.some(topic=>genesis.stories.some(other=>other.topics.includes(topic))));
assert(shared,'Reviewed books must exercise cross-book topic navigation');
const sharedTopic=shared.topics.find(topic=>genesis.stories.some(other=>other.topics.includes(topic)));
await c.openStoryTopic(sharedTopic,shared.passage);
assert(node('#story-topic-body').innerHTML.includes(genesis.stories.find(story=>story.topics.includes(sharedTopic)).passage));
console.log('PASS: Topic pivot filters, origin exclusion, empty results, closing and escaped themes.');

// Pagination is bounded, preserves filters, resets on filter changes, and keeps
// direct story routes working even when the target is past the first ten.
c.location.hash='';vm.runInContext("storiesActive=true;storiesBook='Genesis';storiesTheme='';storiesSearch='';storiesPage=0",c);
await c.renderStoriesView();
assert.equal((node('#stories-list').innerHTML.match(/class="story-card"/g)||[]).length,24);
assert(node('#stories-previous').disabled);assert(!node('#stories-next').disabled);assert(!node('#stories-pagination').hidden);
const page1=node('#stories-list').innerHTML;
await handlers.click({target:{closest:selector=>selector==='[data-stories-page]'?{disabled:false,dataset:{storiesPage:'1'}}:null}});
assert.equal((node('#stories-list').innerHTML.match(/class="story-card"/g)||[]).length,Math.min(24,genesis.stories.length-24));
assert(!node('#stories-list').innerHTML.includes('id="story-'+c.storySlug(genesis.stories[0].title)+'"'));
assert(node('#stories-results').textContent.startsWith(`Showing 25–${Math.min(48,genesis.stories.length)} of `));assert(!node('#stories-previous').disabled);
await handlers.click({target:{closest:selector=>selector==='[data-stories-page]'?{disabled:false,dataset:{storiesPage:'-1'}}:null}});assert.equal(node('#stories-list').innerHTML,page1,'Previous returns to the same first-page stories');
vm.runInContext('storiesPage=999',c);await c.renderStoriesView();assert(node('#stories-next').disabled);assert((node('#stories-list').innerHTML.match(/class="story-card"/g)||[]).length<=24);
node('#stories-book').value='Genesis';node('#stories-search').value='no matches';node('#stories-theme').value='';c.updateStoriesFilters();await c.renderStoriesView();
assert.equal(vm.runInContext('storiesPage',c),0);assert(node('#stories-pagination').hidden);assert(node('#stories-list').innerHTML.includes('No stories match'));
c.location.hash='#stories/genesis/'+c.storySlug(genesis.stories.at(-1).title);await c.routeLinkedStory();
assert(node('#stories-list').innerHTML.includes('id="story-'+c.storySlug(genesis.stories.at(-1).title)+'"'));assert(node('#stories-pagination').hidden);
console.log('PASS: 24-story pages, page bounds, next/previous state, result ranges, filter resets, empty results, and late-story deep links.');

// Stories expose the passage action directly while retaining their complete range.
const sectionCard=c.storyCard(genesis.stories[0]);
assert(sectionCard.includes('data-story-book="0" data-story-chapter="1" data-story-verse="1" data-story-end-chapter="2" data-story-end-verse="3"'));
assert(sectionCard.includes('Read story →</button>'));
assert(!sectionCard.includes('data-story-section'));
assert(sectionCard.includes('<div class="story-summary"><p>'+genesis.stories[0].summary.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')+'</p></div>'));
console.log('PASS: Full-range story anchors, direct reader action and unchanged narrative summary.');
