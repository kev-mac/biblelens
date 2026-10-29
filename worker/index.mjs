/*__SEARCH_CORE__*/
const BOOKS=/*__BOOKS__*/[];
const CHAPTERS=/*__CHAPTERS__*/{};
const STUDIES=/*__STUDIES__*/[];
const EVIDENCE=/*__EVIDENCE__*/[];
const ACCEPTED_QUESTIONS=/*__ACCEPTED_QUESTIONS__*/[];
const ASSETS=/*__ASSETS__*/{};
const SEARCH=/*__SEARCH__*/{};
/*__MINISEARCH_LIBRARY__*/
const MINI_INDEX=/*__MINISEARCH_INDEX__*/{};
const VOCABULARY=/*__VOCABULARY__*/{};
const passageSearch=new Map();
function searchEngine(){return {
 search(query,options={}){return this.searchMany([query],options)[0];},
 searchMany(queries,options={}){
  const results=queries.map(()=>[]);
  // Load each book once per query, while retaining only two decoded shards.
  for(const [book,serialized]of Object.entries(MINI_INDEX)){
   if(options.bookScope?.size&&!options.bookScope.has(Number(book)))continue;
   let engine=passageSearch.get(book);
   if(!engine){engine=MiniSearch.loadJSON(serialized,{fields:['text'],tokenize:text=>text.toLowerCase().match(/[a-z]{3,}/g)||[]});if(passageSearch.size>=2)passageSearch.delete(passageSearch.keys().next().value);passageSearch.set(book,engine);}
   queries.forEach((query,index)=>results[index].push(...engine.search(query,options)));
  }
  return results.map(rows=>rows.sort((a,b)=>b.score-a.score));
 }
};}
const chapterCache=new Map();
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
async function chapter(book,ch){const key=`${book}:${ch}`;if(chapterCache.has(key))return chapterCache.get(key);if(!CHAPTERS[key])return null;const bytes=Uint8Array.from(atob(CHAPTERS[key]),c=>c.charCodeAt(0));const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));const value=await new Response(stream).json();if(chapterCache.size>20)chapterCache.delete(chapterCache.keys().next().value);chapterCache.set(key,value);return value;}
function parseRef(ref){const m=/^(.*?) (\d+):(\d+)/.exec(ref);if(!m)return null;const b=BOOKS.find(b=>b.name===m[1]);return b?{book:b.id,chapter:+m[2],verse:+m[3]}:null;}
function rankStudies(message,book,ch){const words=message.toLowerCase().match(/[a-z0-9]{3,}/g)||[];return STUDIES.map(e=>{const text=JSON.stringify([e.title,e.topic,e.refs,e.claim,e.response,e.assessment]).toLowerCase();const relevance=words.filter(w=>!['the','how','what','does','this','that','with','about','and','are','can'].includes(w)&&text.includes(w)).length;const same=e.refs.some(r=>{const p=parseRef(r);return p&&p.book===book&&p.chapter===ch});return {e,score:relevance+(same?6:0)}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.e);}
const SEARCH_VARIANTS=[['interest','usury','usurer','usurers'],['loan','loans','lend','lends','lending','lent'],['kill','kills','killed','killing','slew','slay','slain','slaying','smite','smites','smiting','smote','struck','death'],['die','dies','died','dying','death','dead'],['fear','fears','feared','fearing','fearful','afraid','terror','dread'],['beat','beats','beating','beaten','smite','smites','smiting','smote','struck'],['slave','slaves','servant','servants','bondman','bondmen','bondage'],['fly','flies'],['marry','married','marriage','wife','husband'],['create','created','creation','made','form','formed'],['child','children'],['wrote','write','written'],['rise','rose','risen','resurrection']];
const readingEdition=value=>['kjv','web','asv'].includes(String(value||'').toLowerCase())?String(value).toLowerCase():'kjv';
const scriptureText=(verse,edition='kjv')=>cleanExcerpt(verse?.[readingEdition(edition)]||'');
const scriptureKind=edition=>'Primary scripture text · '+readingEdition(edition).toUpperCase();
function canonicalBookNames(message){return BibleLensSearch.canonicalBooks(message,BOOKS);}
function namedBooks(message){
 const canonical=canonicalBookNames(message),found=[];let remaining=canonical;
 for(const book of [...BOOKS].sort((a,b)=>b.name.length-a.name.length)){const pattern=new RegExp('\\b'+book.name+'\\b','gi');if(pattern.test(remaining)){found.push(book);remaining=remaining.replace(pattern,' ');}}
 return found;
}
const termCache=new Map();
const searchWordFamilies=[['forgiveness','forgive','forgiven','forgives','forgiving','forgave']];
const tunedVariants=[...searchWordFamilies,['anxiety','anxious','worry','worried','care','careful'],['slave','slaves','slavery','servitude','servant','servants','bondman','bondmen','bondage'],['tomb','tombs','sepulchre','sepulchres'],['story','stories','account','accounts','narrative','narratives']];
const correctionWords=()=>Object.keys(SEARCH);
function spellingCorrections(word){
 const limit=BibleLensSearch.tolerance(word);
 if(!limit||word.length>24)return [];
 const candidates=correctionWords().map(term=>({term,d:BibleLensSearch.distance(word,term,limit)})).filter(row=>row.d<=limit).sort((a,b)=>a.d-b.d||SEARCH[b.term]-SEARCH[a.term]||a.term.localeCompare(b.term));
 return candidates.filter(row=>row.d===candidates[0]?.d).slice(0,2).map(row=>row.term);
}
function questionTerms(message,tuned=false){
 const cacheKey=String(tuned)+':'+message;if(termCache.has(cacheKey))return termCache.get(cacheKey);
 const stop=new Set('the and who whom whose what was were where when which how why does did didnt can could would should this that these those about bible biblical chapter verse tell explain give please have has had are not his her him its their them you your anyone anybody someone somebody person people according say says said also from into with for all any ever much allowed okay more else then'.split(' '));
 if(tuned)for(const word of ['there','allow','find'])stop.add(word);
 const scoped=namedBooks(message);let query=canonicalBookNames(message);if(tuned)query=BibleLensSearch.normalize(query);for(const book of scoped)query=query.replace(new RegExp(book.name,'gi'),' ');
 if(/\b(interest|usury|loans?|lend|lending|borrow)\b/i.test(query))query=query.replace(/\b(charge|charging|rate|rates)\b/gi,' ');
 const words=[...new Set(query.toLowerCase().match(/[a-z]{3,}/g)||[])].filter(w=>!stop.has(w)).slice(0,24);let correctionBudget=2;
 const groups=words.map(word=>{
  const manual=(tuned?tunedVariants:[]).find(g=>g.includes(word))||SEARCH_VARIANTS.find(g=>g.includes(word)),entry=VOCABULARY[word];
  const primary=manual||[word,...(entry?.forms||[])];
  const group=[...new Set([...primary,...(manual?[]:entry?.related||[])])];
  if(!entry&&!group.some(w=>SEARCH[w])&&word.length>=5&&word.length<=24&&correctionBudget-->0){
   const corrections=spellingCorrections(word);
   group.push(...corrections);
   if(tuned)for(const corrected of corrections)group.push(...(tunedVariants.find(g=>g.includes(corrected))||VOCABULARY[corrected]?.forms||[]));
  }
  group.primary=primary;group.original=word;group.exact=[word,...(entry?.forms||[]),...(tuned?searchWordFamilies.find(family=>family.includes(word))||[]:[]),...(!entry?group.filter(w=>SEARCH[w]):[])];return group;
 }).filter((g,i,a)=>a.findIndex(other=>other[0]===g[0])===i);
 const result=groups.length?groups:scoped.map(b=>[b.name.toLowerCase()]);
 if(termCache.size>=64)termCache.delete(termCache.keys().next().value);termCache.set(cacheKey,result);return result;
}
function foodTopic(message){
 if(aquaticFoodQuestion(message))return 'fins scales';
 if(/\b(eat|eating|eaten|food|diet|dietary)\b/i.test(message)&&/\b(skunk|skunks|pork|pig|pigs|swine|bacon|ham|rabbit|rabbits|hare|hares)\b/i.test(message))return 'eat unclean';
 return '';
}
function retrievalQuery(message){
 const scope=namedBooks(message).map(b=>b.name),topic=foodTopic(message);
 if(topic)return [topic,...scope].join(' ');
 if(/\b(fourth|4th)\b/i.test(message)&&/\bplagues?\b/i.test(message))return ['flies',...scope].join(' ');
 return /plagues?/i.test(message)?message.replace(/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|\d+(?:st|nd|rd|th)?)\b/gi,''):message;
}
function groupMatches(group,text){return group.some(word=>new RegExp('\\b'+word+'\\b','i').test(text));}
function enoughMatches(groups,text){
 if(!groups.length)return false;
 // Unknown words still withhold results, rather than matching an unrelated common word.
 if(groups.some(g=>!g.some(w=>SEARCH[w])))return false;
 const count=groups.filter(g=>groupMatches(g,text)).length;
 return count>=Math.max(1,Math.ceil(groups.length*.6));
}
function aquaticFoodQuestion(message){
 const seafood=/\b(shrimps?|prawns?|shellfish|crustaceans?|lobsters?|crabs?|oysters?|clams?|mussels?|scallops?|seafood)\b/i.test(message);
 const fish=/\b(sharks?|salmon|tuna|catfish|eels?|swordfish|tilapia|trout|cod|haddock|fish|octopus|squid)\b/i.test(message);
 return seafood||fish&&/\b(eat|eating|eaten|food|diet|dietary|kosher|clean|unclean|permitted|forbidden|allowed)\b/i.test(message);
}
const verseParts=id=>({book:Math.floor(id/1000000),chapter:Math.floor(id%1000000/1000),verse:id%1000});
function pinnedChapters(message){const keys=queryReferences(message).filter(ref=>CHAPTERS[ref.book+':'+ref.chapter]).map(ref=>ref.book+':'+ref.chapter);
 if(/\b(adam|eve|mankind|humanity|humans?|man|woman|people)\b/i.test(message)&&/\b(creat\w*|form\w*|made|sixth|day)\b/i.test(message))keys.push('0:1','0:2');
 if(aquaticFoodQuestion(message))keys.push('2:11','4:14','40:7','43:10','44:14');
 if(/plagues?/i.test(message))keys.push(...[7,8,9,10,11,12].map(ch=>'1:'+ch));return [...new Set(keys)];}
