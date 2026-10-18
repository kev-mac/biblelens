import fs from 'node:fs';
import zlib from 'node:zlib';
export const storySlug = value => value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function validateCharacters() {
 const profiles=JSON.parse(fs.readFileSync('src/data/characters.json','utf8'));
 const stories=JSON.parse(fs.readFileSync('data/stories.json','utf8'));
 const books=JSON.parse(fs.readFileSync('data/books.json','utf8'));
 const chapters=JSON.parse(fs.readFileSync('data/chapters.json','utf8'));
 const seen=new Set();
 const nonempty=value=>typeof value==='string'&&value.trim().length>0;
 const strings=value=>Array.isArray(value)&&value.length>0&&value.every(nonempty);
 const eras=['Primeval','Patriarchal','Exodus','Conquest','Judges','Monarchy','Prophets','Gospels','Apostolic','Across scripture'];
 for(const profile of profiles){
  const fail=message=>{throw Error(`Character ${profile.id}: ${message}`);};
  if(!nonempty(profile.id)||!/^[a-z0-9-]+$/.test(profile.id)||seen.has(profile.id))fail('invalid or duplicate ID');seen.add(profile.id);
  if(!['female','male','unspecified'].includes(profile.sex))fail('invalid sex classification');
  if(!nonempty(profile.name)||!nonempty(profile.summary)||!eras.includes(profile.era))fail('invalid metadata');
  if(profile.aliases!==undefined&&!strings(profile.aliases))fail('invalid aliases');
  for(const key of ['parents','spouses','children','siblings'])if(profile.lineage?.[key]!==undefined&&!strings(profile.lineage[key]))fail(`invalid ${key}`);
  if(profile.lineage?.tribe!==undefined&&!nonempty(profile.lineage.tribe))fail('invalid tribe');
  if(!nonempty(profile.geography?.origin)||!strings(profile.geography?.residence))fail('invalid geography');
  const anchors=profile.narrative_anchors;
  if(!strings(anchors?.books)||anchors.books.some(name=>!books.some(book=>book.name===name)))fail('invalid books');
  if(!strings(anchors.key_verses)||!Array.isArray(anchors.linked_stories))fail('missing anchors');
  for(const ref of anchors.key_verses){
   const match=/^(.*?) (\d+):(\d+)$/.exec(ref),book=match&&books.find(book=>book.name===match[1]);
   const encoded=book&&chapters[`${book.id}:${+match[2]}`];
   if(!encoded||!JSON.parse(zlib.gunzipSync(Buffer.from(encoded,'base64'))).verses.some(verse=>verse.n===+match[3]))fail(`missing verse ${ref}`);
  }
  for(const anchor of anchors.linked_stories){
   const entry=stories.find(entry=>entry.stories.some(story=>story.title===anchor.title&&story.passage===anchor.passage));
   if(!entry||anchor.story_id!==`${storySlug(entry.book)}-${storySlug(anchor.title)}`||anchor.route!==`#stories/${storySlug(entry.book)}/${storySlug(anchor.title)}`)fail(`broken story ${anchor.story_id}`);
  }
 }
 return profiles.length;
}
