import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createPersonMatcher,wrapReferenceNames} from '../src/people-links.js';
const source=fs.readFileSync('src/passage.js','utf8');
const context={state:{verseBookmarks:{},verseNotes:{}},books:[{name:'Genesis'}],storageAvailable:true,esc:s=>String(s).replaceAll('<','&lt;'),persist(){context.saves++},saves:0,renderPassageSaved(){},renderReader(){},toast(){}};
vm.createContext(context);vm.runInContext(source.slice(source.indexOf('function normalizeTextHighlights'),source.indexOf('state.verseBookmarks=normalizeVerseRecords')),context);
const first={edition:'kjv',start:0,end:12,text:'In the <word'};
assert.equal(first.text.length,12);
assert.equal(context.normalizeTextHighlights([{...first,end:0},{...first,edition:'invalid'},{...first,text:'mismatch'}]).length,0);
assert.equal(context.saveTextHighlights([{book:0,chapter:1,verse:1,highlights:[first]}]),true);
assert.equal(context.saveTextHighlights([{book:0,chapter:1,verse:1,highlights:[first]}]),false,'Unchanged selection does not write twice');
const stored=context.normalizeVerseRecords(JSON.parse(JSON.stringify(context.state.verseBookmarks)));
assert.equal(stored['0:1:1'].highlights[0].text,first.text,'Exact selected words survive reload');
assert.equal(context.markedVerseTextParts(first.text,'kjv',0,1,1)[0].highlight.color,'yellow');
context.saveTextHighlights([{book:0,chapter:1,verse:1,highlights:[{...first,color:'pink'}]}]);
assert.equal(context.state.verseBookmarks['0:1:1'].highlights.length,1,'Recoloring updates the selected range instead of duplicating it');
assert.equal(context.normalizeVerseRecords(JSON.parse(JSON.stringify(context.state.verseBookmarks)))['0:1:1'].highlights[0].color,'pink','Selected color survives reload');
assert.equal(context.markedVerseTextParts(first.text,'kjv',0,1,1)[0].highlight.color,'pink');
const second={edition:'web',start:13,end:17,text:'word'};
context.saveTextHighlights([{book:0,chapter:1,verse:1,highlights:[second]}]);assert.equal(context.state.verseBookmarks['0:1:1'].highlights.length,2,'Different editions retain their own ranges');
const people=[{id:'j1',name:'James',refs:[[39,4,21]]},{id:'j2',name:'James',refs:[[44,1,13]]},{id:'moses',name:'Moses',refs:[[1,3,4]],aliases:['Moshe']},{id:'on',name:'On'}];
const match=createPersonMatcher(people);
assert.equal(match('James',{book:39,chapter:4,verse:21})[0].id,'j1');
assert.equal(match('James',{book:44,chapter:1,verse:13})[0].id,'j2');
assert.equal(match('James').length,0,'Ambiguous names need passage evidence');
assert.equal(match('james and moses').length,0,'Common lowercase text stays plain');
assert.equal(match('On Moses Moshe').length,2);
assert.equal(match('Mosesian').length,0);
const html=wrapReferenceNames('Moses <test> James',()=>[],match,{book:39,chapter:4,verse:21});
assert(html.includes('data-person-id="j1"'));assert(html.includes('&lt;test&gt;'));
const raw=JSON.parse(fs.readFileSync('data/reference/people.json','utf8')),real=createPersonMatcher(raw);
assert(real('Abraham').length);assert(real('Moses',{book:1,chapter:3,verse:4}).length);
console.log('PASS: exact highlight storage/reload, escaping, validation, edition separation, duplicate suppression, and passage-aware People links.');

context.state.verseNotes['0:1:1']={title:'Keep this',text:'Personal note'};
assert(context.editTextHighlight(0,1,1,first,'blue'));assert.equal(context.state.verseBookmarks['0:1:1'].highlights[0].color,'blue');
assert(context.editTextHighlight(0,1,1,first,null));assert.equal(context.state.verseBookmarks['0:1:1'].highlights.length,1);
assert(context.state.verseBookmarks['0:1:1']);assert.equal(context.state.verseNotes['0:1:1'].text,'Personal note');
assert(!context.editTextHighlight(0,1,1,first,'not-a-color'));
console.log('PASS: context menu recoloring and removal affect only the matching highlight and preserve its bookmark and private note.');

