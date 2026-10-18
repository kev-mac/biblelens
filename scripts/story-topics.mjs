import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import zlib from 'node:zlib';

// Broad headings are unhelpful pivots. Person headings belong in Characters.
export const genericTopics = new Set(['GOD','JESUS CHRIST','CHRIST','BIBLE','SCRIPTURES','SCRIPTURE','MAN','MEN','WOMAN','WOMEN','ISRAEL','ISRAELITES','HISTORY','RELIGION','CHRISTIANITY','EARTH','DAY','GROUND','IMAGE']);
const words = text => text.toLowerCase().match(/[a-z]{4,}/g) || [];

// Expand against actual verse bounds, including chapter-only refs (verse = 0).
export function referenceVerses([book,chapter,verse,endChapter,endVerse], chapters) {
 const lastChapter=endChapter||chapter, result=[];
 if(lastChapter<chapter)return result;
 for(let c=chapter;c<=lastChapter;c++){
  const verses=chapters[`${book}:${c}`];if(!verses)continue;
  const start=c===chapter?(verse||1):1;
  const end=c===lastChapter?(endChapter?(endVerse||Infinity):(verse||Infinity)):Infinity;
  for(const n of verses)if(n>=start&&n<=end)result.push(`${book}:${c}:${n}`);
 }
 return result;
}
export function passageReference(passage, books) {
 const m=/^(.+?)\s+(\d+):(\d+)(?:\s*[-–]\s*(?:(\d+):)?(\d+))?$/.exec(passage);
 const book=m&&books.find(b=>b.name===m[1]);
 if(!book)throw Error(`Unsupported story passage: ${passage}`);
 const ref=[book.id,+m[2],+m[3],+(m[4]||m[2]),+(m[5]||m[3])];
 if(ref[3]<ref[1]||ref[3]===ref[1]&&ref[4]<ref[2])throw Error(`Reversed story passage: ${passage}`);
 return ref;
}
export function mergeStoryTopics(stories, topics, {books,chapters,people=[],maxTopics=5,exclude=[]}) {
 const blocked=new Set([...genericTopics,...exclude,...books.map(b=>b.name.toUpperCase()),...people.flatMap(p=>[p.name,p.label,...(p.aliases||[])]).filter(Boolean).map(s=>s.toUpperCase())]);
 const indexed=topics.filter(t=>!blocked.has(t.label.toUpperCase())&&!blocked.has(t.label.replace(/\s*\(.*/, '').toUpperCase())).map(t=>({...t,verses:new Set(t.refs.flatMap(r=>referenceVerses(r,chapters)))}));
 return stories.map(story=>{
  const verses=new Set(referenceVerses(passageReference(story.passage,books),chapters));
  const text=new Set(words(story.title+' '+story.summary));
  const candidates=indexed.map(t=>{
   const hits=[...verses].filter(v=>t.verses.has(v)).length;
   // Passage coverage with a specificity penalty; lexical matches break topical ties.
   const lexical=words(t.label).some(w=>text.has(w))?1.5:0;
   return {label:t.label,hits,score:hits&&(lexical||new Set(t.refs.map(r=>r[0])).size>=2)?hits/Math.sqrt(t.verses.size)*(1+lexical):0};
  }).filter(t=>t.score>0).sort((a,b)=>b.score-a.score||a.label.localeCompare(b.label,'en'));
  return {...story,topics:[...new Set(candidates.map(t=>t.label))].slice(0,Math.max(0,Math.min(5,maxTopics)))};
 });
}
export function loadTopicOptions(root='.') {
 const read=name=>JSON.parse(fs.readFileSync(path.join(root,'data',name),'utf8'));
 return {books:read('books.json'),people:read('reference/people.json'),chapters:Object.fromEntries(Object.entries(read('chapters.json')).map(([key,value])=>[key,JSON.parse(zlib.gunzipSync(Buffer.from(value,'base64'))).verses.map(v=>v.n)]))};
}
export function tagStoryCatalog(catalog,topics,options){return catalog.map(entry=>({...entry,stories:mergeStoryTopics(entry.stories,topics,options)}));}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [input='data/stories.json',topicFile='data/reference/topics.json',output]=process.argv.slice(2);
 const source=JSON.parse(fs.readFileSync(input,'utf8')),topics=JSON.parse(fs.readFileSync(topicFile,'utf8')),options=loadTopicOptions();
 const tagged=source[0]?.stories?tagStoryCatalog(source,topics,options):mergeStoryTopics(source,topics,options);
 const json=JSON.stringify(tagged,null,2)+'\n';if(output)fs.writeFileSync(output,json);else process.stdout.write(json);
}
