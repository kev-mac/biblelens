import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Deterministic observer/timer/media fixtures. Live decoding is tested separately.
const source=fs.readFileSync('src/story-video.js','utf8');
function fixture({reduced=false,saveData=false,slow=false}={}){
 let now=0,id=0,io;const timers=new Map(),events=new Map(),docEvents=new Map(),created=[];
 const document={hidden:false,activeElement:null,addEventListener:(t,f)=>docEvents.set(t,f)};
 const el=()=>({children:[],listeners:new Map(),hidden:false,src:'',addEventListener(t,f){this.listeners.set(t,f);},emit(t){this.listeners.get(t)?.();},getAttribute(k){return this[k];},setAttribute(k,v){this[k]=v;},removeAttribute(k){delete this[k];},replaceChildren(){this.children=[];},appendChild(n){n.parent=this;this.children.push(n);},remove(){this.removed=true;if(this.parent)this.parent.children=this.parent.children.filter(c=>c!==this);},focus(){document.activeElement=this;}});
 document.createElement=tag=>{const e={...el(),tag,paused:true,currentTime:0,duration:30,readyState:4,plays:0,pause(){this.paused=true;this.emit('pause');},load(){this.loads=(this.loads||0)+1;},play(){this.plays++;this.paused=false;this.emit('playing');return Promise.resolve();},commands:[]};e.contentWindow={postMessage:(message,origin)=>e.commands.push({message,origin})};created.push(e);return e;};
 const motion={matches:reduced,addEventListener(t,f){this.change=f;}},connection={saveData,effectiveType:slow?'2g':'4g',addEventListener(t,f){this.change=f;}};
 const window={matchMedia:()=>motion,addEventListener(t,f){if(!events.has(t))events.set(t,new Set());events.get(t).add(f);},removeEventListener(t,f){events.get(t)?.delete(f);},IntersectionObserver:class{constructor(fn){io=fn;}observe(){}unobserve(){}}};
 const navigator={onLine:true,connection},art={src:'/original.webp',alt:'Original artwork'};
 const records=Object.fromEntries(Array.from({length:6},(_,i)=>['Story '+i,{provider:i===0?'youtube':'mp4',videoId:'BDNJ8-wtaeA',src:'https://media.test/'+i+'.mp4',poster:'/poster.webp',posterAlt:'Video frame',description:'Story video.'}]));
 const nodes=Object.keys(records).map(title=>{const parts=Object.fromEntries(['still','frame','play','retry','image','status'].map(n=>['[data-video-'+n+']',el()])),stage=el();return {parts,stage,isConnected:true,dataset:{storyVideo:title,videoFallback:JSON.stringify(art)},querySelector:s=>s==='.story-video-stage'?stage:parts[s],focus(){document.activeElement=this;}};});
 const root={querySelectorAll:()=>nodes,contains:n=>nodes.includes(n)};
 const context={window,document,navigator,location:{origin:'https://biblelens.test',protocol:'https:'},URL,Map,Set,JSON,Math,Number,setTimeout:(f,delay)=>{timers.set(++id,{f,at:now+delay});return id;},clearTimeout:id=>timers.delete(id)};
 vm.runInNewContext(source.replace('/*__STORY_VIDEOS__*/{}',()=>JSON.stringify(records)),context);
 const api=window.BibleLensStoryVideo;api.mount(root);
 const tick=ms=>{const end=now+ms;while(true){const next=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;now=next[1].at;timers.delete(next[0]);next[1].f();}now=end;};
 const view=(ratios)=>io(Object.entries(ratios).map(([i,ratio])=>({target:nodes[i].stage,isIntersecting:ratio>0,intersectionRatio:ratio})));
 const media=i=>nodes[i].parts['[data-video-frame]'].children[0];
 const dispatch=(type,event)=>{for(const fn of events.get(type)||[])fn(event);};
 const message=(i,state,extra={})=>{const m=media(i);dispatch('message',{source:m.contentWindow,origin:new URL(m.src).origin,data:{type:'biblelens:story-video',state,...extra}});};
 return {api,nodes,media,tick,view,created,document,navigator,motion,connection,dispatch,message,docEvents,timers,click:(i,n='play')=>nodes[i].parts['[data-video-'+n+']'].onclick()};
}
const f=fixture();assert.equal(f.created.length,0);f.view({2:.9});assert.equal(f.media(1).preload,'auto');assert.equal(f.media(3).preload,'auto');assert.equal(f.media(2),undefined);f.tick(180);let current=f.media(2);assert(current.muted&&!current.loop&&current.controls&&current.playsInline);assert.equal(current.plays,1);assert.equal(f.document.activeElement,null,'Autoplay never steals keyboard focus');assert.equal(f.media(0),undefined);assert.equal(f.media(4),undefined);
current.pause();f.view({2:.75});f.tick(200);assert.equal(current.plays,1,'Manual pause is respected');current.emit('ended');f.view({2:.9});f.tick(200);assert.equal(f.media(2),undefined,'Ending does not loop or recreate the active player');
f.view({2:.3});f.tick(200);f.view({2:.9});f.tick(200);assert.equal(f.media(2),undefined,'Threshold jitter does not replay');f.view({2:0});f.tick(300);f.view({2:.9});f.tick(200);assert.equal(f.media(2),undefined,'A brief full exit does not replay');f.view({2:0});f.tick(500);f.view({2:.9});f.tick(180);current=f.media(2);assert.equal(current.plays,1,'A deliberate new viewing plays once');
const next=f.media(3);f.view({2:0,3:.9});f.tick(180);assert(current.paused&&current.removed);assert.equal(f.media(3),next,'Promote the preloaded element without another source request');assert.equal(next.plays,1);assert.equal(f.media(1),undefined,'Distant media is released');
f.click(4);assert(next.paused&&next.removed,'Explicit Play also has exclusive ownership');assert.equal(f.media(4).muted,false,'An explicit gesture may play with sound');assert(f.media(3)&&f.media(5)&&!f.media(1),'Manual ownership refreshes the two neighbors');
f.api.stop();assert(f.created.every(m=>m.removed),'Stop releases active and warming resources');f.api.unmount({contains:()=>true});assert.equal(f.timers.size,0);

