import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync('src/reader.js','utf8');
const requestSource=source.slice(source.indexOf('async function readerJson('),source.indexOf('const comparisonCache='));
const startupStart=source.indexOf('async function initializeReader(');
const startupSource=source.slice(startupStart,source.indexOf('\n\ndocument.addEventListener',startupStart)).replace(/initializeReader\(\);\s*$/,'');
const catalog=[{id:0,name:'Genesis',chapters:2}];
const passage={name:'Genesis',chapter:1,verses:[{n:1,kjv:'In the beginning'}]};
function fixture({abort=true}={}){
 const timers=new Map(),nodes=new Map(),requests=[],scrolls=[],verseScrolls=[];
 let timerId=0,saves=0,renders=0,updates=0,restores=0;
 const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',hidden:false,setAttribute(name,value){this[name]=value;},scrollIntoView(options){verseScrolls.push({id,...options});}});return nodes.get(id);};
 const context={
  $:node,books:[],reading:null,readingBook:0,readingChapter:1,loadVersion:0,selectedVerses:new Set(),
  state:{notes:{kept:'Private research'},verseNotes:{'0:1:1':{text:'Keep this note'}}},
  location:{hash:'#read'},view:'read',esc:String,
  fetch:(url,options)=>new Promise((resolve,reject)=>requests.push({url,options,resolve,reject})),
  setTimeout:(callback,delay)=>{assert.equal(delay,15000);timers.set(++timerId,callback);return timerId;},
  clearTimeout:id=>timers.delete(id),
  persist(){saves++;},renderReader(){renders++;node('#chapter-text').innerHTML='Passage rendered';},updateContext(){updates++;},
  navigateHash(){},stagePassageDock(){},renderStoriesView(){},chapterOptions(){},
  requestAnimationFrame:fn=>fn(),CustomEvent:class{constructor(type){this.type=type;}},
  window:{scrollY:640,dispatchEvent(){},scrollTo(options){scrolls.push(options);this.scrollY=options.top;},BibleLensNavigation:{restore(){restores++;}}}
 };
 if(abort)context.AbortController=AbortController;
 vm.createContext(context);vm.runInContext(requestSource+startupSource,context);
 return {context,node,requests,timers,scrolls,verseScrolls,get restores(){return restores;},get saves(){return saves;},get renders(){return renders;},get updates(){return updates;},timeout(){const callback=timers.values().next().value;assert(callback,'A deadline is pending');callback();}};
}
const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
const respond=(request,data)=>request.resolve({ok:true,json:async()=>data});

// A pending connection must expose Retry even if a transport ignores abort.
const initial=fixture(),initialNotes=JSON.stringify(initial.context.state);
const stuck=initial.context.initializeReader();assert.equal(initial.requests[0].url,'/api/books');assert.equal(initial.node('#chapter-text')['aria-busy'],'true');assert.match(initial.node('#chapter-text').innerHTML,/loading-state/);
initial.timeout();await stuck;
assert(initial.requests[0].options.signal.aborted);
assert.match(initial.node('#chapter-text').innerHTML,/reader could not connect/);
assert.equal(typeof initial.node('#retry-books').onclick,'function');
assert.equal(initial.timers.size,0);assert.equal(initial.saves,0);assert.equal(initial.node('#chapter-text')['aria-busy'],'false');
assert.equal(JSON.stringify(initial.context.state),initialNotes);

// The actual retry handler reloads books and scripture; a late old response
// cannot replace the successful retry or mutate notes.
const retry=initial.node('#retry-books').onclick();
assert.match(initial.node('#chapter-text').innerHTML,/Loading scripture/);
respond(initial.requests[1],catalog);await flush();
assert.equal(initial.requests[2].url,'/api/chapter?book=0&chapter=1');
respond(initial.requests[2],passage);await retry;
assert.equal(initial.renders,1);assert.equal(initial.node('#chapter-text')['aria-busy'],'false');assert.equal(initial.saves,1);assert.equal(initial.timers.size,0);
assert.equal(initial.context.reading.chapter,1);assert.equal(initial.context.state.notes.kept,'Private research');
respond(initial.requests[0],[{id:0,name:'Stale response',chapters:1}]);await flush();
assert.equal(initial.context.books[0].name,'Genesis');assert.equal(initial.renders,1);

