import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const hostedStoryReplacements=[
 "/assets/story-sending-out-the-twelve-v2.webp",
 "/assets/story-the-death-of-ezekiel-s-wife-v2.webp",
 "/assets/story-jeremiah-in-the-cistern-v2.webp",
 "/assets/story-sennacherib-s-threat-and-hezekiah-v2.webp",
 "/assets/story-hezekiah-and-sennacherib-v2.webp",
 "/assets/story-the-temple-built-v2.webp",
 "/assets/story-ahab-and-micaiah-v2.webp",
 "/assets/story-absalom-s-rebellion-v2.webp",
 "/assets/story-gideon-and-the-midianites-v3.webp",
 "/assets/story-samson-v2.webp",
 "/assets/story-joshua-commissioned-v2.webp",
 "/assets/story-crossing-the-jordan-v2.webp",
 "/assets/story-the-fall-of-jericho-v2.webp",
 "/assets/story-achan-s-sin-and-ai-v2.webp",
 "/assets/story-the-gibeonite-deception-v2.webp",
 "/assets/story-the-sun-stands-still-v2.webp",
 "/assets/story-northern-campaign-and-the-land-taken-v2.webp",
 "/assets/story-caleb-receives-hebron-v2.webp",
 "/assets/story-the-altar-by-the-jordan-v2.webp",
 "/assets/story-joshua-s-farewell-and-covenant-at-shechem-v2.webp",

 "/assets/story-moses-recalls-the-golden-calf-v2.webp",
 "/assets/story-joshua-commissioned-and-the-law-entrusted-v2.webp",
 "/assets/story-counting-the-camp-v2.webp",
 "/assets/story-aaronic-blessing-v2.webp",
 "/assets/story-miriam-and-aaron-speak-against-moses-v2.webp",
 "/assets/story-korah-s-rebellion-v2.webp",
 "/assets/story-edom-refuses-passage-and-aaron-dies-v2.webp",
 "/assets/story-balaam-and-balak-v2.webp",
 "/assets/story-a-new-census-and-joshua-appointed-v2.webp",
 "/assets/story-vengeance-on-midian-v2.webp",

 "/assets/story-aaron-and-his-sons-are-ordained-v2.webp",
 "/assets/story-the-blasphemer-stoned-v2.webp",
 "/assets/story-moses-returns-to-egypt-v2.webp",
 "/assets/story-bitter-water-manna-and-quail-v2.webp",
 "/assets/story-moses-sees-gods-glory-v2.webp",
 "/assets/story-noah-and-the-flood-v3.webp",
 "/assets/story-isaac-and-ishmael-v2.webp",
 "/assets/story-joseph-reunites-his-family-v2.webp",
 "/assets/story-jacob-blesses-his-family-v2.webp",
 "/assets/story-the-creation-v3.webp",
 "/assets/story-the-fall-of-man-v3.webp",
 "/assets/story-cain-and-abel-v3.webp",
 "/assets/story-the-widow-s-oil-and-the-shunammite-s-son-v2.webp",
 "/assets/story-jehu-s-revolt-v2.webp",
 "/assets/story-manasseh-amon-and-josiah-v2.webp",
 "/assets/story-the-death-of-saul-v2.webp",
 "/assets/story-the-census-and-the-temple-site-v2.webp",
 "/assets/story-jehoram-ahaziah-athaliah-and-joash-v2.webp",
 "/assets/story-cyrus-s-decree-and-the-return-v2.webp",
 "/assets/story-the-wall-completed-v2.webp",
 "/assets/story-elihu-speaks-v2.webp",
 "/assets/story-ezekiel-s-vision-and-commission-v2.webp",
 "/assets/story-belshazzar-s-feast-v2.webp",
 "/assets/story-daniel-s-visions-v2.webp",
 "/assets/story-peter-s-confession-and-the-transfiguration-v2.webp",
 "/assets/story-pentecost-v2.webp",
 "/assets/story-paul-s-first-journey-v2.webp"
];

export function hostedArtwork() {
 const manifest=JSON.parse(fs.readFileSync('data/hosted-artwork.json','utf8'));
 const result={};
 assert.match(manifest.sourceCommit,/^[a-f0-9]{40}$/,'Pin public artwork to an immutable source commit');
 for(const src of manifest.assets){
  if(!hostedStoryReplacements.includes(src))assert.match(src,/^\/assets\/chapter-(?:genesis-\d{2}-(?:opening-v\d+|v[2-9]\d*)|(?:exodus|leviticus|numbers|deuteronomy|joshua|judges|1-samuel|2-samuel|1-kings|2-kings|1-chronicles|2-chronicles|ezra|nehemiah|esther|job|proverbs|ecclesiastes|song-of-solomon|isaiah|jeremiah|lamentations|ezekiel|daniel|hosea|joel|amos|obadiah|jonah|micah|nahum|habakkuk|zephaniah|haggai|zechariah|malachi|matthew|mark|luke|john|acts|romans|1-corinthians|2-corinthians|galatians|ephesians|philippians|colossians|1-thessalonians|2-thessalonians|1-timothy|2-timothy|titus|philemon|hebrews|james|1-peter|2-peter|1-john|2-john|3-john|jude|revelation)-\d{2}-(?:opening-)?v\d+|psalms-\d{3}-opening-v\d+)\.webp$/);
  assert(!result[src],'Duplicate hosted artwork');
  const bytes=fs.readFileSync('src'+src);assert(bytes.length>0&&bytes.length<250000);
  result[src]={url:'https://raw.githubusercontent.com/kev-mac/biblelens/'+manifest.sourceCommit+'/src'+src,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length};
 }
 const images=JSON.parse(fs.readFileSync('data/chapter-images.json','utf8'));
 const expected=Object.entries(images).flatMap(([key,entries])=>{
  const book=Number(key.split(':')[0]);
  if(book>=1&&book<=65)return entries.map(art=>art.src);
  if(book===0)return entries.filter(art=>art.afterVerse===0||/-v[2-9]\d*\.webp$/.test(art.src)).map(art=>art.src);
  return [];
 });
 const storyImages=JSON.parse(fs.readFileSync('data/story-images.json','utf8'));
 const activeStorySources=new Set(Object.values(storyImages).map(art=>art.src));
 for(const src of hostedStoryReplacements){assert(activeStorySources.has(src),'Hosted Story replacement must remain active: '+src);expected.push(src);}
 assert.deepEqual(Object.keys(result).sort(),expected.sort(),'Every new Genesis and Exodus–Revelation chapter image uses the checked public source');
 return result;
}