const y=fixture();y.view({1:.9});const warm=y.media(0);assert.equal(new URL(warm.src).searchParams.get('autoplay'),'0');assert.equal(new URL(warm.src).searchParams.get('muted'),'1');y.message(0,'ready');assert.equal(warm.commands.length,0,'A warming YouTube player never plays');y.tick(180);y.view({1:0,0:.9});y.tick(180);assert.equal(y.media(0),warm);assert.equal(warm.commands.at(-1).message.action,'play');assert.equal(warm.commands.at(-1).message.muted,true);assert.equal(warm.commands.at(-1).origin,'https://biblelens.test');y.message(0,'blocked');assert(y.nodes[0].parts['[data-video-status]'].textContent.includes('controls'));assert.equal(y.timers.size,1,'Only the offscreen rearm timer remains after autoplay is blocked');y.api.unmount({contains:()=>true});

for(const preferences of [{reduced:true},{saveData:true},{slow:true}]){const p=fixture(preferences);p.view({2:.9});p.tick(1000);assert.equal(p.created.length,0,'Restricted motion/data avoids autoplay and prefetch');p.click(2);assert.equal(p.media(2).plays,1,'Explicit playback remains usable');p.api.unmount({contains:()=>true});}
const n=fixture();n.view({2:.9});n.tick(180);n.navigator.onLine=false;n.dispatch('offline');assert(n.created.every(m=>m.removed));assert.equal(n.nodes[2].parts['[data-video-still]'].src,'/original.webp');n.navigator.onLine=true;n.dispatch('online');n.tick(1000);assert.equal(n.media(2),undefined,'Reconnect does not replay the current viewing');n.click(2);n.document.hidden=true;n.docEvents.get('visibilitychange')();assert(n.created.every(m=>m.removed));n.document.hidden=false;n.docEvents.get('visibilitychange')();n.tick(200);assert.equal(n.media(2),undefined,'Returning to a tab does not replay');n.view({2:0,5:.9});n.tick(180);assert.equal(n.media(5).plays,1,'An unseen story stays eligible after offline/hidden transitions');n.api.unmount({contains:()=>true});
console.log('PASS: viewport dwell/hysteresis, one autoplay per viewing, no loops/jitter replay, full-exit rearm, exclusive playback, adjacent MP4/YouTube reuse and cleanup, native controls, focus, reduced motion/data preferences, offline/reconnect and hidden-page teardown (fixtures).');
