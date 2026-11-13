// Import only publisher-supplied associations; never infer English links.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {gzipSync,gunzipSync} from 'node:zlib';
export const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
export const clean=value=>String(value||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
export function importTranslation(bytes,books){
 const lines=bytes.toString('utf8').split(/\r?\n/),header=lines.shift().split('\t');
 if(header.length!==23||header[2]!=='BSB Sort'||header[7]!=='Translit'||header[12]!=='VerseId'||header[18].trim()!=='BSB version')throw Error('Unexpected publisher table schema');
 const chapters={},omitted=[];let current=null,lastSort=0;
 for(const line of lines){
  if(!line.trim())continue;
  const row=line.split('\t');if(row.length!==23)throw Error('Unexpected table row length');
  if(!row[12]&&!clean(row[5])&&!clean(row[18]))continue;const order=Number(row[2]);if(order<lastSort)throw Error('Publisher English order changed');lastSort=order;
  if(row[12]){
   const ref=/^(.+) (\d+):(\d+)$/.exec(row[12]);if(!ref)throw Error('Invalid reference: '+row[12]);
   const book=books.find(b=>b.name===(ref[1]==='Psalm'?'Psalms':ref[1]));if(!book)throw Error('Unknown book: '+ref[1]);
   const key=book.id+':'+Number(ref[2]),verse=Number(ref[3]);
   chapters[key]??={};if(chapters[key][verse])throw Error('Repeated verse: '+row[12]);
   current=chapters[key][verse]={tokens:[],notes:[]};
  }
  if(!current)throw Error('Row without verse');
  const original=clean(row[5]),transliteration=clean(row[7]),rawEnglish=clean(row[18]),english=rawEnglish==='-'?'':rawEnglish;
  if(!original&&!english)continue;
  if(!['Hebrew','Aramaic','Greek'].includes(row[4]))throw Error('Unknown language: '+row[4]);
  // Multi-clause textual additions are flagged, never guessed into a word link.
  const uncertain=/<[^>]*>/.test(row[18]);
  current.tokens.push([english,original,transliteration,row[4],clean(row[17])+clean(row[19])+clean(row[20]),...(uncertain?[1]:[])]);
  const note=clean(row[21]);if(note&&!current.notes.includes(note))current.notes.push(note);
 }
 let verses=0,tokens=0;const verseLanguages={};
 for(const [key,chapter]of Object.entries(chapters))for(const [verse,value]of Object.entries(chapter)){
  if(!value.tokens.length||!value.tokens.some(t=>t[0])){omitted.push(key+':'+verse);delete chapter[verse];continue;}
  verses++;tokens+=value.tokens.length;
  for(const language of new Set(value.tokens.map(t=>t[3])))verseLanguages[language]=(verseLanguages[language]||0)+1;
  if(!value.notes.length)delete value.notes;
 }
 return {chapters,coverage:{chapters:Object.keys(chapters).length,verses,tokens,verseLanguages,omitted}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const input=process.argv[2];if(!input)throw Error('Usage: node scripts/import-translation.mjs /path/to/bsb_tables.tsv');
 const bytes=fs.readFileSync(input),books=JSON.parse(fs.readFileSync('data/books.json','utf8'));
 const {chapters,coverage}=importTranslation(bytes,books),directory='data/translation/bsb-v1';fs.mkdirSync(directory,{recursive:true});
 const files={};let compressedBytes=0;
 for(const [key,verses]of Object.entries(chapters)){
  const buffer=gzipSync(JSON.stringify({verses}),{level:9}),file=key.replace(':','-')+'.json.gz';
  fs.writeFileSync(directory+'/'+file,buffer);files[file]={sha256:digest(buffer),bytes:buffer.length};compressedBytes+=buffer.length;
 }
 const canonical=JSON.parse(fs.readFileSync('data/chapters.json','utf8')),missing=[];
 for(const [key,encoded]of Object.entries(canonical))for(const verse of JSON.parse(gunzipSync(Buffer.from(encoded,'base64'))).verses)if(!chapters[key]?.[verse.n])missing.push(key+':'+verse.n);
 const manifest={schema:1,edition:'Berean Standard Bible',source:'https://bereanbible.com/bsb_tables.tsv',sourceSha256:digest(bytes),sourceBytes:bytes.length,retrieved:'2026-11-13',license:'Public domain (publisher dedication, 2023-04-30)',licenseUrl:'https://berean.bible/terms.htm',sourceCommit:null,coverage:{...coverage,missing,compressedBytes},files};
 fs.writeFileSync('data/translation/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(manifest.coverage);
}