function searchPassages(message,broad=false,tuned=false){
 const query=retrievalQuery(message),scope=new Set(namedBooks(query).map(b=>b.id)),groups=questionTerms(query,tuned),scores=new Map(),matched=new Map();
 if(!groups.length||groups.some(g=>!g.some(w=>SEARCH[w])))return [];
 const batches=searchEngine().searchMany(groups.map(group=>group.join(' ')),{combineWith:'OR',bookScope:scope,filter:r=>!scope.size||scope.has(verseParts(r.id).book)});
 const anchors=groups.map((g,i)=>!VOCABULARY[g.original]?.forms.length&&!VOCABULARY[g.original]?.related.length&&SEARCH[g.original]&&SEARCH[g.original]<100?i:-1).filter(i=>i>=0).slice(0,1);
 for(const [index,group]of groups.entries()){
  const centers=new Map();
  const results=batches[index];
  for(const result of results){const id=Number(result.id);const exact=Object.keys(result.match).some(w=>(group.primary||group).includes(w));const weight=result.score*(exact?1:.3);
   for(let offset=-2;offset<=2;offset++){const center=id+offset,p=verseParts(center);if(p.verse<1||p.verse>199||p.chapter!==verseParts(id).chapter||p.book!==verseParts(id).book)continue;
    const proximity=offset===0?1:.55;centers.set(center,Math.max(centers.get(center)||0,Math.min(5,Math.log1p(weight))*proximity));
   }
  }
  for(const [center,score]of centers){scores.set(center,(scores.get(center)||0)+score);if(!matched.has(center))matched.set(center,new Set());matched.get(center).add(index);}
 }
 for(const [id,terms]of matched)scores.set(id,scores.get(id)+terms.size*8+(terms.size===groups.length?16:0));
 const picked=[];for(const [id]of [...scores].sort((a,b)=>b[1]-a[1]||a[0]-b[0])){const p=verseParts(id);if(anchors.some(i=>!matched.get(id)?.has(i))||!CHAPTERS[p.book+':'+p.chapter]||picked.some(o=>o.book===p.book&&o.chapter===p.chapter&&Math.abs(o.verse-p.verse)<=4))continue;picked.push(p);if(picked.length===(broad?24:12))break;}return picked;
}
function searchChapters(message){return [...new Set([...pinnedChapters(message),...searchPassages(message).map(p=>`${p.book}:${p.chapter}`)])].slice(0,12);}
async function gatherSources(message,book,ch,selected,previousQuestion='',broad=false,edition='kjv'){const sources=[];function add(label,text,url,kind,metadata={}){const existing=sources.find(s=>s.url===url&&s.text===text);if(existing)return existing.id;const id=sources.length+1;sources.push({id,label,text,url,kind,...metadata});return id;}
 const pinned=pinnedChapters(message);if((selected.length||/this chapter|these verses|this verse/i.test(message))&&CHAPTERS[book+':'+ch])pinned.unshift(book+':'+ch);
 const windows=new Map();for(const key of pinned)windows.set(key,null);
 for(const p of [...(previousQuestion?searchPassages(previousQuestion,broad):[]),...searchPassages(message,broad)]){const key=`${p.book}:${p.chapter}`;if(windows.has(key)&&windows.get(key)===null)continue;if(!windows.has(key))windows.set(key,new Set());const nums=windows.get(key);for(let n=Math.max(1,p.verse-5);n<=p.verse+5;n++)nums.add(n);}
 for(const [key,numbers]of windows){const [b,c]=key.split(':').map(Number),data=await chapter(b,c);if(!data)continue;const verses=data.verses.filter(v=>(!numbers||numbers.has(v.n))&&scriptureText(v,edition));if(!verses.length)continue;add(`${data.name} ${c}${numbers?':'+verses[0].n+'–'+verses.at(-1).n:''}`,verses.map(v=>`${data.name} ${c}:${v.n}. ${scriptureText(v,edition)}`).join('\n'),`#read/${b}/${c}`,scriptureKind(edition));}
 // Editorial annotations supplement primary text; they never substitute for passage retrieval.
 const scope=new Set(namedBooks(message).map(b=>b.id));
 for(const e of rankStudies(message,-1,-1).filter(e=>!scope.size||e.refs.some(r=>scope.has(parseRef(r)?.book)))){add(e.title,`${e.summary}\n${e.response}\nLimits: ${e.assessment}\n${e.context}`,`#study/${e.id}`,'Provisional editorial analysis');for(const ref of e.refs){const p=parseRef(ref);if(!p)continue;const data=await chapter(p.book,p.chapter),v=data?.verses.find(v=>v.n===p.verse);if(v&&scriptureText(v,edition))add(ref,scriptureText(v,edition),`#read/${p.book}/${p.chapter}/${p.verse}`,'Related primary scripture excerpt · '+edition.toUpperCase());}}
 const ranked=matchingResearch(message,4).filter(record=>record.kind==='annotation');for(const e of ranked)add(`${e.ref} — ${e.title}`,`${e.witness?e.witness+': ':''}${e.summary}\n${e.reasoning}\nLimits: ${e.scope}${e.checked?'\nChecked '+e.checked+'; source not fetched live.':''}`,e.sources[0]?.url||e.url,'Curated editorial comparison',{witness:e.witness,summary:e.summary,recordId:e.id,references:e.sources});return sources;}
