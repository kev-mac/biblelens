import assert from 'node:assert/strict';
import zlib from 'node:zlib';

export const illustratedBooks=[['Genesis',50],['Exodus',40],['Leviticus',27],['Numbers',36],['Deuteronomy',34],['Joshua',24],['Judges',21]];
const chapterSpecific={0:[17,31,39,42],1:[7,11,15],3:[10,16,26],5:[7]};

// Artwork is editorial metadata; scripture and existing Story placements stay intact.
export function validateChapterImages(images, chapters, storyHeadings, storyImages) {
 for (const [key, entries] of Object.entries(images)) {
  assert(chapters[key], 'Unknown illustrated chapter: '+key);
  const chapter=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
  assert(Array.isArray(entries)&&entries.length, 'Missing chapter artwork: '+key);
  const placements=new Set();
  for (const art of entries) {
   assert(Number.isInteger(art.afterVerse)&&(art.afterVerse===0||chapter.verses.some(v=>v.n===art.afterVerse)), 'Unknown image verse: '+key);
   assert(!placements.has(art.afterVerse), 'Duplicate image placement: '+key);
   placements.add(art.afterVerse);
   assert.match(art.src,/^\/assets\/chapter-[a-z0-9-]+-v\d+\.webp$/);
   assert(art.alt.startsWith('Imagined scene: ')&&art.alt.length>30, 'Describe imagined artwork: '+key);
   assert.equal(art.width,960);assert.equal(art.height,540);
  }
 }
 for(const [book,[name,count]] of illustratedBooks.entries())for(let chapter=1;chapter<=count;chapter++) {
  const key=book+':'+chapter;
  const existing=Object.values(storyHeadings[key]||{}).flat().some(title=>storyImages[title]);
  assert(existing||images[key]?.length, name+' '+chapter+' needs at least one image');
  if(book<=6)assert((storyHeadings[key]?.[1]||[]).some(title=>storyImages[title])||images[key]?.some(art=>art.afterVerse===0), name+' '+chapter+' needs an opening image');
  if(chapterSpecific[book]?.includes(chapter))assert(images[key]?.length, name+' '+chapter+' needs chapter-specific art beside its later Story scene');
 }
 return Object.keys(images).length;
}
