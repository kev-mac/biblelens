import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const handlers={},popupHandlers={},children=new Map(),loads=[];let requests=0,selectedEdition='kjv';
const child=s=>{if(!children.has(s))children.set(s,{classList:{add(){},remove(){}},attrs:{},setAttribute(key,value){this.attrs[key]=value;},focus(){doc.activeElement=this;}});return children.get(s);};
const popup={style:{},hidden:true,setAttribute(){},querySelector:child,querySelectorAll:()=>[],contains:n=>n===popup,getBoundingClientRect:()=>({width:360,height:180}),addEventListener:(type,fn)=>popupHandlers[type]=fn};
const doc={createElement:()=>popup,body:{append(){}},querySelector:s=>s==='#reader-edition'?{value:selectedEdition}:null,addEventListener:(type,fn,capture)=>{const key=type+(capture===true?':capture':'');const previous=handlers[key];handlers[key]=previous?ev=>{previous(ev);fn(ev);}:fn;}};
const ctx={state:{verseBookmarks:{},verseHighlights:{}},document:doc,window:{innerWidth:780,innerHeight:1004,addEventListener(){}},setTimeout,clearTimeout,scriptureHtml:v=>v.kjv,setView:(v,update)=>loads.push({view:v,update}),loadChapter:(...ref)=>loads.push({ref}),fetch:async()=>{requests++;return{ok:true,json:async()=>({verses:[{n:1,kjv:'Full verse one, beyond the quoted excerpt.'},{n:2,kjv:'Full verse two.'}]})}}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('src/citations.js','utf8').split('// Supporting-context markers')[0],ctx);
const chip=(verse,end=verse)=>({isConnected:true,focus(){doc.activeElement=this;handlers.focusin({target:target(this)});},dataset:{cite:`0/1/${verse}`,citeEnd:String(end),citeLabel:`Genesis 1:${verse}`},attrs:{},setAttribute(k,v){this.attrs[k]=v;},closest:()=>null,contains:()=>false,getBoundingClientRect:()=>({left:100,top:300,bottom:324})});
const target=b=>({closest:s=>s.includes('data-cite')?b:null});const settle=()=>new Promise(r=>setImmediate(r));
const b=chip(1);handlers.pointerover({pointerType:'mouse',target:target(b),relatedTarget:null});await settle();assert(!popup.hidden);assert.equal(child('.preview-text').innerHTML,'Full verse one, beyond the quoted excerpt.');assert(!popup.innerHTML.includes('preview-link'));assert(!popup.innerHTML.includes('Highlight verse'));assert(popup.innerHTML.includes('data-verse-action="copy"'));assert.equal(requests,1);
b.dataset.citeWitness='Septuagint';b.dataset.citeSummary='The exact original summary.';handlers.focusin({target:target(b)});await settle();assert.equal(child('.preview-summary').textContent,'Septuagint: The exact original summary.');assert.equal(child('.preview-summary').hidden,false);
const range=chip(1,2);handlers.focusin({target:target(range)});await settle();assert(child('.preview-text').innerHTML.includes('Full verse one, beyond the quoted excerpt.'));assert(child('.preview-text').innerHTML.includes('Full verse two.'));assert.equal(requests,1);
assert.equal(child('.preview-summary').hidden,true);assert.equal(child('.preview-summary').textContent,'');
let prevented=false;handlers.click({target:target(range),preventDefault(){prevented=true;}});assert(prevented);assert(popup.hidden);assert.deepEqual(loads.at(-1).ref,[0,1,1]);assert.equal(loads.at(-2).view,'explore');
// Stories references stay in the reader's floating preview on click and Enter.
const story=chip(1,2);story.dataset.citePreview='';const beforeStory=loads.length;
handlers.click({target:target(story),preventDefault(){}});await settle();
assert(!popup.hidden);assert.equal(loads.length,beforeStory);assert(child('.preview-text').innerHTML.includes('Full verse two.'));
handlers.focusout({target:target(story),relatedTarget:null});await new Promise(r=>setTimeout(r,220));assert(!popup.hidden,'Story previews remain open after focus moves');
handlers.keydown({key:'Escape',preventDefault(){}});assert(popup.hidden);

