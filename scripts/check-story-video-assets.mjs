import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import worker from '../dist/server/index.js';

const get=p=>worker.fetch(new Request('https://biblelens.test'+p),{},{});
const app=await get('/'),appPolicy=app.headers.get('content-security-policy-report-only');
assert(appPolicy.includes("frame-src 'self' https://scripture-lens.kvn-mcgwn.chatgpt.site"));
assert(!appPolicy.match(/script-src[^;]*youtube/),'The reading app permits no YouTube scripts');
const response=await get('/story-video-player.html');assert.equal(response.status,200);
const html=await response.text();assert(html.includes('http-equiv="Content-Security-Policy"'));assert(html.includes('strict-origin-when-cross-origin'));
assert(html.includes('frame-src https://www.youtube-nocookie.com https://www.youtube.com'));assert(!html.includes('unsafe-inline'));
const script=await(await get('/story-video-player.js')).text();assert(!script.includes('/*__STORY_VIDEO_IDS__*/'));assert(script.includes('https://www.youtube.com/iframe_api'));
const client=await(await get('/story-video.js')).text();assert(!client.includes('/*__STORY_VIDEOS__*/'));assert(client.includes('https://scripture-lens.kvn-mcgwn.chatgpt.site'));
for(const file of ['story-video-player.html','story-video-player.css','story-video-player.js','story-video.js']){
 const served=Buffer.from(await(await get('/'+file)).arrayBuffer());assert.deepEqual(served,fs.readFileSync('www/'+file),file+' shared native/web bytes');
}
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):path.join(p,e.name));
assert(!walk('www').some(p=>/\.(mp4|mov|webm)$/i.test(p)),'Native assets contain no video bytes');
const shell=fs.readFileSync('www/service-worker.js','utf8');assert(!/youtube|\.mp4/.test(shell),'No YouTube or video shell prefetch');
for(const [title,record]of Object.entries(JSON.parse(fs.readFileSync('data/story-videos.json'))))if(record.status==='pending')assert(!client.includes(title),'Pending video is absent from playback configuration');
console.log('PASS: shared web/native player assets, narrow frame/script policies, pending-video exclusion and no video bytes or YouTube requests in offline shell.');
