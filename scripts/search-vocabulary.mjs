import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import lemmatize from 'wink-lemmatizer';
import wordnet from 'wordnet-db';

const require=createRequire(import.meta.url);
const valid=w=>/^[a-z]{3,}$/.test(w);
const lemmas=w=>[...new Set([w,lemmatize.noun(w),lemmatize.verb(w),lemmatize.adjective(w)])].filter(valid);

// Build-time only: ship bounded, single-hop synonyms that reach indexed words.
// Keep senses separate in WordNet; do not traverse related-concept links.
export function buildVocabulary(index){
 const forms=new Map(),synonyms=new Map(),knownWords=new Set();
 for(const word of Object.keys(index))for(const lemma of lemmas(word)){
  if(!forms.has(lemma))forms.set(lemma,new Set());forms.get(lemma).add(word);
 }
 for(const part of ['noun','verb','adj','adv']){
 const firstSenses=new Map();
 for(const line of fs.readFileSync(path.join(wordnet.path,'index.'+part),'utf8').split('\n')){
  if(!/^[a-z]/.test(line))continue;
  const fields=line.trim().split(/\s+/);firstSenses.set(fields[0],fields[6+Number(fields[3])]);if(valid(fields[0]))knownWords.add(fields[0]);
 }
 for(const line of fs.readFileSync(path.join(wordnet.path,'data.'+part),'utf8').split('\n')){
  if(!/^\d/.test(line))continue;
  const fields=line.split('|')[0].trim().split(/\s+/),count=parseInt(fields[3],16);
  const words=Array.from({length:count},(_,i)=>fields[4+i*2].replace(/\([a-z]+\)$/,'')).filter(valid);
  const targets=[...new Set(words.flatMap(w=>[...(forms.get(w)||[])]))];
  if(!targets.length)continue;
  for(const word of words){if(firstSenses.get(word)!==fields[0])continue;if(!synonyms.has(word))synonyms.set(word,new Set());for(const target of targets)if(target!==word)synonyms.get(word).add(target);}
 }
 }
 // Include irregular query forms without bundling the lemmatizer's full lexicon.
 const queryWords=new Set([...forms.keys(),...synonyms.keys(),...knownWords]);
 for(const part of ['noun','verb','adjective'])for(const word of Object.keys(require('wink-lexicon/src/wn-'+part+'-exceptions.js')))if(valid(word))queryWords.add(word);
 const vocabulary={};
 for(const word of [...queryWords].sort()){
  const bases=lemmas(word),morphology=[...new Set(bases.flatMap(w=>[...(forms.get(w)||[])]))].filter(w=>w!==word).sort();
  const related=[...new Set(bases.flatMap(w=>[...(synonyms.get(w)||[])]))].filter(w=>w!==word&&!morphology.includes(w)).sort((a,b)=>index[a]-index[b]||a.localeCompare(b)).slice(0,8);
  if(morphology.length||related.length||knownWords.has(word))vocabulary[word]={forms:morphology.slice(0,16),related};
 }
 return vocabulary;
}

export function searchLicenses(){
 const packages=['wink-lemmatizer','wink-lexicon','wink-porter2-stemmer','minisearch','wordnet-db'];
 const notices=packages.map(name=>{
  let dir=path.dirname(require.resolve(name));while(!fs.existsSync(path.join(dir,'package.json')))dir=path.dirname(dir);
  const file=['LICENSE','LICENSE.txt','LICENSE.md','LICENSE.txt.md'].find(f=>fs.existsSync(path.join(dir,f)));
  if(!file)throw Error('Missing license: '+name);
  return name+'\n'+fs.readFileSync(path.join(dir,file),'utf8');
 });
 notices.push('WordNet 3.1 database notice\n'+fs.readFileSync(path.join(wordnet.path,'data.noun'),'utf8').split('\n').filter(line=>/^\s/.test(line)).join('\n'));
 return notices.join('\n\n========================================\n\n');
}