// The deadline includes JSON body consumption, not just response headers.
const body=fixture();body.context.books=catalog;
const slowBody=body.context.loadChapter(0,1);
body.requests[0].resolve({ok:true,json:()=>new Promise(()=>{})});await flush();
body.timeout();await slowBody;
assert(body.requests[0].options.signal.aborted);
assert.match(body.node('#chapter-text').innerHTML,/Could not load this chapter/);
assert.equal(body.node('#reader-status').textContent,'Chapter unavailable. Try again.');
assert.equal(body.saves,0);assert.equal(body.timers.size,0);
const chapterRetry=body.node('#retry-chapter').onclick();respond(body.requests[1],passage);await chapterRetry;
assert.equal(body.renders,1);assert.equal(body.timers.size,0);

// Neither AbortSignal.timeout nor AbortSignal is required. Even an environment
// without AbortController still reaches Retry using the bounded promise.
const fallback=fixture({abort:false});
const pending=fallback.context.initializeReader();fallback.timeout();await pending;
assert.match(fallback.node('#chapter-text').innerHTML,/reader could not connect/);
assert.equal(fallback.timers.size,0);

// Initialization must not overwrite a chapter timeout with a misleading
// zero-verse status after the book catalog itself loaded successfully.
const startup=fixture();const loading=startup.context.initializeReader();
respond(startup.requests[0],catalog);await flush();startup.timeout();await loading;
assert.equal(startup.node('#reader-status').textContent,'Chapter unavailable. Try again.');
assert.equal(startup.updates,0);assert.equal(startup.saves,0);
// Explore is now the home page. Loading its background reader must not steal
// the scroll position while someone browses categories before the response.
const home=fixture();home.context.view='explore';home.context.location.hash='';
const background=home.context.initializeReader();respond(home.requests[0],catalog);await flush();
home.context.window.scrollY=920;respond(home.requests[1],passage);await background;
assert.equal(home.context.window.scrollY,920,'Background startup preserves Explore scroll');
assert.equal(home.scrolls.length,0);assert.equal(home.verseScrolls.length,0);
assert.equal(home.renders,1);assert.equal(home.restores,1,'History restoration remains available');

// The active reader still returns a new chapter to the top and honors a
// linked verse, but a chapter finishing after navigation cannot move Explore.
const active=fixture();active.context.books=catalog;
const whole=active.context.loadChapter(0,1);respond(active.requests[0],passage);await whole;
assert.equal(active.context.window.scrollY,0);assert.equal(active.scrolls.length,1);
const linked=active.context.loadChapter(0,1,1);respond(active.requests[1],passage);await linked;
assert.equal(active.verseScrolls.length,1);assert.equal(active.verseScrolls[0].id,'#verse-1');
const leaving=active.context.loadChapter(0,1,1);active.context.view='explore';active.context.window.scrollY=510;
respond(active.requests[2],passage);await leaving;
assert.equal(active.context.window.scrollY,510);assert.equal(active.verseScrolls.length,1);
assert.equal(active.restores,3,'Every completed chapter can restore browser history');
console.log('PASS: bounded reader startup/body loading, retry recovery, stale response isolation, preserved private notes, background homepage scroll, and reader chapter/verse navigation.');

// An obsolete chapter must not dismiss the current chapter's loading state.
const overlapping=fixture();overlapping.context.books=catalog;
const oldChapter=overlapping.context.loadChapter(0,1),newChapter=overlapping.context.loadChapter(0,2);
respond(overlapping.requests[0],passage);await oldChapter;
assert.equal(overlapping.node('#chapter-text')['aria-busy'],'true');
respond(overlapping.requests[1],{...passage,chapter:2});await newChapter;
assert.equal(overlapping.node('#chapter-text')['aria-busy'],'false');
console.log('PASS: visible reader loading, cleared success/error states, and overlapping-request loading ownership.');
