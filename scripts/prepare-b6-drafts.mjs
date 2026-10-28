import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {assess,words} from './check-readability.mjs';
import {b2Catalog} from './b2-catalog.mjs';
import {sentenceCase} from './b6-drafts.mjs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),write=(name,value)=>fs.writeFileSync('research/b6/'+name,JSON.stringify(value,null,2)+'\n');
const hash=x=>createHash('sha256').update(x).digest('hex');
const sentences=text=>[...new Intl.Segmenter('en',{granularity:'sentence'}).segment(text||'')].map(x=>x.segment.trim()).filter(Boolean);
const failing=(text,tier)=>{const x=assess(text,{tier});return x.tooLong||x.unexplained;};
const sameTokens=(a,b)=>JSON.stringify(a.match(/“[^”]*”|"[^"\n]*"|\d+/g)||[])===JSON.stringify(b.match(/“[^”]*”|"[^"\n]*"|\d+/g)||[]);
const substitutions=[
 [/Brenton['’]s (?:own )?Greek/g,'the old Greek translation'],
 [/Brenton['’]s (?:own )?English/g,'the English version of the old Greek translation'],
 [/Brenton Greek/g,'the old Greek translation'],
 [/Brenton English/g,'the English version of the old Greek translation'],
 [/\bSeptuagint\b/g,'old Greek translation'],
 [/\bWLC\b/g,'Hebrew text'],
 [/\bMasoretic text\b/gi,'Hebrew text'],
 [/\bmanuscripts\b/g,'ancient copies'],[/\bmanuscript\b/g,'ancient copy'],
];
const changes=[],meaning=[],outstanding=[],records=[];
const acceptedSources=new Map(read('data/evidence.json').map(row=>[row.id,row]));
for(const sourceRow of read('docs/b1-readability/evidence.json')){
 const context=acceptedSources.get(sourceRow.id).languageContext;
 const row={...sourceRow,original:{...(sourceRow.title?{title:sourceRow.title}:{}),...sourceRow.original,...(typeof context==='string'?{languageContext:context}:{})}};
 const draft={...row.original},appliedRules=[];
 for(const [field,original] of Object.entries(row.original)){
  const tier=['title','summary'].includes(field)?'visible':'detail';
  if(row.meaningHolds?.[field]){meaning.push({id:row.id,field,tier,original,reason:row.meaningHolds[field]});continue;}
  if(!failing(original,tier))continue;
  let candidate=typeof row.draft[field]==='string'&&sameTokens(original,row.draft[field])?row.draft[field]:original;
  // Fixed terminology pairs apply only outside quotes; original and source editions remain beside each proposal.
  candidate=candidate.split(/(“[^”]*”|"[^"\n]*")/g).map((part,i)=>i%2?part:substitutions.reduce((text,[from,to])=>text.replace(from,to),part)).join('');
  const names=['Tischendorf','Textus Receptus'].filter(name=>assess(candidate,{tier}).counts.some(item=>item.term===name&&item.unexplained));
  if(names.length)candidate=(names.length===2?'The Greek editions here are Tischendorf’s text and the Textus Receptus. ':names[0]==='Tischendorf'?'Tischendorf’s Greek edition is used here. ':'Textus Receptus names the Greek text used here. ')+candidate;
  if(candidate!==original){
   if(!sameTokens(original,candidate))throw Error('Protected tokens changed '+row.id+':'+field);
   draft[field]=candidate;changes.push({id:row.id,field,tier,original,draft:candidate,meaningCheck:'Retain attribution, negation, numbers, quoted wording, conditions and edition limits. Edition names remain in Sources. Draft requires meaning review.'});
   appliedRules.push({field,rule:'B6 exact field proposal'});
  }
  if(failing(draft[field],tier))outstanding.push({id:row.id,field,tier,reason:'Sentence length or first-use jargon still needs individual editorial review.'});
 }
 records.push({...row,draft,appliedRules,flags:outstanding.filter(x=>x.id===row.id).map(x=>x.field+': '+x.reason)});
}
write('evidence.json',{draft_only:true,reviewStatus:'draft, unverified',sourceHash:hash(fs.readFileSync('data/evidence.json')),records});
write('evidence-field-proposals.json',changes);write('outstanding-evidence.json',outstanding);
write('meaning-checks.json',meaning);
fs.writeFileSync('research/b6/meaning-checks.md',['# B6 meaning checks','','Drafts remain unpublished. Ambiguous fields retain their original wording.','','| ID | Field | Tier | Reason |','| --- | --- | --- | --- |',...meaning.map(r=>`| ${r.id} | ${r.field} | ${r.tier} | ${r.reason.replaceAll('|','/')} |`),''].join('\n'));
// The queue identifies which comparisons lack an individual paired-reading proposal.
const evidence=new Map(read('data/evidence.json').map(r=>[r.id,r]));
const pending=read('research/b4/comparison-review-queue.json').records.filter(r=>!r.questionPreview);
const readings=pending.map(q=>{
 const r=evidence.get(q.id);if(!r)throw Error('Missing comparison '+q.id);
 const sources=r.sources||[];
 // Exact, short sentences from existing research support a textual reading without creating a new claim.
 const first=sentences(r.summary)[0];
 const stated=first&&words(first).length<=30&&!assess(first,{tier:'detail'}).unexplained?[first]:[];
 const alternative=sentences(r.alternativeReading||r.scope).filter(s=>words(s).length<=30&&!assess(s,{tier:'detail'}).unexplained&&/both (?:can|could|may)|(?:can|could|may) (?:both|fit|refer|describe)|another (?:reading|interpretation)|literary (?:reading|arrangement)|complementary|not mutually exclusive/i.test(s));
 // A scope caveat alone is not a sourced alternative interpretation. Keep that slot open.
 const slots=[{label:'Reading the stated claims',...(stated.length&&sources.length?{summary:stated.join(' ').length<=260?stated.join(' '):stated[0],sourceField:'summary',sourceText:r.summary,status:'draft excerpt; meaning review required'}:{status:'needs research',reason:'No short self-contained reading has been verified from the supplied summary.'})},
 {label:'Another reading',...(alternative.length&&sources.length?{summary:alternative[0],sourceField:r.alternativeReading?'alternativeReading':'scope',sourceText:r.alternativeReading||r.scope,status:'draft excerpt; meaning review required'}:{status:'needs research',reason:'No short, self-contained alternative has been verified from the supplied source fields. Research must assess support before adding a reading.'})}];
 return {id:r.id,title:r.title||r.ref,reviewStatus:'draft',sourceHash:hash(JSON.stringify(r)),readings:slots,sources,limits:r.scope||'',attributionReview:'Sources are inherited from this record. Excerpts do not assign a reading to a faith tradition.'};
});
if(readings.length!==1693)throw Error('Pending count '+readings.length);
write('comparison-readings.json',{draft_only:true,ownerAccepted:false,records:readings});
const styles=[];
for(const [collection,rows]of Object.entries(b2Catalog().collections))for(const row of rows){
 const draft={};for(const key of ['title','display_title'])if(row.record[key]){let title=sentenceCase(row.record[key]);if(row.id==='stories:mark-calling-the-disciples-and-healing-in-capernaum')title='Calling the disciples and healings';if(title!==row.record[key])draft[key]=title;}
 if(row.id==='nebuchadnezzar')for(const [key,text]of Object.entries(row.record))if(typeof text==='string'&&text.includes("Daniel's father language about Belshazzar"))draft[key]=text.replace("Daniel's father language about Belshazzar does not establish a biological link here.","Daniel calls Nebuchadnezzar Belshazzar's father. This wording does not establish a biological link here.");
 if(Object.keys(draft).length)styles.push({collection,id:row.id,reviewStatus:'draft',original:Object.fromEntries(Object.keys(draft).map(k=>[k,row.record[k]])),draft});
}
write('style-proposals.json',styles);
write('counts.json',{fieldsRewrittenByTier:{visible:changes.filter(x=>x.tier==='visible').length,detail:changes.filter(x=>x.tier==='detail').length},meaningChecks:meaning.length,outstandingFields:outstanding.length,pendingComparisons:readings.length,readingsSupplied:readings.flatMap(r=>r.readings).filter(r=>r.summary).length,needsResearch:readings.flatMap(r=>r.readings).filter(r=>r.status==='needs research').length,styleRecords:styles.length});