// Chat is a deterministic interface to packaged content. No external services or credentials.
function cleanExcerpt(text){return String(text||'').replace(/\{[HG]\d+\}/g,'').replace(/\s+/g,' ').trim();}
function queryReferences(message){return BibleLensSearch.references(message,BOOKS);}
function referenceLabel(ref){return BOOKS[ref.book]?.name+' '+ref.chapter+(ref.first?':'+ref.first+(ref.last&&ref.last!==ref.first?'–'+ref.last:''):'');}
function referenceUrl(ref){return '#read/'+ref.book+'/'+ref.chapter+(ref.first?'/'+ref.first+(ref.last&&ref.last!==ref.first?'-'+ref.last:''):'');}
function referenceOverlaps(a,b){return a.book===b.book&&a.chapter===b.chapter&&(a.first===null||b.first===null||a.first<=(b.last??b.first)&&(a.last??a.first)>=b.first);}
let researchCatalog;
function includedResearch(){
 if(researchCatalog)return researchCatalog;
 const rows=[...STUDIES.map(record=>({record,kind:'study'})),...EVIDENCE.map(record=>({record,kind:'annotation'}))];
 const seen=new Set();
 researchCatalog=rows.filter(({record,kind})=>{const id=kind+':'+record.id;if(seen.has(id))return false;seen.add(id);return true;}).map(({record,kind})=>{
  const labels=[record.ref,...(record.refs||[]).map(ref=>typeof ref==='string'?ref:ref.label),...(record.sides||[]).map(side=>side.ref),...(record.appliesTo||[])].filter(Boolean);
  const refs=labels.flatMap(queryReferences).filter((ref,index,all)=>all.findIndex(other=>JSON.stringify(other)===JSON.stringify(ref))===index);
  const text=[record.title,record.topic,record.summary,record.intro,record.question,record.text,record.reasoning,record.claim,record.response,record.context,record.assessment,record.scope].filter(Boolean).join(' ');
  return {record,kind,refs,text,words:new Set(BibleLensSearch.tokens(text)),heading:new Set(BibleLensSearch.tokens([record.title,record.topic,record.summary,record.intro].join(' ')))};
 });
 return researchCatalog;
}
function researchRecord({record,kind,refs}){
 const sources=[...(record.sources||[]),...(kind==='study'?[record.sab?{label:'Skeptic’s Annotated Bible — original skeptical source',url:record.sab}:null,record.responseUrl?{label:'Attributed Christian response',url:record.responseUrl}:null].filter(Boolean):[])];
 return {id:record.id,title:record.title||record.ref,summary:record.summary||record.text,ref:record.ref||record.refs?.[0],url:kind==='study'?'#study/'+record.id:refs[0]?referenceUrl(refs[0]):'',kind,mode:record.mode||(kind==='study'?'study':''),tags:record.tags||[],tag:record.tag||'',text:record.text||'',sides:record.sides||[],languageContext:record.languageContext||'',fields:record.fields||[],scope:record.scope||record.assessment||'',reasoning:record.reasoning||record.context||'',alternativeReading:record.response||'',witness:record.witness||'',refs:refs.map(ref=>({...ref,label:referenceLabel(ref),url:referenceUrl(ref)})),sources:sources.filter((source,index,all)=>source?.url&&all.findIndex(other=>other.url===source.url)===index),checked:record.checked||null};
}
function matchingResearch(message,limit=12,allReferences=false,tuned=false){
 const references=queryReferences(message),scope=new Set(namedBooks(message).map(book=>book.id));
 const groups=references.length?[]:questionTerms(message,tuned);
 if(!references.length&&!groups.length||references.some(ref=>ref.first!==null&&(ref.first<1||ref.last<ref.first)))return [];
 const catalog=includedResearch();
 const has=(group,words)=>group.some(word=>words.has(word));
 const strength=(group,words)=>has(group.exact||group,words)?1:has(group,words)?0.35:0;
 const exactFrequencies=tuned?groups.map(group=>catalog.filter(row=>has(group.exact||group,row.words)).length):[];
 const frequencies=tuned?groups.map((group,index)=>exactFrequencies[index]||catalog.filter(row=>has(group,row.words)).length):[];
 // A missing content term is not permission to invent a match to a common word.
 if(tuned&&!references.length&&frequencies.some(count=>!count))return [];
 const weights=frequencies.map(count=>Math.log1p(catalog.length/(1+count)));
 const anchor=weights.indexOf(Math.max(...weights));
 return catalog.map(row=>{
  if(scope.size&&!row.refs.some(ref=>scope.has(ref.book)))return {...row,score:0};
  if(references.length){const count=references.filter(ref=>row.refs.some(other=>referenceOverlaps(ref,other))).length;return {...row,score:count&&(allReferences?count===references.length:true)?count*20+(row.kind==='study'?3:allReferences&&row.record.mode==='contradictions'?2:0):0};}
  if(tuned){
   const hits=groups.map((group,index)=>has(group,row.words)?index:-1).filter(index=>index>=0);
   const enough=hits.length>=Math.max(1,Math.ceil(groups.length*.6));
   const anchored=has(groups[anchor].exact||groups[anchor],row.words)||!exactFrequencies[anchor]&&hits.includes(anchor);
   const score=enough&&anchored?hits.reduce((sum,index)=>sum+weights[index]*(strength(groups[index],row.words)+3*strength(groups[index],row.heading)),0)+(hits.length===groups.length?3:0):0;
   return {...row,score};
  }
  const hits=groups.filter(group=>groupMatches(group,row.text)).length;
  const heading=[row.record.title,row.record.summary].filter(Boolean).join(' ');
  return {...row,score:hits===groups.length?hits*5+groups.filter(group=>groupMatches(group,heading)).length*2:0};
 }).filter(row=>row.score>0).sort((a,b)=>b.score-a.score||a.record.id.localeCompare(b.record.id)).slice(0,limit).map(researchRecord);
}
async function workspaceSearch(message,edition='kjv'){
 const query=String(message||'').trim(),result={query,edition,mode:'search',generation:'retrieval',passages:[],research:[],total:{passages:0,research:0},limited:false};
 if(!query)return result;
 const refs=queryReferences(query),scope=namedBooks(query);
 // A book name on its own opens its beginning; topical searches retain their terms.
 const bookOnly=!refs.length&&scope.length===1&&canonicalBookNames(query).trim().toLowerCase()===scope[0].name.toLowerCase();
 const targets=refs.length?refs:bookOnly?[{book:scope[0].id,chapter:1,first:null,last:null}]:searchPassages(query,true,true);
 const groups=refs.length||bookOnly?[]:questionTerms(retrievalQuery(query),true);
 result.references=refs;result.terms=groups.map(group=>[...group]);
 const seen=new Set();
 for(const ref of targets){
  const data=await chapter(ref.book,ref.chapter);if(!data)continue;
  let verses;
  if('first' in ref)verses=data.verses.filter(verse=>(ref.first===null||verse.n>=ref.first&&verse.n<=(ref.last??ref.first))&&scriptureText(verse,edition));
  else verses=data.verses.filter(verse=>Math.abs(verse.n-ref.verse)<=2&&scriptureText(verse,edition)).map(verse=>({verse,score:groups.filter(group=>groupMatches(group,scriptureText(verse,edition))).length})).sort((a,b)=>b.score-a.score||Math.abs(a.verse.n-ref.verse)-Math.abs(b.verse.n-ref.verse)).slice(0,1).map(row=>row.verse);
  if(!refs.length&&!bookOnly)verses=verses.filter(verse=>enoughMatches(groups,scriptureText(verse,edition)));
  const allowance=refs.length?Math.max(1,Math.floor(24/refs.length)):24;
  if(verses.length>allowance)result.limited=true;
  for(const verse of verses.slice(0,allowance)){
   const url='#read/'+ref.book+'/'+ref.chapter+'/'+verse.n;if(seen.has(url))continue;seen.add(url);
   if(result.passages.length===24){result.limited=true;break;}
   result.passages.push({book:ref.book,chapter:ref.chapter,verse:verse.n,label:data.name+' '+ref.chapter+':'+verse.n,url,text:scriptureText(verse,edition),edition,kind:scriptureKind(edition)});
  }
  if(result.passages.length===24){result.limited=true;break;}
 }
 const research=matchingResearch(query,13,false,true);result.limited||=research.length>12;result.research=research.slice(0,12);
 result.total={passages:result.passages.length,research:result.research.length};
 return result;
}
async function comparisonReply(message,refs,edition){
 const passages=[];
 for(const ref of refs){
  const data=await chapter(ref.book,ref.chapter);if(!data)continue;
  const verses=data.verses.filter(verse=>(ref.first===null||verse.n>=ref.first&&verse.n<=(ref.last??ref.first))&&scriptureText(verse,edition));
  if(!verses.length)continue;
  passages.push({...ref,label:referenceLabel(ref),url:referenceUrl(ref),edition,text:verses.slice(0,3).map(verse=>verse.n+'. '+scriptureText(verse,edition)).join(' '),kind:scriptureKind(edition)});
 }
 if(passages.length!==refs.length)return {answer:'One of those passages is unavailable in '+edition.toUpperCase()+'. Check the references and selected edition.',details:'No text from another edition has been substituted.',sources:[],evidence:[],selected:[],context:'Selected passages',mode:'missing',modelEligible:false};
 const records=matchingResearch(message,6,true);
 const sources=passages.map((passage,index)=>({...passage,id:index+1}));
 for(const record of records)for(const source of record.sources)if(!sources.some(existing=>existing.url===source.url))sources.push({...source,id:sources.length+1,kind:'Cited reference',recordId:record.id});
 const answer=records.length?'The included research identifies these points of comparison:\n\n'+records.slice(0,3).map(record=>(record.witness?record.witness+': ':'')+record.summary).join('\n\n'):'Both passages are available to compare, but the included research has no assessment connecting these exact selections. Read their wording and context before drawing a conclusion.';
 const details=records.map(record=>record.title+'\n'+record.summary+(record.reasoning?'\nReasoning: '+record.reasoning:'')+(record.alternativeReading?'\nOther reading: '+record.alternativeReading:'')+(record.scope?'\nLimits: '+record.scope:'')).join('\n\n')+(records.length?'\n\nThese are stored editorial assessments, not a newly generated conclusion. Source quotations retain their original witness; passage previews use '+edition.toUpperCase()+'.':'');
 return {answer,details,sources:withNetsReadingLinks(sources.map(({text,...source})=>source)),evidence:passages.map((passage,index)=>({...passage,id:String(index+1)})),comparison:{left:passages[0],right:passages[1],passages,records},selected:[],context:'Selected passages',mode:'comparison',modelEligible:false};
}
/*__NETS_LINKS__*/
/*__ANSWER_LAYER__*/
async function searchReply(message,book,ch,selected,previousQuestion='',edition='kjv'){
 message=canonicalBookNames(message);previousQuestion=canonicalBookNames(previousQuestion);
 const explicit=queryReferences(message);
 const directed=await answerIntent(message,previousQuestion,edition);if(directed)return {...directed,selected};
 if(explicit.length>=2)return comparisonReply(message,explicit,edition);
 const followup=previousQuestion&&/\b(he|she|they|him|her|it|that|those|then|else|more)\b/i.test(message)&&!namedBooks(message).length;
 const query=followup?previousQuestion+' '+message:message;
 const sources=await gatherSources(query,book,ch,selected,followup?previousQuestion:'',false,edition);
 const refs=queryReferences(message).length?queryReferences(message):followup?queryReferences(previousQuestion):[];const useSelection=selected.length&&(!refs.length)&&/\b(this|these|selected)\b/i.test(message);
 const retrieval=retrievalQuery(query);
 const groups=questionTerms(retrieval).filter(g=>!['then','allowed','okay','more','else','explain'].includes(g[0]));
 const hits=searchPassages(retrieval).filter(p=>foodTopic(query)!=='eat unclean'||p.book===2&&p.chapter===11||p.book===4&&p.chapter===14);const passages=[];
 const targets=refs.length?refs:useSelection?[{book,chapter:ch,first:Math.min(...selected),last:Math.max(...selected)}]:hits.slice(0,12);
 for(const p of targets){const data=await chapter(p.book,p.chapter);if(!data)continue;
  let verses;if('first' in p){verses=p.first!==null?data.verses.filter(v=>v.n>=p.first&&v.n<=p.last&&(!useSelection||selected.includes(v.n))):data.verses;}
  else {const nearby=data.verses.filter(v=>Math.abs(v.n-p.verse)<=2);const scored=nearby.map(v=>{const text=scriptureText(v,edition).toLowerCase(),words=new Set(text.match(/[a-z]+/g)||[]);return {v,score:groups.filter(g=>g.some(w=>words.has(w))).length};}).sort((a,b)=>b.score-a.score||Math.abs(a.v.n-p.verse)-Math.abs(b.v.n-p.verse));verses=scored.length?data.verses.filter(v=>Math.abs(v.n-scored[0].v.n)<=2):[];}
  verses=verses.filter(v=>scriptureText(v,edition));const matchText=verses.map(v=>scriptureText(v,edition)).join(' ');for(const v of verses.slice(0,refs.length||useSelection?8:5)){const label=data.name+' '+p.chapter+':'+v.n,url='#read/'+p.book+'/'+p.chapter+'/'+v.n;if(passages.some(x=>x.url===url))continue;passages.push({label,url,book:p.book,chapter:p.chapter,verse:v.n,matchText,text:scriptureText(v,edition),kind:scriptureKind(edition)});}
 }
 // Keep search suggestions bounded: an unknown term must not produce a confident answer.
 // A topic explicitly scoped to one book should not import cross-book editorial
 // arguments and their bibliography into an answer about that book's wording.
 const scopedSearch=namedBooks(query).length===1&&!refs.length;
 const terms=groups.flat();const editorial=scopedSearch?[]:sources.filter(s=>s.kind==='Curated editorial comparison'||s.kind==='Provisional editorial analysis').filter(s=>terms.length&&groups.every(g=>g.some(w=>new RegExp('\\b'+w+'\\b','i').test(s.label+' '+s.text))));
 for(const p of passages)p.directScore=groups.filter(g=>g.some(w=>new RegExp('\\b'+w+'\\b','i').test(p.label+' '+p.text))).length;
 const relevant=passages.filter(p=>refs.length||useSelection||enoughMatches(groups,p.label+' '+p.matchText) );
 const found=refs.length||useSelection?passages:relevant.sort((a,b)=>b.directScore-a.directScore||a.book-b.book||a.chapter-b.chapter||a.verse-b.verse);
 if(!found.length&&(refs.length||useSelection||!editorial.length)){
  const topical=!refs.length&&!useSelection?await topicPassages(query,edition):[];
  if(topical.length){const topic=topical[0].topic;return referenceResponse('Nave’s index connects your question with '+topic.label.toLowerCase()+'. '+topical[0].label+' says: “'+topical[0].text+'”',topical,[{label:'Nave’s Topical Bible: '+topic.label,text:'Third-party topic index. These references give context for exploring the question.',url:topic.source,kind:'Third-party reference aid'}],{mode:'topic',modelEligible:!questionIntent(message).permission});}
  return {answer:refs.length?'The requested passage text is unavailable in '+edition.toUpperCase()+'. Check the reference or choose another edition.':'I couldn’t find a close match in the packaged content. Try a person, topic, or passage reference.',details:refs.length?'Verse numbering can differ between editions. No text from another edition has been substituted.':'This search checks the included Bible text and research records. A missing match does not establish that something is absent from the Bible.',sources:[],evidence:[],modelEligible:false,mode:'missing',context:'Whole Bible',selected};
 }
 const linked=[];function link(p){let index=linked.findIndex(s=>s.url===p.url&&s.label===p.label);if(index<0){linked.push({...p,id:linked.length+1});index=linked.length-1;}return linked[index].id;}
 const lead=!refs.length&&!useSelection?editorial.find(p=>groups.every(g=>g.some(w=>new RegExp('\\b'+w+'\\b','i').test(p.summary||p.text.split('\n')[0])))):null;let answer;if(lead){const summary=lead.summary||(lead.text.split('\n')[0]);answer=(lead.witness?lead.witness+': ':'')+summary;link(lead);}else{const p=found[0]||editorial[0];answer=p.label+': “'+p.text+'”';}
 const details=[];for(const p of [...found,...passages.filter(p=>found.some(f=>f.url.slice(0,f.url.lastIndexOf('/'))===p.url.slice(0,p.url.lastIndexOf('/')))&&!found.includes(p))].slice(0,8))details.push(p.label+': “'+p.text+'” ['+link(p)+']');
 for(const p of editorial.slice(0,3)){details.push('Included editorial analysis — '+p.label+': '+p.text+' ['+link(p)+']');}
 details.push('These are stored passages and editorial notes retrieved from the package. Related matches may need context; open the linked passages to examine them.');
 const permission=questionIntent(message).permission;
 if(permission)details.unshift('This result is related context. A passage describing an act does not by itself establish permission or settle present-day applicability.');
 if(permission&&!refs.length&&!useSelection&&!lead&&found[0]?.directScore<groups.length)answer='I found related passages, but they do not directly answer whether this is permitted. Which rule or faith tradition are you asking about?';
 return {answer,details:details.join('\n\n'),sources:withNetsReadingLinks([...linked,...linked.flatMap(item=>(item.references||[]).filter(source=>!linked.some(existing=>existing.url===source.url)).map(source=>({...source,kind:'Cited reference',recordId:item.recordId})))].filter((source,index,all)=>all.findIndex(other=>other.url===source.url)===index).map(({text,matchText,directScore,book,chapter,verse,references,...p},index)=>({...p,id:p.id||linked.length+index+1}))),evidence:linked.filter(p=>p.kind.startsWith('Primary scripture')).slice(0,5).map(p=>({id:String(p.id),label:p.label,text:p.text,url:p.url,kind:p.kind})),modelEligible:!permission,mode:'passage',context:'Whole Bible',selected};
}
async function chat(request,env){
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Invalid request origin.'},403);
 let body;try{const raw=await request.text();if(raw.length>30000)return json({error:'Message is too large.'},413);body=JSON.parse(raw);if(!body||typeof body!=='object')throw Error();}catch{return json({error:'Invalid request.'},400);}
 const message=typeof body.message==='string'?body.message.trim():'';if(!message||message.length>2500)return json({error:'Enter a question of 1–2,500 characters.'},400);
 const book=Number(body.book),ch=Number(body.chapter),selected=Array.isArray(body.selected)?body.selected.filter(v=>Number.isInteger(v)&&v>0&&v<200).slice(0,12):[];
 const history=Array.isArray(body.history)?body.history.filter(m=>m&&m.role==='user'&&typeof m.content==='string').slice(-8):[];
 try{const edition=readingEdition(body.edition),result=await searchReply(message,book,ch,selected,history.at(-1)?.content.slice(0,2500)||'',edition);return json({...result,edition,generation:'retrieval'});}catch{return json({error:'The packaged search could not finish. Please try again.'},500);}
}