// Bookmarks render one whole verse per saved edition, with source-positioned
// highlights rather than a duplicate excerpt below the verse.
const rawVerse='And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.';
const phrase='firmament from the waters',offset=rawVerse.indexOf(phrase);
context.state.verseBookmarks['0:1:7']={book:0,chapter:1,verse:7,name:'Genesis',highlights:[{edition:'kjv',start:offset,end:offset+phrase.length,text:phrase,color:'green'}]};
const parts=context.markedVerseTextParts(rawVerse,'kjv',0,1,7);
assert.equal(parts.map(p=>p.text).join(''),rawVerse);assert.equal(parts.filter(p=>p.highlight).map(p=>p.text).join(''),phrase);
assert.equal(context.markedVerseTextParts(rawVerse,'web',0,1,7).filter(p=>p.highlight).length,0,'Do not apply offsets from a different translation');
assert(!context.bookmarkVerseTextHtml(0,1,7).includes('saved-highlight'));
assert(context.bookmarkVerseTextHtml(0,1,7).includes('data-marked-edition="kjv"'),'Saved KJV highlight stays visible even when reader edition changes');
const safeNode=()=>{const node={dataset:{},textContent:''};Object.defineProperty(node,'innerHTML',{set(){throw Error('Source text must never be assigned as HTML')}});return node;};
context.document={createElement:safeNode,createTextNode:text=>({textContent:text})};
const field={replaceChildren(...children){this.children=children}};
context.fillMarkedVerseText(field,rawVerse,'kjv',0,1,7);assert.equal(field.children.map(n=>n.textContent).join(''),rawVerse+' (KJV)');
assert.equal(field.children.filter(n=>n.className==='text-highlight').length,1);assert.equal(field.children.find(n=>n.className==='text-highlight').dataset.highlightColor,'green');
assert.equal(context.markedVerseTextParts(' Public <b>verse</b> {H123} text. ','kjv',0,1,8).map(p=>p.text).join(''),'Public verse text.');
for(const text of ['Light and darkness','The Word','The King','The Sun','The Son'])assert.equal(real(text).length,0,'A descriptive title is not a person name: '+text);
assert(real('Jesus',{book:45,chapter:1,verse:1}).length);assert(real('Amittai',{book:31,chapter:1,verse:1}).length);assert(real('Abel').length);
console.log('PASS: bookmark verse contains the original highlight once, keeps its saved edition and context-menu metadata, uses safe text nodes, and excludes title aliases such as Light.');

