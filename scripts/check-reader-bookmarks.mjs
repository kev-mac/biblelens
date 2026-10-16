import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync('src/reader.js','utf8'),handlers={},marks=[];let now=10000,modal=false;
const context={state:{verseBookmarks:{}},readingBook:0,readingChapter:11,Date:{now:()=>now},document:{querySelector:()=>modal?{}:null,addEventListener:(type,fn)=>handlers[type]=fn},window:{addEventListener(){}},toast(){},toggleVerseMark(kind,book,chapter,verse){marks.push(verse);const key=`${book}:${chapter}:${verse}`;if(context.state.verseBookmarks[key])delete context.state.verseBookmarks[key];else context.state.verseBookmarks[key]={};}};
vm.createContext(context);vm.runInContext(source.slice(source.indexOf('// Bookmark with a double click/tap;'),source.indexOf("window.addEventListener('viewchange',ev=>{if(lastView")),context);
const target=verse=>({closest:s=>s==='.verse-body'?{closest:()=>({id:'verse-'+verse})}:null});
function tap(verse,duration=50){const e={target:target(verse),pointerType:'touch',pointerId:1,clientX:100,clientY:100};handlers.pointerdown(e);now+=duration;handlers.pointerup(e);now+=100;}
tap(3);assert.equal(marks.length,0);tap(3);assert.deepEqual(marks,[3]);
now+=1000;tap(3);tap(3);assert.deepEqual(marks,[3,3]);assert(!context.state.verseBookmarks['0:11:3'],'Double-tap must unmark an existing bookmark');
now+=1000;tap(4,600);tap(4);assert.deepEqual(marks,[3,3],'Long-press must not count toward a double-tap');
now+=1000;tap(5);tap(6);assert.deepEqual(marks,[3,3],'Different verses cannot form a double-tap');
now+=1000;handlers.dblclick({target:target(8),preventDefault(){}});assert.deepEqual(marks,[3,3,8]);
const markedCard={querySelector:()=>({closest:()=>({id:'verse-8'})})};now+=1000;handlers.dblclick({target:{closest:s=>s==='.verse'?markedCard:null},preventDefault(){}});assert.deepEqual(marks,[3,3,8,8]);
modal=true;now+=1000;tap(9);tap(9);assert.deepEqual(marks,[3,3,8,8]);
assert(!handlers.click,'A single click must not change verse state');
assert(!source.includes('if(button.dataset.verse){'));
console.log('PASS: single taps do nothing; double click/tap toggles bookmarks; long holds, different verses, and open dialogs are guarded.');
