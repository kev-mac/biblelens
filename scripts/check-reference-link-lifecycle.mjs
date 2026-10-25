import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createPersonMatcher,wrapReferenceNames} from '../src/people-links.js';
import {parsePlaces,createPlaceMatcher} from '../src/places-core.js';

const places=parsePlaces(JSON.parse(fs.readFileSync('data/reference/places.json','utf8')));
const people=JSON.parse(fs.readFileSync('data/reference/people.json','utf8'));
const source=fs.readFileSync('src/places.js','utf8');
const initialization=source.slice(source.indexOf('async function initializeChips(){'),source.indexOf('\ninitializeChips();'));
const roots=[],tasks=[],events=new Map(),warnings=[];let observer,placesCalls=0,peopleCalls=0,failPlaces=true;
const body={nodeType:1,closest:()=>null,querySelectorAll:()=>roots};
const document={body,createElement:()=>({set innerHTML(html){this.content={html};}}),createTreeWalker(root,mask,filter){
 if(root.fail)throw Error('Deliberately unavailable text node');
 const nodes=root.nodes.filter(node=>!filter||filter.acceptNode(node)===1);let index=0;
 return {nextNode(){this.currentNode=nodes[index++];return this.currentNode||null;}};
}};
function story(text,range={book:0,chapter:9,verse:18,endChapter:10,endVerse:32}){
 const article={dataset:Object.fromEntries(Object.entries(range).map(([key,value])=>['story'+key[0].toUpperCase()+key.slice(1),String(value)]))};
 const root={nodeType:1,isConnected:true,nodes:[],html:'',querySelectorAll:()=>[],closest(selector){if(selector==='.story-card[data-story-book]')return article;if(selector.includes('.story-card p'))return this;return null;}};
 const node={nodeType:3,parentElement:root,isConnected:true,data:text,replaceWith(content){root.html+=content.html;root.nodes=root.nodes.filter(item=>item!==this);this.isConnected=false;}};
 root.nodes.push(node);roots.push(root);return root;
}
const noah=story('Noah’s sons include Shem.');
const context={document,window:{addEventListener:(name,fn)=>events.set(name,fn)},NodeFilter:{SHOW_TEXT:4,FILTER_ACCEPT:1,FILTER_REJECT:2},MutationObserver:class {constructor(callback){this.callback=callback;this.pending=[];observer=this;}observe(){this.active=true;}takeRecords(){return this.pending.splice(0);}disconnect(){this.active=false;this.pending=[];}},queueMicrotask:callback=>tasks.push(callback),console:{warn:(...args)=>warnings.push(args)},createPersonMatcher,createPlaceMatcher,wrapReferenceNames,loadPlaces:async()=>{placesCalls++;if(failPlaces)throw Error('Places temporarily offline');return places;},fetch:async()=>{peopleCalls++;return {ok:true,json:async()=>people};}};
vm.createContext(context);vm.runInContext(initialization,context);
function flush(){while(tasks.length)tasks.shift()();}
await context.initializeChips();flush();
assert(noah.html.includes('data-person-id="recVMHzYdllgvTo09"'),'People decorate already-rendered stories even when Places failed');
assert(observer.active,'Reference observation is active after initial decoration');
assert.equal(peopleCalls,1);assert.equal(placesCalls,1);assert(warnings.length);

failPlaces=false;
const ur=story('Abram’s family leaves Ur for Haran.',{book:0,chapter:11,verse:27,endChapter:12,endVerse:9});
events.get('viewchange')();await new Promise(resolve=>setImmediate(resolve));flush();
assert(ur.html.includes('data-place-id="recgQtoCtBjbsPwAw"'),'Changing views retries missing data and decorates the rendered story');
assert.equal(peopleCalls,1,'An already-working People matcher is not fetched again');assert.equal(placesCalls,2);

const broken=story('Noah');broken.fail=true;
const later=story('Noah’s sons include Japheth.');
observer.callback([{type:'childList',addedNodes:[broken,later]}]);flush();
assert(later.html.includes('data-person-id="recVMHzYdllgvTo09"'),'One failed DOM root does not prevent another story being linked');
assert(observer.active,'A failed decoration must reconnect the observer in finally');
const subsequent=story('Noah’s family');observer.callback([{type:'childList',addedNodes:[subsequent]}]);flush();
assert(subsequent.html.includes('data-person-id="recVMHzYdllgvTo09"'),'Subsequent story renders remain observed after a decoration failure');

// The browser can render again after the observer queues its decoration
// microtask, but before that microtask disconnects the observer. Those records
// must be drained before disconnect(), which otherwise silently discards them.
const stale=story('Noah’s family');observer.callback([{type:'childList',addedNodes:[stale]}]);
stale.isConnected=false;
const replacement=story('Noah’s sons include Shem.');
observer.pending.push({type:'childList',addedNodes:[replacement]});
flush();
assert(!stale.html,'The disconnected prior story must not be decorated');
assert(replacement.html.includes('data-person-id="recVMHzYdllgvTo09"'),'A replacement rendered before flush retains its pending mutation and receives links');
assert(observer.active);
console.log('PASS: rendered story decoration, independent reference availability, missing-data retry, failure isolation, observer reconnection and replacement-render race protection.');
