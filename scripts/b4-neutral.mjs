import {createHash} from 'node:crypto';
import fs from 'node:fs';

// Quoted text and source titles are never rewritten. Accepted files stay intact.
export const proseKeys = new Set(['title','display_title','question','summary','intro','context','reasoning','scope','assessment','text','label','description','copy','blurb','name','reference_note','summary_60_seconds','what_would_settle_it','why_selected','status_note','reason','notes','limits','languageContext','alternativeReading','response','claim','translation','branch','note','disposition','recommendedDefault','meaningChecks','attributionReview']);
export function neutralProse(value) {
 const parts=value.split(/(“[^”]*”|"[^"\n]*")/g);
 return parts.map((part,index)=>index%2?part:part
  .replace(/Real conflict/g,'Wording differs').replace(/Can be reconciled/g,'Readings can fit together').replace(/Different detail/g,'Details differ').replace(/Open question/g,'Interpretation remains open').replace(/not a debate/g,'Instruction in context').replace(/Evidence agrees/g,'Evidence matches the text').replace(/Evidence disagrees/g,'Conflicts with evidence')
  .replace(/\bdebates\b/gi,'Contradictions').replace(/\bdebate\b/gi,'Contradiction')
  .replace(/\bverdicts?\b/gi,'what the evidence shows')
  .replace(/\bdisproving\b/gi,'ruling out').replace(/\bdisproved\b/gi,'ruled out')
  .replace(/\bproved\b/gi,'established').replace(/\bproving\b/gi,'establishing')
  .replace(/\bdisproves\b/gi,'rules out').replace(/\bdisprove\b/gi,'rule out').replace(/\bdisproven\b/gi,'ruled out')
  .replace(/\bproves\b/gi,'establishes').replace(/\bprove\b/gi,'establish').replace(/\bproven\b/gi,'established').replace(/\bproof\b/gi,'evidence')
  .replace(/\bdebunk(?:s|ed|ing)?\b/gi,'assess')
  .replace(/tested evidence for or against life after death/g,'tested evidence about life after death')
 ).join('');
}
export function neutralTree(input, path=[], changes=[]) {
 if(Array.isArray(input))return input.map((value,index)=>typeof value==='string'&&['case','notes','meaningChecks'].includes(path.at(-1))?neutralProse(value):neutralTree(value,[...path,index],changes));
 if(!input||typeof input!=='object')return input;
 const output={...input};
 for(const [key,value] of Object.entries(input)) {
  // Identity, original text, source objects and quotation checks are immutable.
  if(['sources','source','record_provenance','provenance','quote_checks','original','originals','acceptedDigest'].includes(key))continue;
  if(typeof value==='string'&&proseKeys.has(key)){
   const proposal=neutralProse(value);if(proposal!==value){output[key]=proposal;changes.push({path:[...path,key],draft:proposal});}
  }else if(value&&typeof value==='object')output[key]=neutralTree(value,[...path,key],changes);
 }
 return output;
}
export const contentFiles=['data/evidence.json','data/stories.json','src/data/characters.json','data/timeline-events.json','src/data/prophecies.json'];
export function b4Content(file,env=process.env){
 const text=fs.readFileSync(file,'utf8');
 if(env.BIBLELENS_DRAFTS!=='1'||!contentFiles.includes(file))return text;
 const staged=JSON.parse(fs.readFileSync('research/b4/wording-proposals.json','utf8'));
 if(staged.sourceHashes[file]!==createHash('sha256').update(text).digest('hex'))throw Error('B4 source needs review: '+file);
 const changes=[],draft=neutralTree(JSON.parse(text),[],changes);
 if(JSON.stringify(changes)!==JSON.stringify(staged.collections[file]))throw Error('B4 wording proposals need review: '+file);
 return JSON.stringify(draft);
}
export function b4Proposals(){
 return {draft_only:true,reviewStatus:'draft',ownerAccepted:false,baseline:'c612c17',sourceHashes:Object.fromEntries(contentFiles.map(file=>[file,createHash('sha256').update(fs.readFileSync(file)).digest('hex')])),collections:Object.fromEntries(contentFiles.map(file=>{
  const changes=[];neutralTree(JSON.parse(fs.readFileSync(file,'utf8')),[],changes);
  return [file,changes];
 }))};
}
if(process.argv.includes('--write'))fs.writeFileSync('research/b4/wording-proposals.json',JSON.stringify(b4Proposals(),null,2)+'\n');
