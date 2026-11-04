import assert from 'node:assert/strict';
import zlib from 'node:zlib';

// Explicit reader book IDs allow independent book branches to finish out of order.
export const illustratedBooks=new Map([
 [0,['Genesis',50]],
 [1,['Exodus',40]],
 [2,['Leviticus',27]],
 [3,['Numbers',36]],
 [4,['Deuteronomy',34]],
 [5,['Joshua',24]],
 [6,['Judges',21]],
 [7,['Ruth',4]],
 [8,['1 Samuel',31]],
 [9,['2 Samuel',24]],
 [10,['1 Kings',22]],
 [11,['2 Kings',25]],
 [12,['1 Chronicles',29]],
 [13,['2 Chronicles',36]],
 [14,['Ezra',10]],
 [15,['Nehemiah',13]],
 [16,['Esther',10]],
 [17,['Job',42]],
 [18,['Psalms',150]],
 [19,['Proverbs',31]],
 [20,['Ecclesiastes',12]],
 [21,['Song of Solomon',8]],
 [22,['Isaiah',66]],
 [23,['Jeremiah',52]],
 [24,['Lamentations',5]],
 [25,['Ezekiel',48]],
 [26,['Daniel',12]],
 [27,['Hosea',14]],
 [28,['Joel',3]],
 [29,['Amos',9]],
 [30,['Obadiah',1]],
 [31,['Jonah',4]],
 [32,['Micah',7]],
 [33,['Nahum',3]],
 [34,['Habakkuk',3]],
 [35,['Zephaniah',3]],
 [36,['Haggai',2]],
 [37,['Zechariah',14]],
 [38,['Malachi',4]],
 [39,['Matthew',28]],
 [40,['Mark',16]],
 [41,['Luke',24]],
 [42,['John',21]],
 [43,['Acts',28]],
 [44,['Romans',16]],
 [45,['1 Corinthians',16]],
 [46,['2 Corinthians',13]],
 [47,['Galatians',6]],
 [48,['Ephesians',6]],
 [49,['Philippians',4]],
 [50,['Colossians',4]],
 [51,['1 Thessalonians',5]],
 [52,['2 Thessalonians',3]],
 [53,['1 Timothy',6]],
 [54,['2 Timothy',4]],
 [55,['Titus',3]],
 [56,['Philemon',1]],
 [57,['Hebrews',13]],
 [58,['James',5]],
 [59,['1 Peter',5]],
 [60,['2 Peter',3]],
 [61,['1 John',5]],
 [62,['2 John',1]],
 [63,['3 John',1]],
 [64,['Jude',1]],
]);
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
  assert((storyHeadings[key]?.[1]||[]).some(title=>storyImages[title])||images[key]?.some(art=>art.afterVerse===0), name+' '+chapter+' needs an opening image');
  if(chapterSpecific[book]?.includes(chapter))assert(images[key]?.length, name+' '+chapter+' needs chapter-specific art beside its later Story scene');
 }
 return Object.keys(images).length;
}
