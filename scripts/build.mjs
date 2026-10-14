import zlib from 'node:zlib';
import {validateChapterNames} from './chapter-names.mjs';
import {validateWitnesses} from './witness-labels.mjs';
import {validateSides} from './verse-roles.mjs';
import fs from 'node:fs';import vm from 'node:vm';import path from 'node:path';
validateSides(JSON.parse(fs.readFileSync('data/evidence.json','utf8')),JSON.parse(fs.readFileSync('data/books.json','utf8')),JSON.parse(fs.readFileSync('data/chapters.json','utf8')));
validateWitnesses(JSON.parse(fs.readFileSync('data/evidence.json','utf8')),JSON.parse(fs.readFileSync('data/books.json','utf8')),JSON.parse(fs.readFileSync('data/chapters.json','utf8')));
const chapterNames=JSON.parse(fs.readFileSync('data/chapter-names.json','utf8'));
console.log('Validated chapter names:',validateChapterNames(chapterNames,JSON.parse(fs.readFileSync('data/books.json','utf8'))));
const evidenceRecords=JSON.parse(fs.readFileSync('data/evidence.json','utf8'));for(const record of evidenceRecords){if(!['history','contradictions','science','questions'].includes(record.mode))throw Error('Unsupported evidence mode: '+record.mode);if(record.mode==='questions'&&!(record.tags||[record.tag]).includes('Q'))throw Error('Questions record requires Q tag: '+record.id);}
const root=process.cwd();const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('src/data.js','utf8')+'\nthis.studies=ENTRIES;',context);
const assets={};for(const [name,type]of Object.entries({'index.html':'text/html; charset=utf-8','fonts.css':'text/css; charset=utf-8','style.css':'text/css; charset=utf-8','app.js':'application/javascript; charset=utf-8','data.js':'application/javascript; charset=utf-8','red-letters.js':'application/javascript; charset=utf-8','passage.js':'application/javascript; charset=utf-8','reader.js':'application/javascript; charset=utf-8','mobile.js':'application/javascript; charset=utf-8','citations.js':'application/javascript; charset=utf-8'})){assets[name==='index.html'?'/':'/'+name]={type,body:fs.readFileSync('src/'+name,'utf8')}}
assets['/reader.js'].body=assets['/reader.js'].body.replace('/*__CHAPTER_NAMES__*/{}',JSON.stringify(Object.fromEntries(Object.entries(chapterNames).filter(([key])=>!key.startsWith('_')))));
let worker=fs.readFileSync('worker/index.mjs','utf8');for(const [marker,file]of [['BOOKS','data/books.json'],['CHAPTERS','data/chapters.json'],['EVIDENCE','data/evidence.json']])worker=worker.replace(new RegExp('/\\*__'+marker+'__\\*/'+(['BOOKS','EVIDENCE'].includes(marker)?'\\[\\]':'\\{\\}')),fs.readFileSync(file,'utf8'));
const searchIndex={};for(const [key,encoded] of Object.entries(JSON.parse(fs.readFileSync('data/chapters.json','utf8')))){const data=JSON.parse(zlib.gunzipSync(Buffer.from(encoded,'base64')));for(const verse of data.verses){const counts={};for(const word of (verse.kjv+' '+verse.web).toLowerCase().match(/[a-z]{3,}/g)||[])counts[word]=(counts[word]||0)+1;const id=data.book*1000000+data.chapter*1000+verse.n;for(const [word,count] of Object.entries(counts))(searchIndex[word]||=[]).push([id,count]);}}
worker=worker.replace('/*__SEARCH__*/{}',JSON.stringify(searchIndex));
worker=worker.replace('/*__STUDIES__*/[]',JSON.stringify(context.studies)).replace('/*__ASSETS__*/{}',JSON.stringify(assets));if(worker.includes('/*__'))throw Error('Unresolved build placeholder');fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist/server',{recursive:true});fs.mkdirSync('dist/.openai',{recursive:true});fs.writeFileSync('dist/server/index.js',worker);fs.copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');console.log('Built Worker:',Buffer.byteLength(worker),'bytes');

// Every build checks retrieval and the rejection/retry paths without API charges.
await import('./check-chat-reliability.mjs');
