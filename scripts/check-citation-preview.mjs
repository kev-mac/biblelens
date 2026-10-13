import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const handlers={},popupHandlers={},children=new Map(),loads=[];let requests=0;
const child=s=>{if(!children.has(s))children.set(s,{});return children.get(s);};
const popup={style:{},hidden:true,setAttribute(){},querySelector:child,contains:n=>n===popup,getBoundingClientRect:()=>({width:360,height:180}),addEventListener:(type,fn)=>popupHandlers[type]=fn};
const doc={createElement:()=>popup,body:{append(){}},querySelector:s=>s==='#reader-edition'?{value:'kjv'}:null,addEventListener:(type,fn)=>handlers[type]=fn};
const ctx={document:doc,window:{innerWidth:780,innerHeight:1004,addEventListener(){}},setTimeout,clearTimeout,scriptureHtml:v=>v.kjv,setView:(v,update)=>loads.push({view:v,update}),loadChapter:(...ref)=>loads.push({ref}),fetch:async()=>{requests++;return{ok:true,json:async()=>({verses:[{n:1,kjv:'Full verse one, beyond the quoted excerpt.'},{n:2,kjv:'Full verse two.'}]})}}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('src/citations.js','utf8'),ctx);
const chip=(verse,end=verse)=>({dataset:{cite:`0/1/${verse}`,citeEnd:String(end),citeLabel:`Genesis 1:${verse}`},attrs:{},setAttribute(k,v){this.attrs[k]=v;},closest:()=>null,contains:()=>false,getBoundingClientRect:()=>({left:100,top:300,bottom:324})});
const target=b=>({closest:s=>s.includes('data-cite')?b:null});const settle=()=>new Promise(r=>setImmediate(r));
const b=chip(1);handlers.pointerover({pointerType:'mouse',target:target(b),relatedTarget:null});await settle();assert(!popup.hidden);assert.equal(child('.preview-text').innerHTML,'Full verse one, beyond the quoted excerpt.');assert.equal(child('a').href,'#read/0/1/1');assert.equal(requests,1);
const range=chip(1,2);handlers.focusin({target:target(range)});await settle();assert(child('.preview-text').innerHTML.includes('Full verse one, beyond the quoted excerpt.'));assert(child('.preview-text').innerHTML.includes('Full verse two.'));assert.equal(requests,1);
let prevented=false;handlers.click({target:target(range),preventDefault(){prevented=true;}});assert(prevented);assert(popup.hidden);assert.deepEqual(loads.at(-1).ref,[0,1,1]);assert.equal(loads.at(-2).view,'explore');
handlers.pointerover({pointerType:'touch',target:target(b),relatedTarget:null});await settle();assert(popup.hidden);
handlers.focusin({target:target(b)});await settle();handlers.keydown({key:'Escape',preventDefault(){}});assert(popup.hidden);
// Closing during an in-flight request cannot reopen a stale preview.
let resolveFetch;ctx.fetch=()=>new Promise(r=>resolveFetch=r);const delayed=chip(1);delayed.dataset.cite='0/2/1';handlers.pointerover({pointerType:'mouse',target:target(delayed),relatedTarget:null});handlers.click({target:target(delayed),preventDefault(){}});resolveFetch({ok:true,json:async()=>({verses:[{n:1,kjv:'Stale verse'}]})});await settle();assert(popup.hidden);assert.notEqual(child('.preview-text').innerHTML,'Stale verse');
console.log('PASS: full-verse hover and keyboard previews, ranges, cached fetch, direct click/tap navigation and stale-response cancellation.');
