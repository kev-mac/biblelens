import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync('src/reader.js','utf8'),handlers={},moves=[],loads=[],notices=[];
assert(source.includes('.verse-preview:not([hidden])'),'Hidden preview shells must not block paging');
let blocked=false,selected='',clock=1000;
function element(id){return{id,style:{},classList:{add(){},remove(){}},setAttribute(){},append(){},getBoundingClientRect(){return{left:0,top:56,width:32,height:700}},addEventListener(type,fn,capture){handlers[id+':'+type+(capture===true?':capture':'')]=fn;}};}
const elements=Object.fromEntries(['edge-prev','edge-next','chapter-text'].map(id=>['#'+id,element(id)]));
const context={$:id=>elements[id],document:{querySelector:()=>blocked?{}:null,createElement:()=>({...element('ripple'),remove(){}})},window:{getSelection:()=>({toString:()=>selected})},matchMedia:()=>({matches:true}),Date:{now:()=>clock},setTimeout(){return 1},clearTimeout(){},toast:msg=>notices.push(msg),loadChapter:async(b,c)=>{loads.push([b,c]);context.readingBook=b;context.readingChapter=c;context.loadVersion++;},view:'explore',books:[{chapters:2},{chapters:2}],reading:{},readingBook:0,readingChapter:1,loadVersion:0};
vm.createContext(context);
vm.runInContext(source.slice(source.indexOf('let chapterPaging='),source.indexOf("$('#book-select').onchange")),context);
const dispatch=context.moveChapter;context.moveChapter=d=>moves.push(d);
vm.runInContext(source.slice(source.indexOf('// Edge controls'),source.indexOf('// The category tray')),context);
const target={closest:()=>null},touch=(x,y)=>({clientX:x,clientY:y});
function start(){handlers['chapter-text:touchstart']({target,touches:[touch(200,200)]});}
function end(x,y){handlers['chapter-text:touchend']({touches:[],changedTouches:[touch(x,y)]});}
start();end(140,205);assert.equal(moves.pop(),1);
start();end(260,205);assert.equal(moves.pop(),-1);
start();end(151,200);assert.equal(moves.length,0);
start();end(130,231);assert.equal(moves.length,0);
start();handlers['chapter-text:touchmove']({touches:[touch(180,240)]});end(130,200);assert.equal(moves.length,0,'Vertical excursion stays cancelled');
start();handlers['chapter-text:touchcancel']();end(130,200);assert.equal(moves.length,0);
start();clock+=700;end(130,200);assert.equal(moves.length,0,'Long press');
selected='verse';start();end(130,200);selected='';assert.equal(moves.length,0,'Text selection');
blocked=true;start();end(130,200);blocked=false;assert.equal(moves.length,0,'Modal');
handlers['edge-next:click']({detail:0});assert.equal(moves.pop(),1,'One tap');
let prevented=0;start();end(130,200);handlers['chapter-text:click:capture']({preventDefault(){prevented++},stopImmediatePropagation(){prevented++}});assert.equal(prevented,2);moves.length=0;
context.moveChapter=dispatch;
await dispatch(-1);assert.equal(loads.length,0);assert.match(notices.pop(),/first chapter/);
await dispatch(1);assert.deepEqual(loads.pop(),[0,2]);
await dispatch(1);assert.deepEqual(loads.pop(),[1,1]);
context.readingChapter=2;await dispatch(1);assert.equal(loads.length,0);assert.match(notices.pop(),/last chapter/);
blocked=true;await dispatch(-1);assert.equal(loads.length,0);
blocked=false;context.readingBook=0;context.readingChapter=1;
await Promise.all([dispatch(1),dispatch(1)]);assert.equal(loads.length,1,'Repeated input serialized');
console.log('PASS: edge taps, guarded swipes, selection and modal protection, chapter boundaries, and repeat-input lock.');
