import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {storyVideos} from './story-videos.mjs';

const video={videoId:'BDNJ8-wtaeA',poster:'/assets/story-video-creation-poster-v1.webp',posterAlt:'The created world',description:'The world takes shape, followed by animals and people.'};
const art={src:'/assets/story-creation-v1.webp',alt:'Creation story artwork',width:1200,height:675};
const timers=new Map(),events=new Map(),docEvents=new Map();let nextTimer=0,frames=0;
const element=()=>({hidden:false,src:'',alt:'',textContent:'',children:[],addEventListener(type,fn){this['on'+type]=fn;},getAttribute(k){return this[k];},replaceChildren(){this.children=[];},appendChild(n){this.children.push(n);},remove(){this.removed=true;},focus(){document.activeElement=this;}});
const parts=Object.fromEntries(['still','frame','play','retry','image','status'].map(name=>['[data-video-'+name+']',element()]));
const node={dataset:{storyVideo:'The Creation',videoFallback:JSON.stringify(art)},isConnected:true,focus(){document.activeElement=this;},querySelector:s=>parts[s]};
const root={querySelectorAll:()=>[node],contains:n=>n===node};
const document={activeElement:null,hidden:false,addEventListener:(type,fn)=>docEvents.set(type,fn),createElement:tag=>{assert.equal(tag,'iframe');frames++;return {...element(),contentWindow:{}};}};
const window={addEventListener(type,fn){if(!events.has(type))events.set(type,new Set());events.get(type).add(fn);},removeEventListener(type,fn){events.get(type)?.delete(fn);}};
const navigator={onLine:true},location={protocol:'https:',origin:'https://biblelens.test'};
const c={document,window,navigator,location,URL,Map,JSON,Number,setTimeout:fn=>{timers.set(++nextTimer,fn);return nextTimer;},clearTimeout:id=>timers.delete(id)};
vm.createContext(c);vm.runInContext(fs.readFileSync('src/story-video.js','utf8').replace('/*__STORY_VIDEOS__*/{}',()=>JSON.stringify({'The Creation':video})),c);
const api=window.BibleLensStoryVideo,dispatch=(type,event)=>{for(const f of events.get(type)||[])f(event);},current=()=>parts['[data-video-frame]'].children.at(-1);
const message=(state,extra={})=>dispatch('message',{source:current().contentWindow,origin:new URL(current().src).origin,data:{type:'biblelens:story-video',state,...extra}});
const click=name=>parts['[data-video-'+name+']'].onclick();

assert.equal(api.render('Unknown',art),'');
const html=api.render('The Creation',art);assert(html.includes(video.poster));assert(!html.includes('<iframe'));assert(html.includes('aria-label="Play The Creation on YouTube"'));assert(!html.includes('<figcaption>'));assert(!html.includes('<summary>'));assert(html.includes('<svg'));assert(html.includes('class="sr-only"'));assert(html.includes(video.description));assert(!html.includes('youtube.com/iframe_api'));
navigator.onLine=false;assert(api.render('The Creation',art).includes(art.src));navigator.onLine=true;
api.mount(root);assert.equal(frames,0,'Browsing never creates a network player');
click('play');assert.equal(frames,1);let frame=current();assert.equal(new URL(frame.src).pathname,'/story-video-player.html');assert.equal(frame.referrerPolicy,'strict-origin-when-cross-origin');assert(frame.allowFullscreen);assert.equal(timers.size,1);assert(parts['[data-video-still]'].hidden);
dispatch('message',{source:{},origin:'https://biblelens.test',data:{type:'biblelens:story-video',state:'error'}});assert.equal(timers.size,1);
dispatch('message',{source:frame.contentWindow,origin:'https://wrong.test',data:{type:'biblelens:story-video',state:'error'}});assert.equal(timers.size,1);
message('ready');assert.equal(timers.size,1,'Player readiness alone does not prove video is available');message('playing');assert.equal(timers.size,0);message('time',{time:17.8});
navigator.onLine=false;dispatch('offline');assert(frame.removed);assert.equal(parts['[data-video-still]'].src,art.src);assert(parts['[data-video-play]'].hidden);assert.equal(document.activeElement,node);
navigator.onLine=true;dispatch('online');assert.equal(frames,1,'Reconnection never auto-plays');assert.equal(parts['[data-video-still]'].src,video.poster);assert(!parts['[data-video-play]'].hidden);
click('play');assert.equal(new URL(current().src).searchParams.get('start'),'17');message('playing');message('buffering');assert.equal(timers.size,1);[...timers.values()][0]();assert.equal(parts['[data-video-still]'].src,art.src);assert(!parts['[data-video-retry]'].hidden);assert.equal(timers.size,0);
click('retry');message('error');assert.equal(parts['[data-video-still]'].src,art.src);click('retry');message('paused');assert.equal(timers.size,0);click('image');assert.equal(parts['[data-video-frame]'].children.length,0);assert(!parts['[data-video-play]'].hidden);
click('play');message('ended');assert.equal(parts['[data-video-still]'].src,video.poster);click('play');assert.equal(new URL(current().src).searchParams.has('start'),false);
document.hidden=true;docEvents.get('visibilitychange')();assert.equal(timers.size,0);assert.equal(parts['[data-video-still]'].src,video.poster);document.hidden=false;
window.Capacitor={isNativePlatform:()=>true};click('play');assert.equal(new URL(current().src).origin,'https://scripture-lens.kvn-mcgwn.chatgpt.site','Native playback uses an HTTPS referring page');api.stop();
click('play');api.unmount(root);assert.equal(timers.size,0);assert.equal(events.get('message').size,0);
api.mount(root);parts['[data-video-still]'].src=video.poster;parts['[data-video-still]'].onerror();assert.equal(parts['[data-video-still]'].src,art.src);api.unmount(root);

