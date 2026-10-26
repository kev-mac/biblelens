import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync('src/reader.js','utf8'),handlers={},moves=[],loads=[],notices=[];
let blocked=false,selected='',clock=1000;
function element(id){const classes=new Set();return{id,hidden:true,dataset:{},style:{setProperty(k,v){this[k]=v}},classList:{add(k){classes.add(k)},remove(k){classes.delete(k)},toggle(k,on){if(on)classes.add(k);else classes.delete(k)},contains:k=>classes.has(k)},getBoundingClientRect(){return{width:500}},addEventListener(type,fn,capture){handlers[id+':'+type+(capture===true?':capture':'')]=fn}};}
const article=element('chapter-text'),peek=element('chapter-swipe-peek'),elements={'#chapter-text':article,'#chapter-swipe-peek':peek};
const context={$:id=>elements[id],document:{querySelector:()=>blocked?{}:null},window:{getSelection:()=>({toString:()=>selected}),addEventListener:(k,fn)=>handlers['window:'+k]=fn},matchMedia:()=>({matches:true}),Date:{now:()=>clock},toast:msg=>notices.push(msg),loadChapter:async(b,c)=>{loads.push([b,c]);context.readingBook=b;context.readingChapter=c;context.loadVersion++;},view:'read',books:[{name:'Genesis',chapters:2},{name:'Exodus',chapters:2}],reading:{},readingBook:0,readingChapter:1,loadVersion:0};
vm.createContext(context);vm.runInContext(source.slice(source.indexOf('let chapterPaging='),source.indexOf("$('#book-select').onchange")),context);
const dispatch=context.moveChapter;context.moveChapter=(d,x)=>moves.push([d,x]);vm.runInContext(source.slice(source.indexOf('// Edge controls'),source.indexOf('// The category tray')),context);
const target={closest:()=>null},touch=(x,y)=>({clientX:x,clientY:y});
const start=()=>handlers['chapter-text:touchstart']({target,touches:[touch(200,200)]});let prevented=0;
const move=(x,y)=>handlers['chapter-text:touchmove']({touches:[touch(x,y)],cancelable:true,preventDefault(){prevented++}});
const end=()=>handlers['chapter-text:touchend']({touches:[],changedTouches:[touch(0,0)]});
start();move(80,205);assert.equal(article.style.transform,'translate3d(-120px,0,0)');assert.equal(peek.hidden,false);assert.equal(peek.textContent,'Genesis 2 →');assert(peek.classList.contains('ready'));end();assert.deepEqual(moves.pop(),[1,-120]);assert(peek.hidden);
context.readingChapter=2;start();move(310,205);end();assert.deepEqual(moves.pop(),[-1,110]);context.readingChapter=1;
start();move(121,200);assert(!peek.classList.contains('ready'));end();assert.equal(moves.length,0);assert.equal(article.style.transform,'');
start();const before=prevented;move(190,250);assert.equal(prevented,before,'Vertical scrolling is never prevented');move(80,250);end();assert.equal(moves.length,0,'Axis lock does not change after a vertical start');
start();move(80,200);handlers['chapter-text:touchcancel']();assert(peek.hidden);assert.equal(article.style.transform,'');end();assert.equal(moves.length,0);
selected='text';start();move(80,200);end();selected='';assert.equal(moves.length,0);
blocked=true;start();move(80,200);end();blocked=false;assert.equal(moves.length,0);
start();move(320,200);assert(peek.hidden,'No incoming chapter beyond the boundary');end();assert.equal(moves.length,0);
start();move(80,200);end();let suppressed=0;handlers['chapter-text:click:capture']({preventDefault(){suppressed++},stopImmediatePropagation(){suppressed++}});assert.equal(suppressed,2);moves.length=0;
context.moveChapter=dispatch;await dispatch(-1);assert.equal(loads.length,0);assert.match(notices.pop(),/first chapter/);await dispatch(1);assert.deepEqual(loads.pop(),[0,2]);await dispatch(1);assert.deepEqual(loads.pop(),[1,1]);context.readingChapter=2;await dispatch(1);assert.match(notices.pop(),/last chapter/);
blocked=true;await dispatch(-1);assert.equal(loads.length,0);blocked=false;context.readingBook=0;context.readingChapter=1;await Promise.all([dispatch(1),dispatch(1)]);assert.equal(loads.length,1);assert.equal(article.style.transform,'');assert.equal(article.style.opacity,'');
const html=fs.readFileSync('src/index.html','utf8');assert(!html.includes('id="edge-prev"'));assert(!html.includes('id="edge-next"'));assert(html.includes('id="chapter-swipe-peek"'));
console.log('PASS: finger tracking, axis lock, 80px threshold, edge cue, cancel/snap back, click suppression, boundaries, modal/selection guards, and serialized chapter loading.');

// Chapter transitions leave loading/error content visible while the request waits.
context.readingBook=0;context.readingChapter=1;
let finishChapter;
context.loadChapter=()=>new Promise(resolve=>{finishChapter=resolve;context.loadVersion++;});
const delayedChapter=dispatch(1);await Promise.resolve();await Promise.resolve();
assert.equal(article.style.opacity,'','A slow request must not hide its loading placeholder');
finishChapter();await delayedChapter;
console.log('PASS: chapter-loading feedback remains visible during page transitions.');
