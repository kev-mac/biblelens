const BOOKS=/*__BOOKS__*/[];
const CHAPTERS=/*__CHAPTERS__*/{};
const STUDIES=/*__STUDIES__*/[];
const EVIDENCE=/*__EVIDENCE__*/[];
const ASSETS=/*__ASSETS__*/{};
const SEARCH=/*__SEARCH__*/{};
const chapterCache=new Map();
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
async function chapter(book,ch){const key=`${book}:${ch}`;if(chapterCache.has(key))return chapterCache.get(key);if(!CHAPTERS[key])return null;const bytes=Uint8Array.from(atob(CHAPTERS[key]),c=>c.charCodeAt(0));const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));const value=await new Response(stream).json();if(chapterCache.size>20)chapterCache.delete(chapterCache.keys().next().value);chapterCache.set(key,value);return value;}
function parseRef(ref){const m=/^(.*?) (\d+):(\d+)/.exec(ref);if(!m)return null;const b=BOOKS.find(b=>b.name===m[1]);return b?{book:b.id,chapter:+m[2],verse:+m[3]}:null;}
function rankStudies(message,book,ch){const words=message.toLowerCase().match(/[a-z0-9]{3,}/g)||[];return STUDIES.map(e=>{const text=JSON.stringify([e.title,e.topic,e.refs,e.claim,e.response,e.assessment]).toLowerCase();const relevance=words.filter(w=>!['the','how','what','does','this','that','with','about','and','are','can'].includes(w)&&text.includes(w)).length;const same=e.refs.some(r=>{const p=parseRef(r);return p&&p.book===book&&p.chapter===ch});return {e,score:relevance+(same?6:0)}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.e);}
const SEARCH_VARIANTS=[['kill','kills','killed','killing','slew','slay','slain','slaying','smite','smites','smiting','smote','struck','death'],['die','dies','died','dying','death','dead'],['fear','fears','feared','fearing','fearful','afraid','terror','dread'],['beat','beats','beating','beaten','smite','smites','smiting','smote','struck'],['slave','slaves','servant','servants','bondman','bondmen','bondage'],['fly','flies'],['marry','married','marriage','wife','husband'],['create','created','creation','made','form','formed'],['child','children'],['wrote','write','written'],['rise','rose','risen','resurrection']];
function namedBooks(message){const found=[];let remaining=message;for(const book of [...BOOKS].sort((a,b)=>b.name.length-a.name.length)){const pattern=new RegExp('\\b'+book.name+'\\b','gi');if(pattern.test(remaining)){found.push(book);remaining=remaining.replace(pattern,' ');}}return found;}
function questionTerms(message){const stop=new Set('the and who whom whose what was were where when which how why does did didnt can could would should this that these those about bible biblical chapter verse tell explain give please have has had are not his her him its their them you your anyone anybody someone somebody person people according say says said also from into with for all any ever'.split(' '));const scoped=namedBooks(message);let query=message;for(const book of scoped)query=query.replace(new RegExp(book.name,'gi'),' ');return [...new Set(query.toLowerCase().match(/[a-z]{3,}/g)||[])].filter(w=>!stop.has(w)).map(w=>SEARCH_VARIANTS.find(g=>g.includes(w))||[w,w.replace(/s$/,'')]).filter((g,i,a)=>a.findIndex(other=>other[0]===g[0])===i).concat(!query.match(/[a-z]{3,}/gi)?.some(w=>!stop.has(w.toLowerCase()))?scoped.map(b=>[b.name.toLowerCase()]):[]);}
function aquaticFoodQuestion(message){return /\b(shrimps?|prawns?|shellfish|crustaceans?|lobsters?|crabs?|oysters?|clams?|mussels?|scallops?|seafood)\b/i.test(message);}
const verseParts=id=>({book:Math.floor(id/1000000),chapter:Math.floor(id%1000000/1000),verse:id%1000});
function pinnedChapters(message){const keys=[];for(const book of namedBooks(message)){const match=new RegExp('\\b'+book.name+'\\s+(\\d+)(?::\\d+)?','i').exec(message);if(match&&CHAPTERS[book.id+':'+Number(match[1])])keys.push(book.id+':'+Number(match[1]));}
 if(/\b(adam|eve|mankind|humanity|humans?|man|woman|people)\b/i.test(message)&&/\b(creat\w*|form\w*|made|sixth|day)\b/i.test(message))keys.push('0:1','0:2');
 if(aquaticFoodQuestion(message))keys.push('2:11','4:14','40:7','43:10','44:14');
 if(/plagues?/i.test(message))keys.push(...[7,8,9,10,11,12].map(ch=>'1:'+ch));return [...new Set(keys)];}
function searchPassages(message,broad=false){const scope=new Set(namedBooks(message).map(b=>b.id)),groups=questionTerms(message),scores=new Map(),matched=new Map();
 for(const [index,group]of groups.entries()){const hits=new Map();for(const word of group)for(const [id,count]of SEARCH[word]||[]){const p=verseParts(id);if(scope.size&&!scope.has(p.book))continue;hits.set(id,Math.max(hits.get(id)||0,count));}
  const weight=Math.log(1+31102/(hits.size||1));for(const [id,count]of hits)for(let offset=-2;offset<=2;offset++){const center=id+offset,p=verseParts(center);if(p.verse<1||p.verse>199||p.chapter!==verseParts(id).chapter||p.book!==verseParts(id).book)continue;const proximity=offset===0?1:.55;scores.set(center,(scores.get(center)||0)+weight*proximity*(1+Math.min(Math.log1p(count),1)));if(!matched.has(center))matched.set(center,new Set());matched.get(center).add(index);}
 }
 for(const [id,terms]of matched)scores.set(id,scores.get(id)+terms.size*8+(terms.size===groups.length?16:0));
 const picked=[];for(const [id]of [...scores].sort((a,b)=>b[1]-a[1]||a[0]-b[0])){const p=verseParts(id);if(!CHAPTERS[`${p.book}:${p.chapter}`]||picked.some(o=>o.book===p.book&&o.chapter===p.chapter&&Math.abs(o.verse-p.verse)<=4))continue;picked.push(p);if(picked.length===(broad?24:12))break;}return picked;
}
function searchChapters(message){return [...new Set([...pinnedChapters(message),...searchPassages(message).map(p=>`${p.book}:${p.chapter}`)])].slice(0,12);}
async function gatherSources(message,book,ch,selected,previousQuestion='',broad=false){const sources=[];function add(label,text,url,kind,metadata={}){const existing=sources.find(s=>s.url===url&&s.text===text);if(existing)return existing.id;const id=sources.length+1;sources.push({id,label,text,url,kind,...metadata});return id;}
 const pinned=pinnedChapters(message);if((selected.length||/this chapter|these verses|this verse/i.test(message))&&CHAPTERS[book+':'+ch])pinned.unshift(book+':'+ch);
 const windows=new Map();for(const key of pinned)windows.set(key,null);
 for(const p of [...(previousQuestion?searchPassages(previousQuestion,broad):[]),...searchPassages(message,broad)]){const key=`${p.book}:${p.chapter}`;if(windows.has(key)&&windows.get(key)===null)continue;if(!windows.has(key))windows.set(key,new Set());const nums=windows.get(key);for(let n=Math.max(1,p.verse-2);n<=p.verse+2;n++)nums.add(n);}
 for(const [key,numbers]of windows){const [b,c]=key.split(':').map(Number),data=await chapter(b,c);if(!data)continue;const verses=numbers?data.verses.filter(v=>numbers.has(v.n)):data.verses;if(!verses.length)continue;add(`${data.name} ${c}${numbers?':'+verses[0].n+'–'+verses.at(-1).n:''}`,verses.map(v=>`${data.name} ${c}:${v.n}. ${v.kjv||v.web}`).join('\n'),`#read/${b}/${c}`,'Primary scripture text · KJV');}
 // Editorial annotations supplement primary text; they never substitute for passage retrieval.
 const scope=new Set(namedBooks(message).map(b=>b.id));
 for(const e of rankStudies(message,-1,-1).filter(e=>!scope.size||e.refs.some(r=>scope.has(parseRef(r)?.book)))){add(e.title,`${e.summary}\n${e.response}\nLimits: ${e.assessment}\n${e.context}`,`#study/${e.id}`,'Provisional editorial analysis');for(const ref of e.refs){const p=parseRef(ref);if(!p)continue;const data=await chapter(p.book,p.chapter),v=data?.verses.find(v=>v.n===p.verse);if(v)add(ref,v.kjv||v.web,`#read/${p.book}/${p.chapter}/${p.verse}`,'Related primary scripture excerpt');}}
 const words=questionTerms(message).flat();const ranked=EVIDENCE.filter(e=>!scope.size||scope.has(parseRef(e.ref)?.book)).map(e=>({e,score:words.filter(w=>JSON.stringify([e.title,e.text,e.summary,e.ref]).toLowerCase().includes(w)).length})).filter(x=>x.score>=2).sort((a,b)=>b.score-a.score).slice(0,4);for(const {e}of ranked)for(const source of e.sources)add(`${e.ref} — ${source.label}`,`${e.witness?e.witness+': ':''}${e.summary}\n${e.text}\nReasoning: ${e.reasoning}\nLimits: ${e.scope}\nChecked ${e.checked}; source not fetched live.`,source.url,'Curated editorial comparison',e.witness?{witness:e.witness,summary:e.summary,recordId:e.id}:{});return sources;}
// Chat is a deterministic interface to packaged content. No external services or credentials.
function cleanExcerpt(text){return String(text||'').replace(/\{[HG]\d+\}/g,'').replace(/\s+/g,' ').trim();}
function queryReferences(message){const refs=[];for(const b of namedBooks(message)){const m=new RegExp('\\b'+b.name+'\\s+(\\d+)(?::(\\d+)(?:[–-](\\d+))?)?','i').exec(message);if(m)refs.push({book:b.id,chapter:+m[1],first:m[2]?+m[2]:null,last:m[3]?+m[3]:m[2]?+m[2]:null});}return refs;}
async function searchReply(message,book,ch,selected,previousQuestion=''){
 const followup=previousQuestion&&/\b(he|she|they|him|her|it|that|those|then|else|more)\b/i.test(message)&&!namedBooks(message).length;
 const query=followup?previousQuestion+' '+message:message;
 const sources=await gatherSources(query,book,ch,selected,followup?previousQuestion:'');
 const refs=queryReferences(message).length?queryReferences(message):followup?queryReferences(previousQuestion):[];const useSelection=selected.length&&(!refs.length)&&/\b(this|these|selected)\b/i.test(message);
 const retrieval=aquaticFoodQuestion(query)?'fins scales':/plagues?/i.test(query)?query.replace(/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|\d+(?:st|nd|rd|th)?)\b/gi,''):query;
 const groups=questionTerms(retrieval).filter(g=>!['then','allowed','okay','more','else','explain'].includes(g[0]));const hits=searchPassages(retrieval);const passages=[];
 const targets=refs.length?refs:useSelection?[{book,chapter:ch,first:Math.min(...selected),last:Math.max(...selected)}]:hits.slice(0,12);
 for(const p of targets){const data=await chapter(p.book,p.chapter);if(!data)continue;
  let verses;if('first' in p){verses=p.first?data.verses.filter(v=>v.n>=p.first&&v.n<=p.last&&(!useSelection||selected.includes(v.n))):data.verses;}
  else {const nearby=data.verses.filter(v=>Math.abs(v.n-p.verse)<=2);const scored=nearby.map(v=>{const text=cleanExcerpt(v.kjv||v.web).toLowerCase(),words=new Set(text.match(/[a-z]+/g)||[]);return {v,score:groups.filter(g=>g.some(w=>words.has(w))).length};}).sort((a,b)=>b.score-a.score||Math.abs(a.v.n-p.verse)-Math.abs(b.v.n-p.verse));verses=scored.length?data.verses.filter(v=>Math.abs(v.n-scored[0].v.n)<=2):[];}
  const matchText=verses.map(v=>cleanExcerpt(v.kjv||v.web)).join(' ');for(const v of verses.slice(0,refs.length||useSelection?8:5)){const label=data.name+' '+p.chapter+':'+v.n,url='#read/'+p.book+'/'+p.chapter+'/'+v.n;if(passages.some(x=>x.url===url))continue;passages.push({label,url,book:p.book,chapter:p.chapter,verse:v.n,matchText,text:cleanExcerpt(v.kjv||v.web),kind:'Primary scripture text · KJV'});}
 }
 // Keep search suggestions bounded: an unknown term must not produce a confident answer.
 const terms=groups.flat();const editorial=sources.filter(s=>s.kind==='Curated editorial comparison'||s.kind==='Provisional editorial analysis').filter(s=>terms.length&&groups.every(g=>g.some(w=>new RegExp('\\b'+w+'\\b','i').test(s.label+' '+s.text))));
 for(const p of passages)p.directScore=groups.filter(g=>g.some(w=>new RegExp('\\b'+w+'\\b','i').test(p.label+' '+p.text))).length;
 const relevant=passages.filter(p=>refs.length||useSelection||groups.length&&groups.every(g=>g.some(w=>new RegExp('\\b'+w+'\\b','i').test(p.label+' '+p.matchText))) );
 const found=refs.length||useSelection?passages:relevant.sort((a,b)=>b.directScore-a.directScore||a.book-b.book||a.chapter-b.chapter||a.verse-b.verse);
 if(!found.length&&(refs.length||useSelection||!editorial.length))return {answer:'I couldn’t find a close match in the packaged content. Try a person, topic, or passage reference.',details:'This search checks the included Bible text and research records. A missing match does not establish that something is absent from the Bible.',sources:[],context:'Whole Bible',selected};
 const linked=[];function link(p){let index=linked.findIndex(s=>s.url===p.url&&s.label===p.label);if(index<0){linked.push({...p,id:linked.length+1});index=linked.length-1;}return linked[index].id;}
 const lead=!refs.length&&!useSelection?editorial.find(p=>groups.every(g=>g.some(w=>new RegExp('\\b'+w+'\\b','i').test(p.summary||p.text.split('\n')[0])))):null;let answer;if(lead){const summary=lead.summary||(lead.text.split('\n')[0]);answer='I found a related study: '+(lead.witness?lead.witness+': ':'')+summary;link(lead);}else{const p=found[0]||editorial[0];answer='I found a related passage, '+p.label+': “'+p.text+'”';}
 const details=[];for(const p of [...found,...passages.filter(p=>found.some(f=>f.url.slice(0,f.url.lastIndexOf('/'))===p.url.slice(0,p.url.lastIndexOf('/')))&&!found.includes(p))].slice(0,8))details.push(p.label+': “'+p.text+'” ['+link(p)+']');
 for(const p of editorial.slice(0,3)){details.push('Included editorial analysis — '+p.label+': '+p.text+' ['+link(p)+']');}
 details.push('These are stored passages and editorial notes retrieved from the package. Related matches may need context; open the linked passages to examine them.');
 return {answer,details:details.join('\n\n'),sources:linked.map(({text,matchText,directScore,book,chapter,verse,...p})=>p),context:'Whole Bible',selected};
}
async function chat(request,env){
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Invalid request origin.'},403);
 let body;try{const raw=await request.text();if(raw.length>30000)return json({error:'Message is too large.'},413);body=JSON.parse(raw);if(!body||typeof body!=='object')throw Error();}catch{return json({error:'Invalid request.'},400);}
 const message=typeof body.message==='string'?body.message.trim():'';if(!message||message.length>2500)return json({error:'Enter a question of 1–2,500 characters.'},400);
 const book=Number(body.book),ch=Number(body.chapter),selected=Array.isArray(body.selected)?body.selected.filter(v=>Number.isInteger(v)&&v>0&&v<200).slice(0,12):[];
 const history=Array.isArray(body.history)?body.history.filter(m=>m&&m.role==='user'&&typeof m.content==='string').slice(-8):[];
 try{return json(await searchReply(message,book,ch,selected,history.at(-1)?.content.slice(0,2500)||''));}catch{return json({error:'The packaged search could not finish. Please try again.'},500);}
}