// Test the real bridge against the official API's callback interface. These
// fixtures verify behavior, never claim real YouTube decoding or native QA.
const bridgeSource=fs.readFileSync('src/story-video-player.js','utf8').replace('/*__STORY_VIDEO_IDS__*/[]',JSON.stringify([video.videoId]));
let options,script,destroyed=0;const sent=[],bridgeEvents=new Map(),bridgeStatus={};
const bridgeWindow={addEventListener:(type,fn)=>bridgeEvents.set(type,fn)};
const bridge={window:bridgeWindow,parent:{postMessage:data=>sent.push(data)},document:{getElementById:()=>bridgeStatus,head:{appendChild:n=>{script=n;}},createElement:()=>({})},location:{search:'?video='+video.videoId+'&start=17',origin:'https://biblelens.test'},URLSearchParams,Math,Number,setInterval:()=>1,clearInterval(){},YT:{Player:function(id,config){assert.equal(id,'player');options=config;return {getIframe:()=>({}),destroy(){destroyed++;},getCurrentTime:()=>18};}}};
vm.createContext(bridge);vm.runInContext(bridgeSource,bridge);assert.equal(script.src,'https://www.youtube.com/iframe_api');bridgeWindow.onYouTubeIframeAPIReady();assert.equal(options.host,'https://www.youtube-nocookie.com');assert.equal(options.playerVars.start,17);assert.equal(options.playerVars.controls,1);assert.equal(options.playerVars.cc_load_policy,1);assert.equal(options.playerVars.origin,bridge.location.origin);
options.events.onReady();options.events.onStateChange({data:1});assert.equal(sent.at(-1).state,'playing');options.events.onAutoplayBlocked();assert.equal(sent.at(-1).state,'paused');options.events.onError({data:153});assert.equal(sent.at(-1).state,'error');script.onerror();assert.equal(sent.at(-1).state,'error');bridgeEvents.get('pagehide')();assert.equal(destroyed,1);

const dir=fs.mkdtempSync(path.join(os.tmpdir(),'biblelens-video-check-'));
try{
 const records=JSON.parse(fs.readFileSync('data/story-videos.json'));
 const active=storyVideos(records,JSON.parse(fs.readFileSync('data/story-images.json','utf8')));
 assert.equal(active['The Creation'].poster,video.poster,'Creation uses its reviewed video frame');
 assert.deepEqual(storyVideos({'The Creation':{...records['The Creation'],status:'pending'}},{'The Creation':art}),{},'Pending videos stay excluded');
 assert.equal(records['The Creation'].videoId,'BDNJ8-wtaeA','Retain the verified unlisted YouTube ID');
 assert.throws(()=>storyVideos({'The Creation':{...records['The Creation'],poster:null}},{'The Creation':art}),/poster/,'A verified ID alone cannot activate a video without its reviewed frame');
 assert.throws(()=>storyVideos({'Unknown':{status:'pending',provider:'youtube'}},{'The Creation':art}),/Unknown video story/);
 fs.mkdirSync(dir+'/assets');fs.writeFileSync(dir+video.poster,'poster fixture');
 const ready={...video,status:'ready',provider:'youtube'};
 assert.equal(storyVideos({'The Creation':ready},{'The Creation':art},dir)['The Creation'].videoId,video.videoId);
 for(const value of ['https://youtu.be/abcdefghijk','bad','abcdefghijk?autoplay=1'])assert.throws(()=>storyVideos({'The Creation':{...ready,videoId:value}},{'The Creation':art},dir),/video ID/);
 assert.throws(()=>storyVideos({'The Creation':{...ready,poster:'/assets/../private.webp'}},{'The Creation':art},dir),/poster/);
 assert.throws(()=>storyVideos({'The Creation':{...ready,description:''}},{'The Creation':art},dir),/description/);
}finally{fs.rmSync(dir,{recursive:true,force:true});}
console.log('PASS: lazy YouTube player, offline/error images, bounded loading/buffering, origin/source checks, retry/resume, reconnect without autoplay, ended poster, hidden-page teardown, native HTTPS bridge, API callbacks, accessible descriptions and pending manifest validation. No real video/browser/device playback is claimed.');
