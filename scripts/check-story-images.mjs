import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import worker from '../dist/server/index.js';
const get=path=>worker.fetch(new Request('https://biblelens.test'+path),{},{});
const images=JSON.parse(fs.readFileSync('data/story-images.json','utf8'));
const catalog=await(await get('/stories.json')).json();
assert.deepEqual(Object.keys(images),catalog.flatMap(group=>group.stories).slice(0,15).map(story=>story.title));
for(const [title,art]of Object.entries(images)){
 assert.match(art.src,/^\/assets\/story-[a-z-]+-v[12]\.jpg$/);
 assert(art.alt.length>20);
 const response=await get(art.src);assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/jpeg');
 const bytes=Buffer.from(await response.arrayBuffer());assert(bytes.length<650000);assert.equal(bytes.readUInt16BE(0),0xffd8);
 assert.deepEqual(bytes,fs.readFileSync('src'+art.src));
 assert.deepEqual(bytes,fs.readFileSync('www'+art.src),'Native and web share identical image bytes');
}
const source=await(await get('/stories.js')).text();
assert(!source.includes('/*__STORY_IMAGES__*/'));
const context={esc:value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')};
vm.createContext(context);vm.runInContext(source.slice(0,source.indexOf('let storiesActive=')),context);
for(const title of Object.keys(images)){
 const summary=context.storyIllustration(title),reader=context.storyIllustration(title,'reader');
 assert(summary.includes('loading="lazy"'));assert(reader.includes('loading="eager"'));
 assert(summary.includes(images[title].src));assert(reader.includes(images[title].src));
 assert(!summary.includes('<figcaption>'));assert(!reader.includes('<figcaption>'));
}
assert.equal(context.storyIllustration('A story without artwork'),'');
const starts=[[1,1,'The Creation'],[3,1,'The Fall of Man'],[4,1,'Cain and Abel'],[4,25,'The Line of Seth'],[6,9,'Noah and the Flood'],[9,8,'Noahic Covenant'],[9,18,'The Family of Noah'],[11,1,'The Tower of Babel'],[11,27,'The Call of Abram'],[12,1,'Abrahamic Covenant'],[13,1,'Abram and Lot'],[16,1,'Hagar and Ishmael'],[17,1,'Abraham and Sarah’s Covenant'],[19,1,'Lot Leaves Sodom'],[21,1,'Isaac and Ishmael']];
for(const [chapter,verse,title]of starts){
 const data=await(await get(`/api/chapter?book=0&chapter=${chapter}`)).json();
 assert(data.eventHeadings[verse].includes(title),title+' retains its exact starting verse');
}
console.log('PASS: first fifteen Story images, valid packaged JPEGs, native/web byte parity, shared card/Read figures, graceful missing artwork and verse-aligned titles.');
