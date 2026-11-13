import {gunzipSync} from 'node:zlib';
import {passageReference,referenceVerses} from './story-topics.mjs';

const slug=value=>value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
// Membership is based only on each collection's source passages, never on
// supporting cross-references or New Testament lens comparisons.
export function readerMemberships(stories,commandments,books,chapters){
 const verseNumbers=Object.fromEntries(Object.entries(chapters).map(([key,encoded])=>[key,JSON.parse(gunzipSync(Buffer.from(encoded,'base64'))).verses.map(v=>v.n)]));
 const index={};
 const attach=(reference,kind,value)=>{
  for(const key of referenceVerses(passageReference(reference,books),verseNumbers)){
   const [book,chapter,verse]=key.split(':'),chapterKey=book+':'+chapter;
   const chapterMemberships=index[chapterKey]||={};
   const membership=chapterMemberships[verse]||={stories:[],commandments:[]};
   if(!membership[kind].some(item=>kind==='stories'?item.href===value.href:item===value))membership[kind].push(value);
  }
 };
 for(const group of stories)for(const story of group.stories){
  if(story.title==='Parallel Accounts in Genesis')continue;
  const link={title:story.title,href:'#stories/'+slug(group.book)+'/'+slug(story.title)};
  for(const reference of story.passages?.length?story.passages:[story.passage])attach(reference,'stories',link);
 }
 for(const item of commandments)for(const reference of item.references?.length?item.references:[item.passage])attach(reference,'commandments',item.code);
 return index;
}