function evidencePlacements(e){const keys=e.sides?.length?e.sides.map(s=>s.ref):[e.ref];const target=e.sides?.find(s=>s.label==='A')?.ref||e.ref;return [...new Set([...keys,...(e.refs||[]).map(r=>r.label),...(e.appliesTo||[])])].map(ref=>({ref,placementRole:keys.includes(ref)?'key':'context',keyTarget:target}));}

async function comparisons(book,ch,mode){
 const data=[];
 if(mode==='contradictions'){
  for(const e of STUDIES){
   if(e.type==='Historical / chronological')continue;
   for(const ref of e.refs){const p=parseRef(ref);if(p?.book!==book||p.chapter!==ch)continue;
     data.push({id:`study-${e.id}`,verse:p.verse,status:e.type==='Textual conflict'?'Textual conflict':'Apparent / interpretive conflict',title:e.title,summary:e.summary,text:e.context,reasoning:e.reasoning,scope:e.assessment,refs:e.refs.filter(r=>r!==ref).map(r=>({label:r,...parseRef(r)})),sources:[...e.refs.map(r=>{const p=parseRef(r);return {label:r+' — scripture',url:`#read/${p.book}/${p.chapter}/${p.verse}`}}),...(e.sources||[])],classification:e.type});
   }
  }
 }
 for(const e of EVIDENCE){
  if(e.mode!==mode)continue;
  for(const placement of evidencePlacements(e)){
   const p=parseRef(placement.ref);if(p?.book===book&&p.chapter===ch)data.push({...e,activeTags:(e.tags||[e.tag]).filter(t=>t&&(!['H','G','T','V'].includes(t)||!e.appliesTo||e.appliesTo.includes(placement.ref))),verse:p.verse,placementRole:placement.placementRole,keyTarget:placement.keyTarget});
  }
 }
 return data;
}

