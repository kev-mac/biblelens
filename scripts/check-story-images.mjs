import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import worker from '../dist/server/index.js';
const get=path=>worker.fetch(new Request('https://biblelens.test'+path),{},{});
const images=JSON.parse(fs.readFileSync('data/story-images.json','utf8'));
const catalog=await(await get('/stories.json')).json();
const illustratedBooks=['Genesis','Exodus','Leviticus'];
const books=JSON.parse(fs.readFileSync('data/books.json','utf8'));
assert.deepEqual(Object.keys(images),catalog.filter(group=>illustratedBooks.includes(group.book)).flatMap(group=>group.stories).map(story=>story.title));
for(const [title,art]of Object.entries(images)){
 assert.match(art.src,/^\/assets\/story-[a-z-]+-v[12]\.webp$/);
 assert(art.alt.length>20);
 const response=await get(art.src);assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/webp');
 const bytes=Buffer.from(await response.arrayBuffer());assert(bytes.length<250000);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,16),'WEBPVP8 ');
 assert.equal(art.width,1200);assert.equal(art.height,675);assert.equal(bytes.readUInt16LE(26)&0x3fff,art.width);assert.equal(bytes.readUInt16LE(28)&0x3fff,art.height);
 assert(!fs.existsSync('www'+art.src.replace('.webp','.jpg')),'Obsolete Story JPEGs are absent from native bundle');
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
 const displayedTitle=title.replace(/\bCommandments\b/g,'Laws');
 assert(context.storyIllustration(displayedTitle,'reader').includes(images[title].src),'Read title aliases retain matching artwork');
 assert(!summary.includes('<figcaption>'));assert(!reader.includes('<figcaption>'));
}
assert.equal(context.storyIllustration('A story without artwork'),'');
const chapters=new Map();
for(const {id:book,name}of books.filter(book=>illustratedBooks.includes(book.name))){
 for(const story of catalog.find(group=>group.book===name).stories){
  const match=story.passage.match(/(\d+):(\d+)/);assert(match,story.title+' has a starting passage');
  const chapter=Number(match[1]),verse=Number(match[2]),key=book+':'+chapter;
  if(!chapters.has(key))chapters.set(key,await(await get(`/api/chapter?book=${book}&chapter=${chapter}`)).json());
  assert(chapters.get(key).eventHeadings[verse].includes(story.title.replace(/\bCommandments\b/g,'Laws')),story.title+' retains its exact starting verse');
 }
}
console.log('PASS: complete '+illustratedBooks.join(', ')+' Story images, valid 1200px packaged WebP files, native/web byte parity, shared card/Read figures, graceful missing artwork and verse-aligned titles.');