// Explicit citations define placement. Ranges cover each cited verse; supporting
// citations stay context links rather than inheriting the primary reference.
function referenceVerses(ref){const parsed=parseRef(ref);if(!parsed)return [];const range=/^.*? \d+:\d+\s*[-–—]\s*(\d+)\s*$/.exec(ref);const end=range?Number(range[1]):parsed.verse;return Array.from({length:Math.max(0,end-parsed.verse+1)},(_,i)=>({...parsed,verse:parsed.verse+i}));}
function evidencePlacements(e){const keys=e.sides?.length?e.sides.map(s=>s.ref):[e.ref];const target=e.sides?.find(s=>s.label==='A')?.ref||e.ref;return [...new Set([...keys,...(e.refs||[]).map(r=>typeof r==='string'?r:r.label),...(e.appliesTo||[])])].filter(Boolean).map(ref=>({ref,placementRole:keys.includes(ref)?'key':'context',keyTarget:target}));}

async function comparisons(book,ch,mode){
 const data=[];
 if(mode==='contradictions'){
  for(const e of STUDIES){
   if(e.type==='Historical / chronological')continue;
   for(const ref of e.refs)for(const p of referenceVerses(ref)){if(p?.book!==book||p.chapter!==ch)continue;
     data.push({id:`study-${e.id}`,verse:p.verse,ref,status:e.type==='Textual conflict'?'Textual conflict':'Apparent / interpretive conflict',title:e.title,summary:e.summary,text:e.context,reasoning:e.reasoning,scope:e.assessment,refs:e.refs.filter(r=>r!==ref).map(r=>({label:r,...parseRef(r)})),sources:[...e.refs.map(r=>{const p=parseRef(r);return {label:r+' — scripture',url:`#read/${p.book}/${p.chapter}/${p.verse}`}}),...(e.sources||[])],classification:e.type,relatedPassages:e.relatedPassages});
   }
  }
 }
 for(const e of EVIDENCE){
  if(e.mode!==mode)continue;
  for(const placement of evidencePlacements(e)){
   for(const p of referenceVerses(placement.ref))if(p.book===book&&p.chapter===ch)data.push({...e,sources:comparisonReadingSources(e),activeTags:(e.tags||[e.tag]).filter(t=>t&&(!['H','G','T','V'].includes(t)||!e.appliesTo||e.appliesTo.includes(placement.ref))),verse:p.verse,placementRole:placement.placementRole,keyTarget:placement.keyTarget});
  }
 }
 return data;
}

