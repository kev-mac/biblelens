import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const handlers={},popupHandlers={},children=new Map(),loads=[];let requests=0;
const child=s=>{if(!children.has(s))children.set(s,{setAttribute(){}});return children.get(s);};
const popup={style:{},hidden:true,setAttribute(){},querySelector:child,contains:n=>n===popup,getBoundingClientRect:()=>({width:360,height:180}),addEventListener:(type,fn)=>popupHandlers[type]=fn};
const doc={createElement:()=>popup,body:{append(){}},querySelector:s=>s==='#reader-edition'?{value:'kjv'}:null,addEventListener:(type,fn,capture)=>handlers[type+(capture===true?':capture':'')]=fn};
const ctx={state:{verseBookmarks:{},verseHighlights:{}},document:doc,window:{innerWidth:780,innerHeight:1004,addEventListener(){}},setTimeout,clearTimeout,scriptureHtml:v=>v.kjv,setView:(v,update)=>loads.push({view:v,update}),loadChapter:(...ref)=>loads.push({ref}),fetch:async()=>{requests++;return{ok:true,json:async()=>({verses:[{n:1,kjv:'Full verse one, beyond the quoted excerpt.'},{n:2,kjv:'Full verse two.'}]})}}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('src/citations.js','utf8'),ctx);
const chip=(verse,end=verse)=>({dataset:{cite:`0/1/${verse}`,citeEnd:String(end),citeLabel:`Genesis 1:${verse}`},attrs:{},setAttribute(k,v){this.attrs[k]=v;},closest:()=>null,contains:()=>false,getBoundingClientRect:()=>({left:100,top:300,bottom:324})});
const target=b=>({closest:s=>s.includes('data-cite')?b:null});const settle=()=>new Promise(r=>setImmediate(r));
const b=chip(1);handlers.pointerover({pointerType:'mouse',target:target(b),relatedTarget:null});await settle();assert(!popup.hidden);assert.equal(child('.preview-text').innerHTML,'Full verse one, beyond the quoted excerpt.');assert.equal(child('a').href,'#read/0/1/1');assert.equal(requests,1);
b.dataset.citeWitness='Septuagint';b.dataset.citeSummary='The exact original summary.';handlers.focusin({target:target(b)});await settle();assert.equal(child('.preview-summary').textContent,'Septuagint: The exact original summary.');assert.equal(child('.preview-summary').hidden,false);
const range=chip(1,2);handlers.focusin({target:target(range)});await settle();assert(child('.preview-text').innerHTML.includes('Full verse one, beyond the quoted excerpt.'));assert(child('.preview-text').innerHTML.includes('Full verse two.'));assert.equal(requests,1);
assert.equal(child('.preview-summary').hidden,true);assert.equal(child('.preview-summary').textContent,'');
let prevented=false;handlers.click({target:target(range),preventDefault(){prevented=true;}});assert(prevented);assert(popup.hidden);assert.deepEqual(loads.at(-1).ref,[0,1,1]);assert.equal(loads.at(-2).view,'explore');
handlers.pointerover({pointerType:'touch',target:target(b),relatedTarget:null});await settle();assert(popup.hidden);
handlers.focusin({target:target(b)});await settle();handlers.keydown({key:'Escape',preventDefault(){}});assert(popup.hidden);
// Closing during an in-flight request cannot reopen a stale preview.
let resolveFetch;ctx.fetch=()=>new Promise(r=>resolveFetch=r);const delayed=chip(1);delayed.dataset.cite='0/2/1';handlers.pointerover({pointerType:'mouse',target:target(delayed),relatedTarget:null});handlers.click({target:target(delayed),preventDefault(){}});resolveFetch({ok:true,json:async()=>({verses:[{n:1,kjv:'Stale verse'}]})});await settle();assert(popup.hidden);assert.notEqual(child('.preview-text').innerHTML,'Stale verse');
console.log('PASS: full-verse hover and keyboard previews, ranges, cached fetch, direct click/tap navigation and stale-response cancellation.');

ctx.readingBook=0;ctx.readingChapter=3;ctx.books=[{name:'Genesis'}];ctx.reading={name:'Genesis'};
ctx.fetch=async()=>({ok:true,json:async()=>({verses:[{n:22,kjv:'KJV fixture',web:'Complete WEB fixture verse.'}]})});ctx.scriptureHtml=(v,ed)=>v[ed];
const body={...chip(22),closest:s=>s==='.verse'?{id:'verse-22'}:null,matches:s=>s==='.verse-body'};
const verseTarget={closest:s=>s==='.verse-body'?body:null};
handlers.pointerdown({button:0,target:verseTarget,pointerId:7,clientX:10,clientY:10});await new Promise(r=>setTimeout(r,550));assert(!popup.hidden);assert.equal(child('.preview-edition').textContent,'WEB');assert.equal(child('.preview-text').innerHTML,'Complete WEB fixture verse.');handlers.pointerup();handlers.click({target:verseTarget,preventDefault(){}});assert(!popup.hidden);handlers.keydown({key:'Escape',preventDefault(){}});
handlers.pointerdown({button:0,target:verseTarget,pointerId:8,clientX:10,clientY:10});handlers.pointermove({pointerId:8,clientX:25,clientY:10});await new Promise(r=>setTimeout(r,550));assert(popup.hidden);
handlers.keydown({key:'Enter',target:body,preventDefault(){}});await settle();assert(!popup.hidden);assert.equal(child('.preview-edition').textContent,'WEB');
const html=fs.readFileSync('src/index.html','utf8');assert(!html.includes('id="ask-selection"'));for(const id of ['prev-bottom','next-bottom'])assert(html.includes(`id="${id}"`));
console.log('PASS: WEB hold preview, movement cancellation, keyboard access and top/bottom chapter controls.');

assert(!html.includes('id="prev-top"'));assert(!html.includes('id="next-top"'));