export default {async fetch(request,env,ctx){const url=new URL(request.url);if(url.pathname==='/api/comparisons'){const b=Number(url.searchParams.get('book')),c=Number(url.searchParams.get('chapter')),mode=url.searchParams.get('mode');if(!Number.isInteger(b)||!Number.isInteger(c)||!CHAPTERS[`${b}:${c}`]||!['history','science','contradictions','questions'].includes(mode))return json({error:'Invalid comparison request'},400);return json({items:await comparisons(b,c,mode),book:b,chapter:c,mode})}if(url.pathname==='/api/chat'){if(request.method!=='POST')return json({error:'Method not allowed'},405);return chat(request,env)}if(url.pathname==='/api/books')return json(BOOKS);if(url.pathname==='/api/chapter'){const b=Number(url.searchParams.get('book')),c=Number(url.searchParams.get('chapter'));if(!Number.isInteger(b)||!Number.isInteger(c))return json({error:'Invalid chapter'},400);const data=await chapter(b,c);return data?json(data):json({error:'Chapter not found'},404)}const asset=ASSETS[url.pathname==='/index.html'?'/':url.pathname];if(!asset)return new Response('Not found',{status:404});return new Response(asset.body,{headers:{'content-type':asset.type,'cache-control':'no-cache','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin'}})}};
