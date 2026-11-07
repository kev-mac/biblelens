import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';
const reader=fs.readFileSync('src/reader.js','utf8'),workspace=fs.readFileSync('src/workspace.js','utf8');
const books=[...JSON.parse(fs.readFileSync('data/books.json')),...JSON.parse(fs.readFileSync('data/lost-books/books.json'))];
const chapters={...JSON.parse(fs.readFileSync('data/chapters.json')),...JSON.parse(fs.readFileSync('data/lost-books/chapters.json'))};
const nodes=new Map(),routes=[];
const node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',disabled:false,textContent:'',attrs:{},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];},focus(){this.focused=true;}});return nodes.get(id);};
const readChapter=async url=>{const params=new URL(url,'https://test.invalid').searchParams,key=params.get('book')+':'+params.get('chapter');assert(chapters[key]);return JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));};
const ctx={books,URL,$:node,window:{BibleLensWorkspace:{navigate:route=>routes.push(route)}},readerJson:readChapter};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('src/search-core.js','utf8'),ctx);
vm.runInContext(workspace.slice(workspace.indexOf(' function parseReference(value){'),workspace.indexOf(' function openCompare()')),ctx);ctx.window.BibleLensWorkspace.parseReference=ctx.parseReference;
vm.runInContext('let passageReferenceRequest=0;const passagePicker={open:true,close(){this.open=false;}};'+reader.slice(reader.indexOf('async function navigateTypedPassage(){'),reader.indexOf('function passageNumberGrid(')),ctx);
const reset=value=>{routes.length=0;const input=node('#passage-reference');input.value=value;input.attrs={};input.focused=false;node('#passage-reference-status').textContent='';vm.runInContext('passagePicker.open=true;',ctx);};
for(const [text,expected] of [['Exodus','#read/1/1'],['Exodus 1','#read/1/1'],['Exodus 1:8','#read/1/1/8'],['ex 1:8','#read/1/1/8'],['1Sam17:4','#read/8/17/4'],['II Timothy 1:7','#read/54/1/7'],['John 3:16-18','#read/42/3/16-18'],['Jude','#read/64/1']]){
 reset(text);await ctx.navigateTypedPassage();assert.deepEqual(routes,[expected],text);assert(!node('#passage-reference').attrs['aria-invalid']);
}
for(const text of ['', 'Unknown 1:2','Exodus 41','John 3:99','John 3:0','John 3:','John 3:20-16','<img src=x onerror=alert(1)>']){
 reset(text);await ctx.navigateTypedPassage();assert.deepEqual(routes,[],text);assert.equal(node('#passage-reference').attrs['aria-invalid'],'true');assert(node('#passage-reference').focused);assert(node('#passage-reference-status').textContent);
}
reset('John 3:16');ctx.readerJson=async()=>{throw Error('Offline');};await ctx.navigateTypedPassage();assert.equal(node('#passage-reference').value,'John 3:16');assert.match(node('#passage-reference-status').textContent,/Try again/);assert.deepEqual(routes,[]);
reset('John 3:16');let resolve;ctx.readerJson=()=>new Promise(r=>{resolve=r;});const pending=ctx.navigateTypedPassage();node('#passage-reference').value='Exodus 1:8';ctx.cancelTypedPassage();resolve(await readChapter('/api/chapter?book=42&chapter=3'));await pending;assert.deepEqual(routes,[],'Editing or choosing from the grids cancels stale navigation');
reset('John 3:16');const closing=ctx.navigateTypedPassage();vm.runInContext('passagePicker.open=false;passageReferenceRequest++;',ctx);resolve(await readChapter('/api/chapter?book=42&chapter=3'));await closing;assert.deepEqual(routes,[],'Closing cancels stale navigation');
assert(reader.includes('aria-describedby="passage-reference-help passage-reference-status"'));assert(reader.includes('role="status" aria-live="polite" aria-atomic="true"'));assert(reader.includes("event.key==='Enter'&&!event.isComposing"));
console.log('PASS: shared parsing for books, chapters, aliases, numbered books and ranges; exact packaged verse validation; accessible invalid input, retained network failures, and cancellation after edits/close.');