handlers.pointerover({pointerType:'touch',target:target(b),relatedTarget:null});await settle();assert(popup.hidden);
handlers.focusin({target:target(b)});await settle();handlers.keydown({key:'Escape',preventDefault(){}});assert(popup.hidden);assert.equal(doc.activeElement,b,'Escape restores the citation opener without reopening its preview');
handlers.focusin({target:target(b)});await settle();handlers.click({target:{closest:selector=>selector==='.preview-close'?{}:null},preventDefault(){}});assert(popup.hidden);assert.equal(doc.activeElement,b,'Close restores the citation opener');
// Long-pressing a citation previews it and moving away cancels the hold.
handlers.pointerdown({button:0,target:target(b),pointerId:10,clientX:10,clientY:10});await new Promise(r=>setTimeout(r,550));assert(!popup.hidden);handlers.pointerup();handlers.keydown({key:'Escape',preventDefault(){}});
handlers.pointerdown({button:0,target:target(b),pointerId:11,clientX:10,clientY:10});handlers.pointermove({pointerId:11,clientX:30,clientY:10});await new Promise(r=>setTimeout(r,550));assert(popup.hidden);
// iOS sends pointerout on finger lift; explicit long-press previews must stay open.
handlers.pointerdown({button:0,pointerType:'touch',target:target(b),pointerId:12,clientX:10,clientY:10});await new Promise(r=>setTimeout(r,550));
handlers.pointerup();handlers.pointerout({pointerType:'touch',target:target(b),relatedTarget:null});
handlers.focusout({target:target(b),relatedTarget:null});popupHandlers.pointerleave({pointerType:'touch'});
await new Promise(r=>setTimeout(r,250));assert(!popup.hidden,'Finger release must not dismiss a long-press preview');
let releaseStopped=false;handlers['click:capture']({target:target(b),preventDefault(){},stopImmediatePropagation(){releaseStopped=true;}});
assert(releaseStopped,'The compatibility click must not navigate or close the preview');assert(!popup.hidden);
handlers.click({target:{closest:()=>null},preventDefault(){}});assert(popup.hidden,'An outside tap still dismisses the preview');
// Mouse hover retains its normal leave-to-dismiss behavior.
handlers.pointerover({pointerType:'mouse',target:target(b),relatedTarget:null});await settle();
handlers.pointerout({pointerType:'mouse',target:target(b),relatedTarget:null});await new Promise(r=>setTimeout(r,250));assert(popup.hidden);
// Closing during an in-flight request cannot reopen a stale preview.
let resolveFetch;ctx.fetch=()=>new Promise(r=>resolveFetch=r);const delayed=chip(1);delayed.dataset.cite='0/2/1';handlers.pointerover({pointerType:'mouse',target:target(delayed),relatedTarget:null});handlers.click({target:target(delayed),preventDefault(){}});resolveFetch({ok:true,json:async()=>({verses:[{n:1,kjv:'Stale verse'}]})});await settle();assert(popup.hidden);assert.notEqual(child('.preview-text').innerHTML,'Stale verse');
console.log('PASS: full-verse hover and keyboard previews, ranges, cached fetch, direct click/tap navigation and stale-response cancellation.');

