import fs from 'node:fs';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import {passageReference} from './story-topics.mjs';
const books=JSON.parse(fs.readFileSync(new URL('../data/books.json',import.meta.url)));
const chapters=JSON.parse(fs.readFileSync(new URL('../data/chapters.json',import.meta.url)));
const decoded=new Map();
function chapter(book,c){const key=book+':'+c;if(!decoded.has(key))decoded.set(key,JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64'))));return decoded.get(key);}
export function kjvQuestionPassage(book,c,v){return {ref:`${books[book].name} ${c}:${v}`,href:`#read/${book}/${c}/${v}`,verses:[{number:v,text:chapter(book,c).verses.find(row=>row.n===v).kjv}]};}
// Owner-requested UX14c additions to the original accepted RC1 passage fixture.
export const questionPassageAdditions={B01:[kjvQuestionPassage(12,20,5)],B14:[kjvQuestionPassage(4,14,20)]};
const names=[...new Set(books.flatMap(b=>[b.name,b.name.replace(/^[123] /,'')]).concat('Psalm'))].sort((a,b)=>b.length-a.length);
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const mentions=new RegExp('\\b('+names.map(escape).join('|')+")(?:['’]s)?(?:\\s+(\\d+):(\\d+)(?:\\s*[-–]\\s*(?:(\\d+):)?(\\d+))?)?\\b",'g');
export function validateQuestionPassages(questions){
 for(const q of questions){
  const passages=[...q.side_a,...q.side_b];
  const refs=passages.map(p=>{
   assert(p.verses?.length,`${q.id}: missing verse text for ${p.ref}`);
   const [book,c,v,ec,ev]=passageReference(p.ref,books);
   assert.equal(p.href,`#read/${book}/${c}/${v}`,`${q.id}: wrong passage route`);
   const expected=[];for(let n=c;n<=ec;n++)for(const verse of chapter(book,n).verses)if((n!==c||verse.n>=v)&&(n!==ec||verse.n<=ev))expected.push({number:verse.n,text:verse.kjv});
   assert.deepEqual(p.verses,expected,`${q.id}: incomplete or changed KJV text for ${p.ref}`);
   return {book,c,v,ec,ev};
  });
  for(const reading of q.readings)for(const m of (reading.label+' '+reading.summary).matchAll(mentions)){
   const name=m[1]==='Psalm'?'Psalms':m[1],ids=books.filter(b=>b.name===name||b.name.replace(/^[123] /,'')===name).map(b=>b.id);
   const linked=refs.filter(r=>ids.includes(r.book));
   assert(linked.length,`${q.id}: reading mentions ${m[1]} without a passage`);
   if(m[2]){const c=+m[2],v=+m[3],ec=+(m[4]||m[2]),ev=+(m[5]||m[3]);for(let n=c;n<=ec;n++){const end=n===ec?ev:chapter(linked[0].book,n).verses.at(-1).n;for(let x=n===c?v:1;x<=end;x++)assert(linked.some(r=>(n>r.c||n===r.c&&x>=r.v)&&(n<r.ec||n===r.ec&&x<=r.ev)),`${q.id}: reading reference ${m[0]} lacks verse ${n}:${x}`);}}
  }
 }
 return `${questions.length} questions: reading books, references and exact KJV passage text`;
}
