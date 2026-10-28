import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {copyLiterals} from './copy-literals.mjs';
import {b4Content,contentFiles,proseKeys} from './b4-neutral.mjs';
import {loadDraftDebates} from './draft-debates.mjs';
import {b2Catalog} from './b2-catalog.mjs';
import {neutralTree} from './b4-neutral.mjs';

export const banned = /\b(?:debunk\w*|disprov(?:e[sd]?|ing|en)|prov(?:e[sd]?|ing|en)|proof)\b|\bfor or against (?:any |a |the )?(?:faith|religion|belief)\b|\b(?:anti|pro)[- ](?:Christian|Jewish|Muslim|religion)\b|\b(?:debate|debunking) tool\b|\bnot (?:a |an )?(?:debate|debunking) (?:tool|app)\b/gi;
export const oldLabels = /\b(?:debates?|verdicts?|contradictions?)\b/gi;
const read=file=>fs.readFileSync(file,'utf8');
// Exact quotation spans and source-title fields are the only prose exemptions.
// Provenance, IDs, URLs, routes and stored enum values are not copy fields.
const allowlist=new Set(JSON.parse(read('research/b4/framing-allowlist.json')).entries.map(row=>row.text));
export function findings(text,{labels=false}={}){
 const copy=text.replace(/“[^”]*”|"[^"\n]*"/g,quote=>allowlist.has(quote)?'':quote);
 return [...copy.matchAll(labels?oldLabels:banned)].map(match=>match[0]);
}
export function framingAudit(){
 const violations=[],renames=[],exemptions=[];let checked=0;
 const check=(text,location,labels=true)=>{
  if(typeof text!=='string')return;checked++;
  for(const quote of text.match(/“[^”]*”|"[^"\n]*"/g)||[])exemptions.push({location,kind:'quotation',text:quote});
  for(const word of findings(text))violations.push({location,word});
  if(labels)for(const word of findings(text,{labels:true}))renames.push({location,word});
 };
 const walk=(value,location='',key='')=>{
  if(Array.isArray(value)){value.forEach((row,index)=>walk(row,location+'/'+index,key));return;}
  if(!value||typeof value!=='object'){if(proseKeys.has(key)||['case','draft'].includes(key))check(value,location);return;}
  for(const [name,row] of Object.entries(value)){
   if(name==='sources'){for(const source of row||[])if(source.label){exemptions.push({location:location+'/sources',kind:'source title',text:source.label});if(!allowlist.has(source.label)){for(const word of findings(source.label))violations.push({location:location+'/sources',word});}}continue;}
   if(['source','provenance','record_provenance','original','originals','quote_checks'].includes(name))continue;
   walk(row,location+'/'+name,name);
  }
 };
 for(const file of contentFiles)walk(JSON.parse(b4Content(file,{BIBLELENS_DRAFTS:'1'})),file);
 walk(loadDraftDebates(),'packaged/headlines');walk(neutralTree(b2Catalog()),'packaged/B2');
 for(const file of ['research/b4/wording-proposals.json','research/b4/reading-proposals.json'])walk(JSON.parse(read(file)),file);
 for(const file of ['research/b4/app-store-draft.md','research/b4/B1-decisions.md','research/b4/app-store-readiness-draft.md','research/b4/privacy-policy-draft.md'])check(read(file).replace(/\]\([^)]*\)/g,']').replace(/`[^`]+`/g,''),file);
 function files(directory){return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()&&!['vendor','assets','data','types'].includes(entry.name)?files(path.join(directory,entry.name)):entry.isFile()? [path.join(directory,entry.name)]:[]);}
 for(const file of [...files('src'),...files('worker')].filter(file=>/\.(?:js|mjs|tsx|html)$/.test(file)&&file!=='src/data.js')){
  const source=read(file);
  if(file.endsWith('.html')){
   const html=source.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'');
   for(const match of html.matchAll(/>([^<>]+)<|\b(?:aria-label|title|placeholder)="([^"]+)"/g))check(match[1]||match[2],file+':'+match.index);
  }else {
   if(file.endsWith('.tsx'))for(const match of source.matchAll(/>([^<>\n]+)<|(?:aria-label|title|placeholder)="([^"]+)"/g))check(match[1]||match[2],file+':jsx:'+match.index);
   for(const literal of copyLiterals(source)){
   const text=literal.text;
   // Technical literals have no prose whitespace. Capitalized labels are copy.
   if(!/\s/.test(text)&&!/^(?:Debates?|Verdicts?|Contradictions?)$/.test(text))continue;
   const clean=text.replace(/<[^>]*>/g,' ').replace(/#(?:debates?|[^\s'"<>]*)/g,'').replace(/\b(?:data|phase\d)-[a-z-]+/g,'');
   check(clean,file+':'+(source.slice(0,literal.start).match(/\n/g)||[]).length,false);
   // Scan visible text/attributes separately; code names are intentionally retained.
   for(const match of text.matchAll(/>([^<>]+)<|(?:aria-label|title|placeholder)="([^"]+)"/g))check(match[1]||match[2],file+':copy:'+literal.start);
   if(/^(?:Debates?|Verdicts?|Contradictions?)$/.test(text))check(text,file+':label:'+literal.start);
  }}
 }
 return {checked,violations,renames,exemptions};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const result=framingAudit();const summary={checked:result.checked,violations:result.violations,renames:result.renames,quotationAndSourceTitleFields:result.exemptions.length,allowlistEntries:allowlist.size};fs.writeFileSync('research/b4/framing-check.json',JSON.stringify(summary,null,2)+'\n');
 console.log(`Checked ${result.checked} copy fields; ${result.violations.length} banned framing hits; ${result.renames.length} old-label hits; ${result.exemptions.length} quotation/source-title exemptions.`);
 for(const hit of [...result.violations,...result.renames].slice(0,40))console.error(hit.location+': '+hit.word);
 if(result.violations.length||result.renames.length)process.exitCode=1;
}
