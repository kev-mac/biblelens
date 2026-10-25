import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const reader=fs.readFileSync('src/reader.js','utf8'),app=fs.readFileSync('src/app.js','utf8'),workspace=fs.readFileSync('src/workspace.js','utf8');
assert(!reader.includes("addEventListener('dblclick'"),'Double-click/tap belongs to native text selection, never bookmarking or evidence expansion');
assert(!reader.includes('toggleVerseMark('),'Reader text and gesture handlers cannot mutate bookmarks');
const c={state:{verseBookmarks:{}},readingBook:0,readingChapter:1};vm.createContext(c);
vm.runInContext(reader.slice(reader.indexOf('function verseNumber('),reader.indexOf('function comparisonStatus(')),c);
const plain=c.verseNumber({n:2});assert.match(plain,/data-bookmark-menu/);assert.match(plain,/aria-label="Actions for verse 2"/);assert(!plain.includes('verse-bookmark-indicator'));
c.state.verseBookmarks['0:1:2']={};const saved=c.verseNumber({n:2});assert.match(saved,/Bookmarked\. Actions for verse 2/);assert.match(saved,/class="verse-bookmark-indicator"/);assert.match(saved,/aria-hidden="true"/);
console.log('PASS: text gestures never change bookmarks; explicit verse actions expose persistent, accessible saved state.');

// Exercise the real visible notification and its focus-preserving Undo lifetime.
class Node{
 constructor(tag){this.tagName=tag;this.children=[];this.attrs={};this.hidden=false;this.handlers={};}
 append(node){if(node.parentElement)node.parentElement.children=node.parentElement.children.filter(child=>child!==node);this.children.push(node);node.parentElement=this;}
 setAttribute(key,value){this.attrs[key]=value;}
 querySelector(selector){return this.children.find(node=>selector==='button'?node.tagName==='button':node.className===selector.slice(1));}
 contains(node){return node===this||this.children.includes(node);}
 addEventListener(type,fn){this.handlers[type]=fn;}
}
const body=new Node('body'),dialogs=[],timers=new Map();let next=0;
const document={body,activeElement:null,createElement:tag=>new Node(tag),querySelectorAll:()=>dialogs,querySelector:()=>[body,...dialogs].flatMap(node=>node.children).find(node=>node.id==='lens-action-toast')};
const tc={document,$:()=>document.querySelector(),setTimeout(fn){const id=++next;timers.set(id,fn);return id;},clearTimeout(id){timers.delete(id);}};vm.createContext(tc);
vm.runInContext(app.slice(app.indexOf('// Keep action feedback visible'),app.indexOf('function confirmNoteAction(')),tc);
let undoCount=0;tc.toast('Saved to Notebook',{undo:()=>{undoCount++;tc.toast('Bookmark removed. Notes kept.');}});
const notice=document.querySelector(),message=notice.querySelector('.lens-action-message'),undo=notice.querySelector('button');
assert.equal(notice.hidden,false);assert.equal(message.textContent,'Saved to Notebook');assert.equal(message.attrs.role,'status');assert.equal(message.attrs['aria-live'],'polite');assert.equal(undo.hidden,false);assert.equal(document.activeElement,null,'Notifications do not steal focus');
const expire=[...timers.values()].at(-1);document.activeElement=undo;expire();assert.equal(notice.hidden,false,'Undo remains available while keyboard focus is inside');
undo.onclick();assert.equal(undoCount,1);assert.equal(message.textContent,'Bookmark removed. Notes kept.');assert.equal(undo.hidden,true);
document.activeElement=null;[...timers.values()].at(-1)();assert.equal(notice.hidden,true);
const dialog1=new Node('dialog'),dialog2=new Node('dialog');dialogs.push(dialog1,dialog2);tc.toast('Nested modal feedback');assert.equal(notice.parentElement,dialog2);dialogs.pop();dialog2.handlers.close();assert.equal(notice.parentElement,dialog1,'Closing the hosting modal preserves feedback in the remaining modal');
console.log('PASS: feedback is visible and announced; Undo does not steal focus, focused actions do not expire, and nested modal feedback remains reachable.');

// Notebook removal must use the same safety/Undo path as reading actions.
const handlers={},calls=[],record={book:0,chapter:1,verse:2,name:'Genesis'};
const nc={state:{verseBookmarks:{'0:1:2':record}},el:()=>({addEventListener:(type,fn)=>handlers[type]=fn}),toggleVerseMark:(...args)=>calls.push(args),renderNotebook(){},confirmNoteAction(){throw Error('Verse bookmarks must use the shared safe action');}};
vm.createContext(nc);vm.runInContext(workspace.slice(workspace.indexOf("el('notebook-view').addEventListener('click'"),workspace.indexOf("el('notebook-view').addEventListener('input'")),nc);
const row={dataset:{lensNote:'verse:0:1:2'}},action={closest:()=>row,hasAttribute:()=>true};handlers.click({target:{closest:selector=>selector==='[data-lens-filter]'?null:action}});assert.deepEqual(calls,[['bookmark',0,1,2]]);assert.equal(nc.state.verseBookmarks['0:1:2'],record,'Notebook handler never directly deletes annotation storage');
delete nc.state.verseBookmarks['0:1:2'];handlers.click({target:{closest:selector=>selector==='[data-lens-filter]'?null:action}});assert.equal(calls.length,1,'A stale removal control cannot recreate a removed bookmark');
console.log('PASS: Notebook bookmark removal shares reader safety and Undo; stale controls cannot re-add deleted bookmarks.');
