import assert from 'node:assert/strict';
import zlib from 'node:zlib';

// Artwork is editorial metadata; scripture and existing Story placements stay intact.
export function validateChapterImages(images, chapters, storyHeadings, storyImages) {
 for (const [key, entries] of Object.entries(images)) {
  assert(chapters[key], 'Unknown illustrated chapter: '+key);
  const chapter=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
  assert(Array.isArray(entries)&&entries.length, 'Missing chapter artwork: '+key);
  const placements=new Set();
  for (const art of entries) {
   assert(Number.isInteger(art.afterVerse)&&chapter.verses.some(v=>v.n===art.afterVerse), 'Unknown image verse: '+key);
   assert(!placements.has(art.afterVerse), 'Duplicate image placement: '+key);
   placements.add(art.afterVerse);
   assert.match(art.src,/^\/assets\/chapter-[a-z0-9-]+-v\d+\.webp$/);
   assert(art.alt.startsWith('Imagined scene: ')&&art.alt.length>30, 'Describe imagined artwork: '+key);
   assert.equal(art.width,1200);assert.equal(art.height,675);
  }
 }
 for(let chapter=1;chapter<=50;chapter++) {
  const key='0:'+chapter;
  const existing=Object.values(storyHeadings[key]||{}).flat().some(title=>storyImages[title]);
  assert(existing||images[key]?.length, 'Genesis '+chapter+' needs at least one image');
  if([17,31,39,42].includes(chapter))assert(images[key]?.length, 'Genesis '+chapter+' needs chapter-specific art beside its later Story scene');
 }
 return Object.keys(images).length;
}