ctx.readingBook=0;ctx.readingChapter=3;ctx.books=[{name:'Genesis'}];ctx.reading={name:'Genesis'};
ctx.fetch=async()=>({ok:true,json:async()=>({verses:[{n:22,kjv:'KJV fixture',web:'Complete WEB fixture verse.'}]})});ctx.scriptureHtml=(v,ed)=>v[ed];
const body={...chip(22),closest:s=>s==='.verse'?{id:'verse-22'}:null,matches:s=>s==='.verse-body'};
const verseTarget={closest:s=>s==='.verse-body'?body:null};
handlers.pointerdown({button:0,target:verseTarget,pointerId:7,clientX:10,clientY:10});await new Promise(r=>setTimeout(r,550));assert(!popup.hidden);assert.equal(child('.preview-edition').textContent,'KJV');assert.equal(child('.preview-text').innerHTML,'KJV fixture');handlers.pointercancel();handlers.pointerup();handlers.pointerout({pointerType:'touch',target:target(body),relatedTarget:null});popupHandlers.pointerleave({pointerType:'touch'});await new Promise(r=>setTimeout(r,250));let bodyReleaseStopped=false;handlers['click:capture']({target:verseTarget,preventDefault(){},stopImmediatePropagation(){bodyReleaseStopped=true;}});assert(bodyReleaseStopped);assert(!popup.hidden);handlers.keydown({key:'Escape',preventDefault(){}});
handlers.pointerdown({button:0,target:verseTarget,pointerId:8,clientX:10,clientY:10});handlers.pointermove({pointerId:8,clientX:25,clientY:10});await new Promise(r=>setTimeout(r,550));assert(popup.hidden);
handlers.keydown({key:'Enter',target:body,preventDefault(){}});await settle();assert(!popup.hidden);assert.equal(child('.preview-edition').textContent,'KJV');
selectedEdition='web';handlers.keydown({key:'Enter',target:body,preventDefault(){}});await settle();assert.equal(child('.preview-edition').textContent,'WEB');assert.equal(child('.preview-text').innerHTML,'Complete WEB fixture verse.');selectedEdition='kjv';
const html=fs.readFileSync('src/index.html','utf8');assert(!html.includes('id="ask-selection"'));for(const id of ['prev-bottom','next-bottom'])assert(html.includes(`id="${id}"`));
// Marked-card padding and note surfaces share the verse's long-press target.
handlers.keydown({key:'Escape',preventDefault(){}});
const markedCard={id:'verse-22',querySelector:()=>markedBody};
const markedBody={...body,closest:s=>s==='.verse'?markedCard:null};
const paddingTarget={closest:s=>s==='.verse'?markedCard:null};
handlers.pointerdown({button:0,target:paddingTarget,pointerId:9,clientX:10,clientY:10});await new Promise(r=>setTimeout(r,550));assert(!popup.hidden);handlers.pointerup();let paddingReleaseStopped=false;handlers['click:capture']({target:{closest:()=>null},preventDefault(){},stopImmediatePropagation(){paddingReleaseStopped=true;}});assert(paddingReleaseStopped);assert(!popup.hidden);handlers.keydown({key:'Escape',preventDefault(){}});handlers.keydown({key:'Enter',target:body,preventDefault(){}});await settle();
console.log('PASS: touch release/cancel keeps verse menus and citation previews open; outside taps dismiss; mouse hover still dismisses on leave; movement cancels pending holds.');
const shared=[];ctx.selectedVerseNumbers=()=>[21,22];ctx.copyVerseSelection=async(book,chapter,verses)=>{shared.push({book,chapter,verses:Array.from(verses)});return true;};
await popupHandlers.click({target:{closest:()=>({dataset:{verseAction:'copy'}})}});assert.deepEqual(shared[0],{book:0,chapter:3,verses:[22]});assert(popup.hidden);
handlers.focusin({target:target(body)});await settle();
await popupHandlers.click({target:{closest:()=>({dataset:{verseAction:'copy-selected'}})}});assert.deepEqual(shared[1],{book:0,chapter:3,verses:[21,22]});assert(popup.hidden);
const asks=[];ctx.askAboutVerse=(...args)=>asks.push(args);handlers.focusin({target:target(body)});await settle();await popupHandlers.click({target:{closest:()=>({dataset:{verseAction:'ask'}})}});assert.deepEqual(asks[0],[0,3,22]);assert(popup.hidden);
console.log('PASS: verse menu copies the selected verse range without private notes and Ask opens a verse-specific draft.');
// All saving actions are named; a note does not require an existing bookmark.
ctx.state.verseNotes={};handlers.keydown({key:'Enter',target:body,preventDefault(){}});await settle();
const bookmarkAction=child('[data-verse-action="bookmark"]'),noteAction=child('[data-verse-action="note"]');
assert.equal(bookmarkAction.attrs['aria-label'],'Bookmark');assert.equal(noteAction.hidden,false);assert.equal(noteAction.attrs['aria-label'],'Add note');assert.equal(doc.activeElement,bookmarkAction,'Opening verse actions focuses the first enabled action');
const notesOpened=[];ctx.openVerseNote=(...args)=>notesOpened.push(args);await popupHandlers.click({target:{closest:()=>({dataset:{verseAction:'note'}})}});assert.deepEqual(notesOpened,[[0,3,22]]);assert(!ctx.state.verseBookmarks['0:3:22']);
ctx.state.verseNotes['0:3:22']={title:'Title without body',text:''};ctx.state.verseBookmarks['0:3:22']={book:0,chapter:3,verse:22,highlights:[{edition:'kjv',start:0,end:3,text:'KJV'}]};
handlers.keydown({key:'Enter',target:body,preventDefault(){}});await settle();
assert.equal(noteAction.attrs['aria-label'],'Edit note');assert.equal(child('[data-verse-action="delete-note"]').hidden,false,'Title-only notes remain editable and independently deletable');assert.equal(bookmarkAction.attrs['aria-label'],'Remove bookmark');assert.equal(bookmarkAction.disabled,true);assert.equal(child('.preview-bookmark-help').hidden,false);assert.equal(bookmarkAction.attrs['aria-describedby'],'preview-bookmark-help');assert.equal(doc.activeElement,noteAction,'A disabled bookmark removal control is skipped on opening');
let mutationAttempts=0;ctx.toggleVerseMark=()=>mutationAttempts++;await popupHandlers.click({target:{closest:()=>({disabled:true,dataset:{verseAction:'bookmark'}})}});assert.equal(mutationAttempts,0);assert(!popup.hidden);
const shareLinks=[];ctx.shareVerseLink=async(...args)=>{shareLinks.push(args);return true;};await popupHandlers.click({target:{closest:()=>({dataset:{verseAction:'share'}})}});assert.deepEqual(shareLinks,[[0,3,22]]);assert(popup.hidden);
const scriptureTarget={closest:s=>s==='[data-scripture]'?{}:s==='.verse-body'?body:null};
for(let index=0;index<2;index++){handlers.pointerdown({button:0,pointerType:'touch',target:scriptureTarget,pointerId:32,clientX:50,clientY:50});handlers.pointerup();}
assert(!handlers.dblclick,'No double-click handler may consume native text selection');assert(popup.hidden);assert.equal(mutationAttempts,0,'Touch text selection cannot mutate bookmarks');
console.log('PASS: explicit actions label their effect, allow independent/title-only notes, protect highlights, delegate public sharing, focus enabled controls and leave text gestures native.');


