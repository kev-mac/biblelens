import fs from 'node:fs';
import assert from 'node:assert/strict';
// Scores recorded hosted retrieval. Expected targets stay local and are never
// part of a provider prompt. This measures candidates, not generated answers.
const [beforePath,afterPath,outPath,localAfterPath=beforePath]=process.argv.slice(2);
if(!beforePath||!afterPath||!outPath)throw Error('Usage: node scripts/score-semantic-retrieval.mjs <baseline.json> <hosted-results.json> <report.json> [local-after.json]');
const before=JSON.parse(fs.readFileSync(beforePath,'utf8')),after=JSON.parse(fs.readFileSync(afterPath,'utf8')),suite=JSON.parse(fs.readFileSync('docs/search-tests.json','utf8'));
assert.equal(after.mode,'real-hosted-planner','Do not present mock plans as a live semantic evaluation');
const localAfter=JSON.parse(fs.readFileSync(localAfterPath,'utf8'));
const books=JSON.parse(fs.readFileSync('data/books.json','utf8'));
function candidates(sources){
 return sources.flatMap((source,index)=>{
  const rows=[],rank=index+1,match=/^#read\/(\d+)\/(\d+)\/(\d+)(?:-(\d+))?$/.exec(source.url||'');
  if(match){const [,book,ch,start,end]=match;for(let n=+start;n<=Math.min(+(end||start),+start+5);n++)rows.push({kind:'verse',id:books[+book].name+' '+ch+':'+n,rank});}
  if(source.recordId)rows.push({kind:source.recordKind==='study'?'study':'record',id:source.recordId,rank});
  if(source.url?.startsWith('#study/'))rows.push({kind:'study',id:source.url.slice(7),rank});
  if(source.url?.startsWith('#stories/'))rows.push({kind:'story',id:source.url,rank});
  if(source.url?.startsWith('#characters/'))rows.push({kind:'person',id:source.url.slice(12),rank});
  return rows;
 });
}
const cases=suite.cases.map(test=>{
 const old=before.cases.find(row=>row.id===test.id),local=localAfter.cases.find(row=>row.id===test.id),recorded=after.results.find(row=>row.id===test.id);
 assert(old,'Missing baseline '+test.id);assert(recorded,'Missing hosted case '+test.id);assert.equal(recorded.query,test.query,'Query changed');assert.equal(typeof recorded.status,'string','Missing hosted status');
 const added=candidates(recorded.status==='ready'?recorded.appResults||[]:[]),keys=new Set(),combined=[...added,...local.results.map(row=>({...row,rank:(recorded.appResults?.length||0)+(row.visibleRank??row.rank)}))].filter(row=>{const key=row.kind+':'+row.id;if(keys.has(key))return false;keys.add(key);return true;});
 const find=target=>combined.find(row=>row.kind===target.kind&&row.id===target.id),hits=test.expected.filter(find),useful=[...test.expected,...test.acceptableAlternatives].map(find).filter(Boolean);
 return {id:test.id,query:test.query,category:test.category,retrievalStatus:recorded.status,baselineFound:old.found,baselineExpectedFound:old.expectedFound,semanticExpectedFound:test.expected.filter(target=>added.some(row=>row.kind===target.kind&&row.id===target.id)).length,semanticUsefulHit:[...test.expected,...test.acceptableAlternatives].some(target=>added.some(row=>row.kind===target.kind&&row.id===target.id)),expectedFound:hits.length,expectedTotal:test.expected.length,found:!!useful.length,firstGoodCardRank:useful.length?Math.min(...useful.map(row=>row.rank)):null,newExpected:test.expected.filter(target=>find(target)&&!old.results.some(row=>row.kind===target.kind&&row.id===target.id)).map(({kind,id})=>({kind,id})),sources:(recorded.appResults||[]).map(({label,url})=>({label,url})),usage:recorded.usage};
});
const summary=rows=>({queries:rows.length,successfulRetrievals:rows.filter(row=>row.retrievalStatus==='ready').length,semanticUsefulHits:rows.filter(row=>row.semanticUsefulHit).length,semanticExpectedFound:rows.reduce((sum,row)=>sum+row.semanticExpectedFound,0),usefulHits:rows.filter(row=>row.found).length,expectedFound:rows.reduce((sum,row)=>sum+row.expectedFound,0),expectedTotal:rows.reduce((sum,row)=>sum+row.expectedTotal,0),usefulInFirstFiveCards:rows.filter(row=>row.firstGoodCardRank!==null&&row.firstGoodCardRank<=5).length});
const report={scope:'Recorded hosted retrieval candidates plus the measured local renderer results; not final-answer accuracy. Eight semantic cards are added, so this is not a constant-budget ranking comparison.',baseline:before.summary,localAfter:localAfter.summary,after:summary(cases),byCategory:Object.fromEntries([...new Set(cases.map(row=>row.category))].map(category=>[category,summary(cases.filter(row=>row.category===category))])),usage:cases.reduce((sum,row)=>({inputTokens:sum.inputTokens+(row.usage?.inputTokens||0),outputTokens:sum.outputTokens+(row.usage?.outputTokens||0),webCalls:sum.webCalls+(row.usage?.webCalls||0)}),{inputTokens:0,outputTokens:0,webCalls:0}),cases};
fs.writeFileSync(outPath,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({baseline:report.baseline,after:report.after,usage:report.usage},null,2));
