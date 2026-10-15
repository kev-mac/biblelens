import zlib from 'node:zlib';
import MiniSearch from 'minisearch';
import {buildVocabulary,searchLicenses} from './search-vocabulary.mjs';
import {loadReferenceResources} from './reference-resources.mjs';
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
const references=loadReferenceResources();
const answerLayer=fs.readFileSync('worker/answer-layer.mjs','utf8').replace('/*__PEOPLE__*/[]',()=>JSON.stringify(references.people)).replace('/*__TOPICS__*/[]',()=>JSON.stringify(references.topics));
worker=worker.replace('/*__NETS_LINKS__*/',()=>fs.readFileSync('worker/nets-links.mjs','utf8')).replace('/*__ANSWER_LAYER__*/',()=>answerLayer);
for(const name of ['notices','provenance'])assets['/reference/'+name+'.json']={type:'application/json; charset=utf-8',body:JSON.stringify(references[name])};
for(const name of ['README.md','THEOGRAPHIC-LICENSE.txt','THEOGRAPHIC-SOURCES.md'])if(fs.existsSync('data/reference/'+name))assets['/reference/'+name]={type:'text/plain; charset=utf-8',body:fs.readFileSync('data/reference/'+name,'utf8')};
const searchIndex={},documents=[];for(const encoded of Object.values(JSON.parse(fs.readFileSync('data/chapters.json','utf8')))){const data=JSON.parse(zlib.gunzipSync(Buffer.from(encoded,'base64')));for(const verse of data.verses){const text=(verse.kjv+' '+verse.web).replace(/\{[HG]\d+\}/g,'');const words=new Set(text.toLowerCase().match(/[a-z]{3,}/g)||[]);const id=data.book*1000000+data.chapter*1000+verse.n;documents.push({id,text});for(const word of words)searchIndex[word]=(searchIndex[word]||0)+1;}}
const shards={};
for(const book of [...new Set(documents.map(d=>Math.floor(d.id/1000000)))]){
 const mini=new MiniSearch({fields:['text'],tokenize:text=>text.toLowerCase().match(/[a-z]{3,}/g)||[]});mini.addAll(documents.filter(d=>Math.floor(d.id/1000000)===book));shards[book]=JSON.stringify(mini);
}
const vocabulary=buildVocabulary(searchIndex);
const miniLibrary=fs.readFileSync('node_modules/minisearch/dist/es/index.js','utf8').replace('export { MiniSearch as default };','').replace(/\/\/# sourceMappingURL=.*$/m,'');
worker=worker.replace('/*__MINISEARCH_LIBRARY__*/',()=>miniLibrary).replace('/*__MINISEARCH_INDEX__*/{}',()=>JSON.stringify(shards)).replace('/*__VOCABULARY__*/{}',()=>JSON.stringify(vocabulary));
assets['/search-licenses.txt']={type:'text/plain; charset=utf-8',body:searchLicenses()};
console.log('Search vocabulary:',Object.keys(vocabulary).length,'entries; MiniSearch documents:',documents.length);
worker=worker.replace('/*__SEARCH__*/{}',()=>JSON.stringify(searchIndex));
// The mobile target uses the same API and corpus inside a device Web Worker.
// UI assets are separate files, so avoid duplicating them in worker memory.
export const mobileBundle={assets,engine:worker.replace('/*__STUDIES__*/[]',()=>JSON.stringify(context.studies)).replace('/*__ASSETS__*/{}','{}')};
worker=worker.replace('/*__STUDIES__*/[]',()=>JSON.stringify(context.studies)).replace('/*__ASSETS__*/{}',()=>JSON.stringify(assets));if(worker.includes('/*__'))throw Error('Unresolved build placeholder');fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist/server',{recursive:true});fs.mkdirSync('dist/.openai',{recursive:true});fs.writeFileSync('dist/server/index.js',worker);fs.copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');console.log('Built Worker:',Buffer.byteLength(worker),'bytes');

// Every build checks packaged retrieval and conversational responses without external requests.
await import('./check-chat-reliability.mjs');

await import('./check-search-vocabulary.mjs');

await import('./check-reference-answers.mjs');
await import('./check-chat-understanding.mjs');
