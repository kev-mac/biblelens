import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const hostedStoryReplacements=[
 "/assets/story-the-widow-s-oil-and-the-shunammite-s-son-v2.webp",
 "/assets/story-jehu-s-revolt-v2.webp",
 "/assets/story-manasseh-amon-and-josiah-v2.webp",
 "/assets/story-the-death-of-saul-v2.webp",
 "/assets/story-the-census-and-the-temple-site-v2.webp",
 "/assets/story-jehoram-ahaziah-athaliah-and-joash-v2.webp",
 "/assets/story-cyrus-s-decree-and-the-return-v2.webp",
 "/assets/story-the-wall-completed-v2.webp",
 "/assets/story-elihu-speaks-v2.webp"
];

export function hostedArtwork() {
 const manifest=JSON.parse(fs.readFileSync('data/hosted-artwork.json','utf8'));
 const result={};
 assert.match(manifest.sourceCommit,/^[a-f0-9]{40}$/,'Pin public artwork to an immutable source commit');
 for(const src of manifest.assets){
  if(!hostedStoryReplacements.includes(src))assert.match(src,/^\/assets\/chapter-(?:genesis-\d{2}-(?:opening-v\d+|v[2-9]\d*)|(?:exodus|leviticus|numbers|deuteronomy|joshua|judges|1-samuel|2-samuel|1-kings|2-kings|1-chronicles|2-chronicles|ezra|nehemiah|esther|job|proverbs|ecclesiastes)-\d{2}-(?:opening-)?v\d+|psalms-\d{3}-opening-v\d+)\.webp$/);
  assert(!result[src],'Duplicate hosted artwork');
  const bytes=fs.readFileSync('src'+src);assert(bytes.length>0&&bytes.length<250000);
  result[src]={url:'https://raw.githubusercontent.com/kev-mac/biblelens/'+manifest.sourceCommit+'/src'+src,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length};
 }
 const images=JSON.parse(fs.readFileSync('data/chapter-images.json','utf8'));
 const expected=Object.entries(images).flatMap(([key,entries])=>{
  const book=Number(key.split(':')[0]);
  if(book>=1&&book<=20)return entries.map(art=>art.src);
  if(book===0)return entries.filter(art=>art.afterVerse===0||/-v[2-9]\d*\.webp$/.test(art.src)).map(art=>art.src);
  return [];
 });
 const storyImages=JSON.parse(fs.readFileSync('data/story-images.json','utf8'));
 const activeStorySources=new Set(Object.values(storyImages).map(art=>art.src));
 for(const src of hostedStoryReplacements){assert(activeStorySources.has(src),'Hosted Story replacement must remain active: '+src);expected.push(src);}
 assert.deepEqual(Object.keys(result).sort(),expected.sort(),'Every new Genesis and Exodus–Ecclesiastes chapter image uses the checked public source');
 return result;
}
