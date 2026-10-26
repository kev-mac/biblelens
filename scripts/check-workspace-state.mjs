import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import '../src/sync-core.js';

const core=globalThis.BibleLensSync,key='scripture-lens-v1';
class MemoryStorage{
 constructor(initial={}){this.values=new Map(Object.entries(initial));this.fail=false;}
 get length(){return this.values.size;}
 key(index){return [...this.values.keys()][index]??null;}
 getItem(key){return this.values.get(key)??null;}
 setItem(key,value){if(this.fail)throw Error('Quota exceeded');this.values.set(key,String(value));}
 removeItem(key){this.values.delete(key);}
}
class Locks{
 tail=Promise.resolve();
 request(name,callback){const next=this.tail.then(callback);this.tail=next.catch(()=>{});return next;}
}
function tab(storage,actor,locks){
 let state;const statuses=[],merges=[];
 const store=core.createLocalStore({storage,actor,locks,getState:()=>state,onStatus:value=>statuses.push(value),onMerge:(data,details)=>{core.apply(state,data);merges.push(details);}});
 state=structuredClone(store.initial);return {store,get state(){return state;},statuses,merges};
}
async function settle(...tabs){for(let i=0;i<3;i++)await Promise.all(tabs.map(tab=>tab.store.flush()));}
const storage=new MemoryStorage({[key]:JSON.stringify({bookmarks:[],notes:{original:'Keep this'}})}),locks=new Locks();
const alice=tab(storage,'alice',locks),bob=tab(storage,'bob',locks);
alice.state.notes.a='Written in tab A';bob.state.notes.b='Written in tab B';
assert(alice.store.save());assert(bob.store.save());
await settle(alice,bob);
assert.deepEqual(alice.state.notes,{original:'Keep this',a:'Written in tab A',b:'Written in tab B'});
assert.deepEqual(bob.state.notes,alice.state.notes);
assert.equal([...storage.values.keys()].filter(name=>name.includes(':pending:')).length,0,'Committed journals are cleaned up under the lock');

delete alice.state.notes.original;alice.store.save();await settle(alice,bob);
assert(!Object.hasOwn(bob.state.notes,'original'),'A non-conflicting deletion propagates across tabs');
alice.state.notes.a='Alice edits';bob.state.notes.a='Bob edits';alice.store.save();bob.store.save();await settle(alice,bob);
assert.match(alice.state.notes.a,/Alice edits/);assert.match(alice.state.notes.a,/Bob edits/);
const conflict=alice.state.notes.a;await settle(alice,bob);assert.equal(alice.state.notes.a,conflict,'Replayed storage events do not duplicate a conflict');

// Recover a staged write after the original tab closes before receiving its lock.
const interrupted=new MemoryStorage({[key]:JSON.stringify({bookmarks:[],notes:{}})});
const closed=tab(interrupted,'closed',{request:()=>new Promise(()=>{})});closed.state.notes.recovery='Durable before the lock';closed.store.save();
const reopened=tab(interrupted,'reopened',new Locks());await settle(reopened);assert.equal(reopened.state.notes.recovery,'Durable before the lock');

// The no-Web-Locks path keeps an idempotent recovery journal.
const fallback=new MemoryStorage(),fallbackTab=tab(fallback,'fallback');fallbackTab.state.notes.a='Fallback note';fallbackTab.store.save();await settle(fallbackTab);
assert(fallback.getItem(key+':pending:fallback'));const fallbackAgain=tab(fallback,'new-tab');await settle(fallbackAgain);assert.equal(fallbackAgain.state.notes.a,'Fallback note');
delete fallbackAgain.state.notes.a;fallbackAgain.store.save();await settle(fallbackAgain,fallbackTab);assert(!Object.hasOwn(fallbackTab.state.notes,'a'),'Applied journal sequences do not resurrect a later deletion');

const malformed='{bad json',broken=new MemoryStorage({[key]:malformed}),recovered=tab(broken,'recovery',new Locks());
assert.equal(broken.getItem(key),malformed,'Loading malformed data never destroys the original');
assert.equal(recovered.store.recovery.raw,malformed);assert([...broken.values.keys()].some(name=>name.includes(':recovery:')));
assert(recovered.statuses.some(status=>status.kind==='recovery'));
recovered.state.notes.new='Still usable';recovered.store.save();await settle(recovered);assert.equal(JSON.parse(broken.getItem(key)).notes.new,'Still usable');
const full=new MemoryStorage({[key]:malformed});full.fail=true;const blocked=tab(full,'blocked',new Locks());blocked.state.notes.unsaved='Keep in memory';assert.equal(blocked.store.save(),false);assert.equal(full.getItem(key),malformed);assert(blocked.statuses.some(status=>status.kind==='error'));
storage.fail=true;alice.state.notes.unsaved='Still present';assert.equal(alice.store.save(),false);assert.equal(alice.state.notes.unsaved,'Still present');assert.equal(alice.statuses.at(-1).kind,'error');storage.fail=false;

