import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';

export const commandmentSchema=JSON.parse(fs.readFileSync(new URL('../schemas/commandments.schema.json',import.meta.url),'utf8'));
export function redLetters(){const context={};vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('../src/red-letters.js',import.meta.url),'utf8')+'\nthis.red=RED_LETTERS;',context);return context.red;}
export function wordsOfJesus(record,red){return record.refs.some(ref=>red[ref.book+':'+ref.chapter]?.[ref.verse]?.kjv?.length);}
export function expandCommandmentRef(ref,books,chapters){
 const m=/^(.*?) (\d+):(\d+)(?:-(\d+))?$/.exec(ref),book=m&&books.find(b=>b.name===m[1]);
 const encoded=book&&chapters[book.id+':'+m[2]];if(!encoded)throw Error('Invalid commandment reference: '+ref);
 const chapter=JSON.parse(zlib.gunzipSync(Buffer.from(encoded,'base64'))),start=+m[3],end=+(m[4]||m[3]);
 if(end<start||!chapter.verses.some(v=>v.n===start)||!chapter.verses.some(v=>v.n===end))throw Error('Invalid verse range: '+ref);
 return chapter.verses.filter(v=>v.n>=start&&v.n<=end).map(v=>({book:book.id,chapter:+m[2],verse:v.n,label:book.name+' '+m[2]+':'+v.n,text:v.kjv}));
}
export function validateCommandments(records,books,chapters,red=redLetters()){
 const ids=new Set(),allIds=new Set(records.map(r=>r.id));let count=0;
 for(const record of records.filter(r=>r.mode==='commandments')){
  const fail=message=>{throw Error(record.id+': '+message);};count++;
  if(ids.has(record.id))fail('duplicate commandment ID');ids.add(record.id);
  for(const field of commandmentSchema.required)if(record[field]===undefined)fail('missing '+field);
  for(const field of ['theme','commandmentType'])if(record[field]!==undefined&&!commandmentSchema.properties[field].enum.includes(record[field]))fail('invalid '+field);
  if(record.status!=='Context'||record.tag||record.tags?.length||record.witness)fail('commandments are untagged reference records with Context status');
  for(const field of ['tenCommandments','wordsOfJesus'])if(record[field]!==undefined&&typeof record[field]!=='boolean')fail('invalid '+field);
  if(record.wordsOfJesus!==wordsOfJesus(record,red))fail('wordsOfJesus differs from red-letter data');
  for(const field of ['title','summary','text','scope','checked'])if(typeof record[field]!=='string'||!record[field].trim())fail('missing '+field);
  if(!Array.isArray(record.refs)||!record.refs.length||!Array.isArray(record.sources)||!record.sources.length)fail('references and sources required');
  const refs=new Set(record.refs.map(r=>r.label));if(!refs.has(record.ref))fail('primary reference missing from refs');
  for(const [,ref,quote] of record.text.matchAll(/KJV (.*? \d+:\d+): \u201c([^\u201d]+)\u201d/g))if(!expandCommandmentRef(ref,books,chapters)[0].text.includes(quote))fail('KJV quotation differs at '+ref);
  for(const ref of record.refs){const verse=expandCommandmentRef(ref.label,books,chapters)[0];if(verse.book!==ref.book||verse.chapter!==ref.chapter||verse.verse!==ref.verse)fail('reference coordinates disagree');}
  for(const field of ['repeatedIn','relatedRecords'])if(record[field]!==undefined){if(!Array.isArray(record[field])||new Set(record[field]).size!==record[field].length)fail('invalid '+field);for(const ref of record[field]){if(field==='repeatedIn')expandCommandmentRef(ref,books,chapters);else if(typeof ref!=='string'||!allIds.has(ref))fail('unknown related record '+ref);}}
 }
 return count;
}