// Exercise the real selection controller: selecting/closing/navigation never
// writes; only an explicit color choice may save the current source offsets.
{
 const reader=fs.readFileSync('src/reader.js','utf8');
 const controller=reader.slice(reader.indexOf('// Native text selection keeps'),reader.indexOf('// A saved highlight has its own menu;'));
 const text='In the beginning God created the heaven and the earth.';
 const body={dataset:{book:'0',chapter:'1',verse:'1'}},scripture={nodeType:1,closest:()=>body};
 scripture.closest=selector=>selector.includes('[data-scripture]')?scripture:body;
 const textNode={nodeType:3,parentElement:scripture};
 let start=3,end=16,coarse=true,collapsed=false;
 const range={startContainer:textNode,endContainer:textNode,get startOffset(){return start},get endOffset(){return end},getBoundingClientRect:()=>({left:30,top:160,bottom:200,width:120}),intersectsNode:()=>true,compareBoundaryPoints:kind=>kind===0?1:-1};
 const selection={get rangeCount(){return collapsed?0:1},get isCollapsed(){return collapsed},anchorNode:textNode,focusNode:textNode,getRangeAt:()=>range,removeAllRanges(){collapsed=true;emit('selectionchange');}};
 const properties={},classes=new Set(),events={},windowEvents={},viewportEvents={},timers=new Map(),writes=[];let sequence=0,renders=0;
 const buttons=['yellow','green','blue','pink','purple','orange'].map(color=>({dataset:{highlightChoice:color},attributes:{},setAttribute(key,value){this.attributes[key]=value;}}));
 const picker={hidden:true,dataset:{},style:{},events:{},setAttribute(){},addEventListener(name,fn){this.events[name]=fn},querySelectorAll:()=>buttons,getBoundingClientRect(){return {width:parseFloat(this.style.width)||270,height:this.dataset.docked==='true'?112:46}}};
 const document={createElement:()=>picker,body:{append(){},classList:{add:key=>classes.add(key),remove:key=>classes.delete(key)}},documentElement:{style:{setProperty:(key,value)=>properties[key]=value,removeProperty:key=>delete properties[key]}},querySelector:selector=>selector==='body>header'?{getBoundingClientRect:()=>({bottom:100})}:null,querySelectorAll:()=>[scripture],addEventListener(name,fn){(events[name]??=[]).push(fn)},createRange(){return {startContainer:textNode,startOffset:0,endOffset:text.length,selectNodeContents(){},setStart(node,offset){this.startOffset=offset},setEnd(node,offset){this.endOffset=offset},cloneContents(){return {textContent:text.slice(this.startOffset,this.endOffset),querySelectorAll:()=>[]}}}}};
 function emit(name,event={}){for(const handler of events[name]||[])handler(event);}
 function flush(){let count=0;while(timers.size){assert(count++<20);const [id,callback]=timers.entries().next().value;timers.delete(id);callback();}}
 const window={getSelection:()=>selection,matchMedia:()=>({matches:coarse}),innerWidth:375,innerHeight:800,visualViewport:{offsetTop:40,offsetLeft:0,width:375,height:600,addEventListener(name,fn){viewportEvents[name]=fn}},addEventListener(name,fn){windowEvents[name]=fn}};
 const c={document,window,Range:{START_TO_START:0,END_TO_END:2},readingBook:0,readingChapter:1,reading:{verses:[{n:1,kjv:text}]},$:()=>({value:'kjv'}),setTimeout:callback=>{const id=++sequence;timers.set(id,callback);return id},clearTimeout:id=>timers.delete(id),saveTextHighlights:entries=>{writes.push(JSON.parse(JSON.stringify(entries)));return true},comparisonStatus(){},renderReader(){renders++}};
 vm.createContext(c);vm.runInContext(controller,c);
 emit('selectionchange');flush();
 assert.equal(writes.length,0,'Merely selecting text must not save a default highlight');
 assert(buttons.every(button=>button.attributes['aria-pressed']==='false'));
 assert.equal(picker.dataset.docked,'true');assert.equal(picker.hidden,false);assert(classes.has('highlight-selecting'));
 assert.equal(parseFloat(picker.style.top)+112,40+600-8,'Touch toolbar stays above the visible viewport bottom');
 const click=key=>picker.events.click({target:{closest:selector=>selector==='[data-highlight-choice]'&&key!=='close'?buttons.find(button=>button.dataset.highlightChoice===key):selector==='[data-highlight-close]'&&key==='close'?{}:null}});
 click('close');flush();assert.equal(writes.length,0);assert(!classes.has('highlight-selecting'));
 collapsed=false;emit('selectionchange');flush();
 // Select different words immediately before a swatch tap, ahead of debounce.
 start=17;end=28;click('blue');
 assert.equal(writes.length,1);assert.equal(writes[0][0].highlights[0].text,text.slice(17,28));assert.equal(writes[0][0].highlights[0].color,'blue');
 assert.equal(renders,0,'Saving leaves the native selection and drag handles intact');
 emit('selectionchange');flush();assert.equal(writes.length,1,'Selection notifications do not write again');
 start=29;end=35;emit('selectionchange');flush();
 assert(buttons.every(button=>button.attributes['aria-pressed']==='false'),'Changing the range requires a fresh color choice');
 windowEvents.viewchange();flush();assert.equal(writes.length,1,'Leaving an unconfirmed range does not save it');assert.equal(renders,1);assert(!classes.has('highlight-selecting'));
 coarse=false;collapsed=false;start=3;end=16;emit('selectionchange');flush();assert.equal(picker.dataset.docked,'false');assert.equal(picker.style.width,'');
 assert.equal(writes.length,1,'Mouse selections also require an explicit color');
 coarse=true;viewportEvents.resize();assert.equal(picker.dataset.docked,'true');
 window.visualViewport.height=450;viewportEvents.scroll();assert.equal(parseFloat(picker.style.top)+112,40+450-8);
 collapsed=true;emit('selectionchange');flush();assert.equal(writes.length,1);assert.equal(picker.hidden,true);assert(!classes.has('highlight-selecting'));
 console.log('PASS: opt-in highlight saving, no default swatch, cancel/navigation safety, live range validation, preserved selection, touch docking, viewport changes, and mouse fallback.');
}