const markedBookCache=new Map();
async function markedBook(book){
 if(markedBookCache.has(book))return markedBookCache.get(book);
 const records=new Map(),verses={};
 for(let ch=1;ch<=BOOKS[book].chapters;ch++){
  const chapterRecords=[];
  for(const mode of ['history','contradictions','science','questions','commandments'])for(const item of await comparisons(book,ch,mode)){
   const key=mode+':'+item.id;
   if(!records.has(key))records.set(key,{...item,mode,key,placements:[]});
   const record=records.get(key);
   if(!record.placements.some(p=>p.chapter===ch&&p.verse===item.verse))record.placements.push({chapter:ch,verse:item.verse,placementRole:item.placementRole||'key',activeTags:item.activeTags});
   chapterRecords.push(item.verse);
  }
  if(chapterRecords.length){const data=await chapter(book,ch);for(const n of new Set(chapterRecords)){const verse=data.verses.find(v=>v.n===n);if(verse)verses[ch+':'+n]=verse;}}
 }
 for(const record of records.values())record.placements.sort((a,b)=>a.chapter-b.chapter||a.verse-b.verse);
 const result={book,records:[...records.values()].sort((a,b)=>a.placements[0].chapter-b.placements[0].chapter||a.placements[0].verse-b.placements[0].verse),verses};
 markedBookCache.set(book,result);if(markedBookCache.size>3)markedBookCache.delete(markedBookCache.keys().next().value);return result;
}

