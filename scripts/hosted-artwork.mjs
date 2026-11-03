import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

export function hostedArtwork() {
 const manifest=JSON.parse(fs.readFileSync('data/hosted-artwork.json','utf8'));
 const result={};
 assert.match(manifest.sourceCommit,/^[a-f0-9]{40}$/,'Pin public artwork to an immutable source commit');
 for(const src of manifest.assets){
  assert.match(src,/^\/assets\/chapter-(?:genesis-\d{2}-(?:opening-v\d+|v[2-9]\d*)|(?:exodus|leviticus|numbers|deuteronomy|joshua)-\d{2}-v\d+)\.webp$/);
  assert(!result[src],'Duplicate hosted artwork');
  const bytes=fs.readFileSync('src'+src);assert(bytes.length>0&&bytes.length<250000);
  result[src]={url:'https://raw.githubusercontent.com/kev-mac/biblelens/'+manifest.sourceCommit+'/src'+src,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length};
 }
 const images=JSON.parse(fs.readFileSync('data/chapter-images.json','utf8'));
 const expected=Object.entries(images).flatMap(([key,entries])=>{
  const book=Number(key.split(':')[0]);
  if(book>=1&&book<=5)return entries.map(art=>art.src);
  if(book===0)return entries.filter(art=>art.afterVerse===0||/-v[2-9]\d*\.webp$/.test(art.src)).map(art=>art.src);
  return [];
 });
 assert.deepEqual(Object.keys(result).sort(),expected.sort(),'Every new Genesis and Exodus–Joshua chapter image uses the checked public source');
 return result;
}