const record={id:'test',title:'Two creation accounts',left:{book:0,chapter:1},right:{book:0,chapter:2},edition:'kjv',note:'Initial thought',updatedAt:1};
assert(core.validInvestigation(record));assert(!core.validInvestigation({...record,left:{book:80,chapter:1}}));
const base={investigations:{test:record}},left=structuredClone(base),right=structuredClone(base);left.investigations.test.note='A note';right.investigations.test.note='B note';
let result=core.merge(base,left,right);assert.match(result.data.investigations.test.note,/A note/);assert.match(result.data.investigations.test.note,/B note/);
left.investigations.test.left={book:1,chapter:1};right.investigations.test.left={book:2,chapter:1};result=core.merge(base,left,right);
assert.equal(Object.keys(result.data.investigations).length,2,'Conflicting passage pairs remain separately openable');
const target={};core.apply(target,result.data);assert.deepEqual(core.snapshot(target).investigations,result.data.investigations);
assert(!Object.hasOwn(core.merge(base,{investigations:{}},base).data.investigations,'test'),'Investigation deletions propagate');
assert.equal(core.mergeDraft('Original','Unsaved draft','Original'),'Unsaved draft');
assert.match(core.mergeDraft('Original','Unsaved draft','Remote edit'),/Unsaved draft[\s\S]*Remote edit/);
console.log('PASS: concurrent tab edits, deletions, note conflicts, durable journal recovery, storage failure/quarantine and investigation round trips.');

// Execute the real cloud sync body: an unchanged poll must perform no UI or note writes.
const syncSource=fs.readFileSync('src/sync.js','utf8');
const syncBody=syncSource.slice(syncSource.indexOf(' async function sync(){'),syncSource.indexOf(' function schedule()'));
let renders=0,persists=0,backups=0;const cloudState={bookmarks:[],notes:{a:'Keep selection'},readerPreferences:{edition:'kjv'}};
const context={core,state:cloudState,meta:{enabled:true,owner:'owner',base:core.snapshot(cloudState)},busy:false,applying:false,say(){},api:async path=>path==='/session'?{userId:'owner'}:{revision:1,data:core.snapshot(cloudState)},saveMeta(){},render(){},backup(){backups++;},applyWorkspaceSnapshot(){renders++;},persist(){persists++;},schedule(){},navigator:{onLine:true},Date};
vm.createContext(context);vm.runInContext(syncBody,context);await context.sync();
assert.equal(renders,0);assert.equal(persists,0);assert.equal(backups,0);
console.log('PASS: unchanged cloud sync leaves the reader, editor, selection and local note storage untouched.');

// Run the real history writer/restorer against a small browser-history model.
const appSource=fs.readFileSync('src/app.js','utf8'),handlers={},frames=[],entries=[{hash:'#read/0/1',state:null}];let index=0,focused=null;
const editorContext={window:{BibleLensSync:core}};vm.createContext(editorContext);
vm.runInContext(appSource.slice(appSource.indexOf('function updateWorkspaceField('),appSource.indexOf('function updateLegacyNoteEditors(')),editorContext);
const editor={value:'Unsaved draft',selectionStart:4,selectionEnd:4,selectionDirection:'none',scrollTop:12,setSelectionRange(start,end){this.selectionStart=start;this.selectionEnd=end;}};
editorContext.updateWorkspaceField(editor,'Original','Remote edit');assert.match(editor.value,/Unsaved draft[\s\S]*Remote edit/);assert.equal(editor.selectionStart,4);assert.equal(editor.scrollTop,12);
const page={hash:'#read/0/1',href:'https://bible.test/#read/0/1'};
const history={get state(){return entries[index].state;},scrollRestoration:'auto',replaceState(state,title,url){entries[index]={state,hash:url.includes('#')?'#'+url.split('#')[1]:page.hash};page.hash=entries[index].hash;page.href='https://bible.test/'+page.hash;},pushState(state,title,url){entries.splice(index+1);entries.push({state,hash:url});index++;page.hash=url;page.href='https://bible.test/'+url;}};
const focus={id:'passage-link',dataset:{},closest:()=>null,focus(){focused=this.id;}};
const win={scrollX:0,scrollY:420,addEventListener(name,handler){handlers[name]=handler;},scrollTo({top}){this.scrollY=top;}};
const doc={activeElement:focus,body:{classList:{contains:()=>false}},addEventListener(){},querySelector:selector=>selector==='#passage-link'?focus:null};
const navContext={history,location:page,window:win,document:doc,CSS:{escape:value=>value},requestAnimationFrame:fn=>frames.push(fn),view:'read',reading:{},readingBook:0,readingChapter:1,$:()=>null,Date,Math};
vm.createContext(navContext);vm.runInContext(appSource.slice(appSource.indexOf('const navigationPositions='),appSource.indexOf('function setView(')),navContext);
navContext.navigateHash('#notebook');assert.equal(entries.length,2);assert.equal(page.hash,'#notebook');
win.scrollY=80;handlers.scroll();navContext.navigateHash('#search');assert.equal(entries.length,3);
index=0;page.hash=entries[0].hash;handlers.popstate({state:entries[0].state});while(frames.length)frames.shift()();
assert.equal(win.scrollY,420);assert.equal(focused,'passage-link');
navContext.navigateHash('#read/0/2',{replace:true});assert.equal(entries.length,3,'Transient replacement does not push an entry');
console.log('PASS: meaningful history pushes, explicit replacements and Back restoration of scroll and focus.');
