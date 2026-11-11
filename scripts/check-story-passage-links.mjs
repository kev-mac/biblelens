import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {addUX13Events} from './ux13-content.mjs';
const books=JSON.parse(fs.readFileSync('data/books.json'));
const catalog=addUX13Events(JSON.parse(fs.readFileSync('data/stories.json'))).flatMap(g=>g.stories).filter(s=>s.title!=='Parallel Accounts in Genesis');
const source=fs.readFileSync('src/stories.js','utf8');
const context=vm.createContext({books,window:{},location:{hash:'#stories'},esc:value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))});
vm.runInContext(fs.readFileSync('src/reader-state.js','utf8').split('\n').find(l=>l.startsWith('function readRef(')),context);
vm.runInContext(fs.readFileSync('src/app.js','utf8').split('\n').find(l=>l.startsWith('function passagePillText(')),context);
vm.runInContext(source.slice(0,source.indexOf('async function renderStoriesView')),context);
for(const story of catalog)for(const pivot of [false,true]){
 const html=context.storyCard(story,pivot),ref=context.storyReference(story.passage);
 const header=html.slice(html.indexOf('<div class="story-top-row">'),html.indexOf('<h'+(pivot?3:2)));
 assert.match(header,/<a class="passage-badge story-passage-link"/);
 assert(header.includes(`href="#read/${ref.book}/${ref.chapter}/${ref.verse}"`),story.title);
 assert(header.includes(`aria-label="Read ${context.esc(story.passage)} in the Bible"`));
 assert(!header.includes('data-story-passage'),'Anchor must use native hash routing, not double-trigger the button handler');
 assert.equal((header.match(/<a /g)||[]).length,1);
 assert(html.indexOf('story-passage-link')<html.indexOf('<details'),'Passage stays available while collapsed');
}
assert(context.storyCard(catalog[0]).includes('href="#read/0/1/1"'),'Creation opens Genesis 1:1, not its ending chapter');
const invalid=context.storyCard({...catalog[0],passage:'<unknown "book">'});
assert(!invalid.includes('story-passage-link'),'Unparseable passages remain plain text');
assert(invalid.includes('&lt;unknown &quot;book&quot;&gt;'));
const calls=[];
const reader=vm.createContext({location:{hash:''},readerInitialization:false,books,parseVerseSpec:v=>v.split(',').map(Number),setView:(...args)=>calls.push(['view',...args]),loadChapter:(...args)=>calls.push(['chapter',...args])});
const readerSource=fs.readFileSync('src/reader.js','utf8');
vm.runInContext(readerSource.slice(readerSource.indexOf('function readerRoute(){'),readerSource.indexOf("window.addEventListener('hashchange',readerRoute)")),reader);
for(const hash of ['#read/0/1/1','#read/0/4/1','#stories','#read/0/1/1']){
 reader.location.hash=hash;reader.readerRoute();
}
assert.deepEqual(calls.filter(c=>c[0]==='chapter'),[['chapter',0,1,1,false],['chapter',0,4,1,false],['chapter',0,1,1,false]],'Reader route supports repeated passage navigation and returning from Stories');
console.log(`PASS: ${catalog.length} story heading links in browse/topic views, accessible labels, escaping, fallback, and reader-route navigation.`);
