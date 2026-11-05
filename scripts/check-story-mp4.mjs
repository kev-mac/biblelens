import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {storyVideos,STORY_VIDEO_ORIGINS} from './story-videos.mjs';

const video={provider:'mp4',src:STORY_VIDEO_ORIGINS[0]+'/BibleLens-The-Fall-of-Man.mp4',poster:'/assets/story-video-fall-of-man-poster-v1.webp',posterAlt:'Two people in a garden',description:'An illustrated retelling of the story.'};
const art={src:'/assets/story-the-fall-of-man.webp',alt:'Original artwork',width:1200,height:675};
const timers=new Map(),events=new Map(),docEvents=new Map();let id=0,requests=0,rejection;
const element=()=>({hidden:false,src:'',alt:'',children:[],listeners:new Map(),addEventListener(type,fn){this.listeners.set(type,fn);},emit(type){this.listeners.get(type)?.();},getAttribute(k){return this[k];},setAttribute(k,v){this[k]=v;},removeAttribute(k){delete this[k];},replaceChildren(){this.children=[];},appendChild(n){this.children.push(n);},remove(){this.removed=true;},focus(){document.activeElement=this;}});
const parts=Object.fromEntries(['still','frame','play','retry','image','status'].map(name=>['[data-video-'+name+']',element()]));
const summary=element(),node={dataset:{storyVideo:'The Fall of Man',videoFallback:JSON.stringify(art)},isConnected:true,querySelector:s=>s==='summary'?summary:parts[s]};
const root={querySelectorAll:()=>[node],contains:n=>n===node};
const document={activeElement:null,hidden:false,addEventListener:(type,fn)=>docEvents.set(type,fn),createElement:tag=>{assert.equal(tag,'video');return {...element(),currentTime:0,duration:28.8,readyState:4,paused:true,pause(){this.paused=true;this.emit('pause');},load(){this.loaded=true;},play(){this.paused=false;requests++;return rejection?Promise.reject(rejection):Promise.resolve();}};}};
const window={addEventListener(type,fn){if(!events.has(type))events.set(type,new Set());events.get(type).add(fn);},removeEventListener(type,fn){events.get(type)?.delete(fn);}};
const navigator={onLine:true};
const c={document,window,navigator,location:{protocol:'https:',origin:'https://biblelens.test'},URL,Map,JSON,Number,Math,setTimeout:fn=>{timers.set(++id,fn);return id;},clearTimeout:id=>timers.delete(id)};
vm.createContext(c);vm.runInContext(fs.readFileSync('src/story-video.js','utf8').replace('/*__STORY_VIDEOS__*/{}',()=>JSON.stringify({'The Fall of Man':video})),c);
const api=window.BibleLensStoryVideo,dispatch=type=>{for(const fn of events.get(type)||[])fn();},current=()=>parts['[data-video-frame]'].children.at(-1),click=name=>parts['[data-video-'+name+']'].onclick();
const html=api.render('The Fall of Man',art);assert(html.includes('Play The Fall of Man video'));assert(!html.includes('YouTube'));assert(!html.includes('<video'));assert(!html.includes(video.src),'No browsing fetch from HTML');
api.mount(root);assert.equal(requests,0);click('play');let media=current();assert.equal(media.src,video.src);assert.equal(media.preload,'none');assert(media.controls&&media.playsInline);assert.equal(media['aria-label'],'The Fall of Man video');assert.equal(timers.size,1);
media.emit('playing');media.emit('stalled');assert.equal(timers.size,0,'A network stall while buffered is not a playback error');media.emit('waiting');assert.equal(timers.size,1);media.currentTime=1;media.emit('timeupdate');assert.equal(timers.size,0,'Actual progress clears buffering deadline');media.currentTime=9.7;media.emit('timeupdate');media.pause();media.emit('stalled');media.emit('waiting');assert.equal(timers.size,0,'Paused media is never treated as stalled playback');assert.equal(current(),media,'Pause keeps the current frame');
navigator.onLine=false;dispatch('offline');assert(media.paused&&media.removed&&media.loaded);assert(!media.src,'Teardown releases the network resource');assert.equal(parts['[data-video-still]'].src,art.src);assert.equal(document.activeElement,summary);
navigator.onLine=true;dispatch('online');assert.equal(requests,1,'Reconnect cannot autoplay');assert.equal(parts['[data-video-still]'].src,video.poster);click('play');media=current();media.emit('timeupdate');media.emit('loadedmetadata');assert.equal(media.currentTime,9.7,'An initial zero timeupdate cannot discard the saved resume time');media.emit('playing');media.emit('waiting');assert.equal(timers.size,1);[...timers.values()][0]();assert(media.removed);assert(!parts['[data-video-retry]'].hidden);
// A late event from an old attempt must not corrupt its replacement.
click('retry');const newer=current();media.emit('error');media.emit('ended');assert.equal(current(),newer);newer.emit('error');assert.equal(parts['[data-video-still]'].src,art.src);
click('retry');media=current();media.emit('playing');media.emit('ended');assert.equal(parts['[data-video-still]'].src,video.poster);assert.equal(timers.size,0);click('play');media=current();media.emit('loadedmetadata');assert.equal(media.currentTime,0);
click('image');assert(media.removed);assert.equal(parts['[data-video-still]'].src,art.src);assert(!parts['[data-video-play]'].hidden);
click('play');media=current();document.hidden=true;docEvents.get('visibilitychange')();assert(media.removed);assert.equal(timers.size,0);document.hidden=false;
rejection={name:'NotAllowedError'};click('play');await Promise.resolve();assert.equal(timers.size,0);assert(parts['[data-video-status]'].textContent.includes('video controls'));assert(current(),'Blocked autoplay retains native controls');
api.unmount(root);assert.equal(events.get('message').size,0);assert.equal(timers.size,0);
rejection={name:'AbortError'};api.mount(root);click('play');media=current();media.pause();await Promise.resolve();assert.equal(current(),media,'Pausing an unresolved play promise retains controls');assert.equal(timers.size,0);api.unmount(root);
rejection={name:'NotSupportedError'};api.mount(root);click('play');await Promise.resolve();assert(!parts['[data-video-retry]'].hidden);assert.equal(parts['[data-video-still]'].src,art.src);api.unmount(root);
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'biblelens-mp4-check-'));
try{
 fs.mkdirSync(dir+'/assets');fs.writeFileSync(dir+video.poster,'poster fixture');
 const ready={...video,status:'ready'},check=record=>storyVideos({'The Fall of Man':record},{'The Fall of Man':art},dir);
 assert.equal(check(ready)['The Fall of Man'].src,video.src);
 assert.deepEqual(check({...ready,status:'pending',src:null}),{});
 for(const src of ['http://pub-9f1a7f52c7d046daba4df355a08ed8cd.r2.dev/test.mp4','https://evil.test/test.mp4',video.src+'?token=secret',video.src+'#t=1',video.src.replace('https://','https://user:pass@'),video.src.replace('.mp4','.html'),video.src.replace('/BibleLens','/../BibleLens'),'javascript:alert(1)'])assert.throws(()=>check({...ready,src}),/MP4 video URL/);
 assert.throws(()=>check({...ready,poster:null}),/poster/);assert.throws(()=>check({...ready,description:''}),/description/);
}finally{fs.rmSync(dir,{recursive:true,force:true});}
console.log('PASS: explicit-gesture MP4 playback, native controls, no preload, network-resource cleanup, offline/reconnect, resume, pause, bounded buffering, error/retry, ended reset, stale events, hidden-page teardown, autoplay rejection and approved-host URL validation. Fixtures do not prove live decoding.');