/*__CATEGORIES__*/
let categoryCatalogCache;
function publicCategoryPage(params){categoryCatalogCache||=createCategoryCatalog(EVIDENCE,STUDIES,parseRef,comparisonReadingSources,{stories:CATEGORY_STORIES,people:PEOPLE,prophecies:CATEGORY_PROPHECIES,summaries:CATEGORY_PERSON_SUMMARIES});return categoryPage(categoryCatalogCache,params);}
/*__SYNC__*/
/*__DEBATES__*/
export default {async fetch(request,env,ctx){const url=new URL(request.url);if(url.pathname==='/offline-bible.json')return request.method==='GET'?json(CHAPTERS):json({error:'Method not allowed'},405);if(url.pathname==='/api/debates'){const page=debatePage(EVIDENCE,url.searchParams);return page?json(page):json({error:'Invalid Big Question filters'},400);}if(url.pathname==='/api/debate'){const question=ACCEPTED_QUESTIONS.find(row=>row.id===url.searchParams.get('id'));if(question)return json({...question,title:question.question,summary:question.readings.map(row=>row.summary).join(' '),ref:question.decisionId,mode:question.comparison,status:'Context',verdict:question.labels.join(' · ')});const record=EVIDENCE.find(record=>record.id===url.searchParams.get('id'));return record?json({...record,verdict:debateVerdict(record)}):json({error:'Big Question not found'},404);}if(url.pathname.startsWith('/api/sync'))return syncRequest(request,env);if(url.pathname==='/release.json')return new Response(ASSETS['/release.json'].body,{headers:{'content-type':'application/json','cache-control':'no-store','access-control-allow-origin':'*'}});if(url.pathname==='/api/categories'){const result=publicCategoryPage(url.searchParams);return result?json(result):json({error:'Invalid category filters'},400);}if(url.pathname==='/api/marked-comparisons'){const book=Number(url.searchParams.get('book'));if(!url.searchParams.has('book')||!Number.isInteger(book)||!BOOKS[book])return json({error:'Invalid book'},400);return json(await markedBook(book));}if(url.pathname==='/reference/people.json')return json(PEOPLE);if(url.pathname==='/reference/topics.json')return json(TOPICS);if(url.pathname==='/api/comparisons'){const b=Number(url.searchParams.get('book')),c=Number(url.searchParams.get('chapter')),mode=url.searchParams.get('mode');if(!Number.isInteger(b)||!Number.isInteger(c)||!CHAPTERS[`${b}:${c}`]||!['history','science','contradictions','questions','commandments'].includes(mode))return json({error:'Invalid comparison request'},400);return json({items:await comparisons(b,c,mode),book:b,chapter:c,mode})}if(url.pathname==='/api/search'){if(request.method!=='GET')return json({error:'Method not allowed'},405);const query=url.searchParams.get('q')||'';if(query.length>2500)return json({error:'Enter a search of at most 2,500 characters.'},400);try{return json(await workspaceSearch(query,readingEdition(url.searchParams.get('edition'))));}catch{return json({error:'Search could not finish. Please try again.'},500);}}if(url.pathname==='/api/chat'){if(request.method!=='POST')return json({error:'Method not allowed'},405);return chat(request,env)}if(url.pathname==='/api/books')return json(BOOKS);if(url.pathname==='/api/chapter'){const b=Number(url.searchParams.get('book')),c=Number(url.searchParams.get('chapter'));if(!Number.isInteger(b)||!Number.isInteger(c))return json({error:'Invalid chapter'},400);const data=await chapter(b,c);return data?json(data):json({error:'Chapter not found'},404)}const asset=ASSETS[url.pathname==='/index.html'?'/':url.pathname];if(!asset)return new Response('Not found',{status:404});const gzip=asset.gzip&&acceptsGzip(request.headers.get('accept-encoding'));return new Response(gzip?Uint8Array.from(atob(asset.gzip),char=>char.charCodeAt(0)):asset.encoding==='base64'?Uint8Array.from(atob(asset.body),char=>char.charCodeAt(0)):asset.body,{headers:{'content-type':asset.type,'cache-control':'no-cache','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin',...(asset.csp?{'content-security-policy-report-only':asset.csp,'content-security-policy':"object-src 'none'; base-uri 'none'; form-action 'self'; worker-src 'self'"}:{}),...(asset.gzip?{'vary':'Accept-Encoding'}:{}),...(gzip?{'content-encoding':'gzip'}:{})}})}};

function acceptsGzip(value=''){
 const encodings=new Map(String(value||'').toLowerCase().split(',').map(part=>{const [name,...params]=part.trim().split(';');const q=params.find(param=>param.trim().startsWith('q='));return [name.trim(),q?Number(q.trim().slice(2)):1];}));
 return (encodings.get('gzip')??encodings.get('*')??0)>0;
}
