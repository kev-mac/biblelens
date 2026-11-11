import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {STORY_VIDEO_ORIGINS} from './story-videos.mjs';
import worker from '../dist/server/index.js';

const get=p=>worker.fetch(new Request('https://biblelens.test'+p),{},{});
const app=await get('/'),appPolicy=app.headers.get('content-security-policy-report-only');
assert(appPolicy.includes("frame-src 'self' https://scripture-lens.kvn-mcgwn.chatgpt.site"));
assert(appPolicy.includes('media-src '+STORY_VIDEO_ORIGINS.join(' ')));
assert(fs.readFileSync('www/index.html','utf8').includes('media-src '+STORY_VIDEO_ORIGINS.join(' ')),'Native policy allows the same approved media host');
assert(!appPolicy.match(/script-src[^;]*youtube/),'The reading app permits no YouTube scripts');
const response=await get('/story-video-player.html');assert.equal(response.status,200);
const html=await response.text();assert(html.includes('http-equiv="Content-Security-Policy"'));assert(html.includes('strict-origin-when-cross-origin'));
assert(html.includes('frame-src https://www.youtube-nocookie.com https://www.youtube.com'));assert(!html.includes('unsafe-inline'));
const script=await(await get('/story-video-player.js')).text();assert(!script.includes('/*__STORY_VIDEO_IDS__*/'));assert(script.includes('https://www.youtube.com/iframe_api'));
const client=await(await get('/story-video.js')).text();assert(!client.includes('/*__STORY_VIDEOS__*/'));assert(client.includes('https://scripture-lens.kvn-mcgwn.chatgpt.site'));
const featureLoader=await(await get('/feature-loader.js')).text();
const studyStyle=/"studyStyles":"(\/assets\/study\.[a-f0-9]{16}\.css)"/.exec(featureLoader)?.[1];
assert(studyStyle,'The current feature manifest identifies the study stylesheet');
const css=await(await get(studyStyle)).text();
assert.equal(css,fs.readFileSync('www'+studyStyle,'utf8'),'Web and native use the same current study stylesheet');
for(const selector of ['.story-video-stage','.story-video-play','.story-video-actions','.story-video-play svg','.story-video-corner-controls','.story-video-corner-controls button','.story-video-corner-controls svg'])assert(css.includes(selector),'The current packaged stylesheet retains '+selector);
for(const file of ['story-video-player.html','story-video-player.css','story-video-player.js','story-video.js']){
 const served=Buffer.from(await(await get('/'+file)).arrayBuffer());assert.deepEqual(served,fs.readFileSync('www/'+file),file+' shared native/web bytes');
}
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):path.join(p,e.name));
assert(!walk('www').some(p=>/\.(mp4|mov|webm)$/i.test(p)),'Native assets contain no video bytes');
const shell=fs.readFileSync('www/service-worker.js','utf8');assert(!/youtube|\.mp4/.test(shell),'No YouTube or video shell prefetch');
for(const [title,record]of Object.entries(JSON.parse(fs.readFileSync('data/story-videos.json')))){
 if(record.status==='pending'){assert(!client.includes(title),'Pending video is absent from playback configuration');continue;}
 if(record.provider==='youtube'){
  assert(client.includes(record.videoId),'Ready video reaches the app');
  assert(script.includes(record.videoId),'Ready video is allowed by the HTTPS bridge');
 }else{
  assert(client.includes(record.src),'Ready MP4 reaches the app');
  assert(!script.includes(record.src),'MP4s never enter the YouTube bridge');
 }
 const response=await get(record.poster);assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/webp');
 const bytes=Buffer.from(await response.arrayBuffer());
 assert.deepEqual(bytes,fs.readFileSync('src'+record.poster),'Web serves the reviewed poster');
 assert.deepEqual(bytes,fs.readFileSync('www'+record.poster),'Poster is packaged identically for offline native use');
 assert(bytes.length<100000,'Keep the poster small');
 assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,16),'WEBPVP8 ');
 assert.equal(bytes.readUInt16LE(26)&0x3fff,1280);assert.equal(bytes.readUInt16LE(28)&0x3fff,720);
}
console.log('PASS: active video and reviewed poster, shared web/native player assets, narrow frame/script policies, pending-video exclusion and no video bytes or YouTube requests in offline shell.');