assert(!html.includes('id="prev-top"'));assert(!html.includes('id="next-top"'));

// Hover/tap context preview contains a real destination and no inline context panel.
const tipHandlers={},tipEvents={},tipNodes=new Map(),tipLoads=[];
const tipChild=s=>{if(!tipNodes.has(s))tipNodes.set(s,{});return tipNodes.get(s);};
const tip={hidden:true,style:{},setAttribute(){},querySelector:tipChild,getBoundingClientRect:()=>({width:280,height:90}),contains:n=>n===tip,addEventListener:(type,fn)=>tipEvents[type]=fn};
const tc={document:{createElement:()=>tip,body:{append(){}},addEventListener:(type,fn)=>tipHandlers[type]=fn},window:{addEventListener(){}},innerWidth:513,innerHeight:1004,setTimeout,clearTimeout,readRef:ref=>ref==='Exodus 32:2'?{book:1,chapter:32,verse:2}:null,setView(){},loadChapter:(...r)=>tipLoads.push(r)};
vm.createContext(tc);vm.runInContext(fs.readFileSync('src/citations.js','utf8').split('// Supporting-context markers')[1].split('\n').slice(1).join('\n'),tc);
const marker={dataset:{contextRef:'Exodus 32:2',contextTitle:'Aaron’s explanation'},attrs:{},setAttribute(k,v){this.attrs[k]=v},getBoundingClientRect:()=>({right:450,bottom:500})};
tipHandlers.pointerover({pointerType:'mouse',target:{closest:()=>marker}});assert(!tip.hidden);assert.equal(tipChild('a').href,'#read/1/32/2');assert.equal(tipChild('strong').textContent,'Aaron’s explanation');
tipEvents.click({target:{closest:()=>tipChild('a')},preventDefault(){}});assert(tip.hidden);assert.deepEqual(tipLoads.pop(),[1,32,2]);
console.log('PASS: context markers open small navigable glass previews without inline context rows.');
