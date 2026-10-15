// Reference aids are kept separate from research annotations. An imported edge
// is a candidate; scripture wording must confirm its direction before answering.
const PEOPLE=/*__PEOPLE__*/[];
const TOPICS=/*__TOPICS__*/[];
let peopleLookup,topicLookup;
const normalizedName=text=>String(text||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim();
const escapedPattern=text=>String(text).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

function referencePeople(){
 if(peopleLookup)return peopleLookup;
 peopleLookup=new Map();
 for(const person of PEOPLE)for(const alias of [person.name,person.label,...person.aliases]){
  const key=normalizedName(alias);if(!key)continue;
  if(!peopleLookup.has(key))peopleLookup.set(key,[]);
  if(!peopleLookup.get(key).some(p=>p.id===person.id))peopleLookup.get(key).push(person);
 }
 return peopleLookup;
}
function familyQuestion(message,previous=''){
 const scope=namedBooks(message).map(b=>b.id);
 let input=message.toLowerCase().replace(/[’‘]/g,"'").replace(/[?.!]+$/,'').replace(/^(?:and |what about )/,'').trim();
 for(const book of namedBooks(message))input=input.replace(new RegExp(' in (?:the book of )?'+escapedPattern(book.name)+'$','i'),'').trim();
 const relations='father|dad|daddy|mother|mom|mum|parents|children|child|sons|son|daughters|daughter|wife|husband|spouse';
 let match=new RegExp("^(?:who (?:was|is|were|are) |tell me about )?(.+?)'s ("+relations+")$").exec(input);
 let name,relation;
 if(match){name=match[1];relation=match[2];}
 else if((match=new RegExp('^(?:who (?:was|is|were|are) |the )?(?:the )?('+relations+') of (.+)$').exec(input))){relation=match[1];name=match[2];}
 else if((match=new RegExp('^(?:who (?:was|is|were|are) )?(?:his|her|their) ('+relations+')$').exec(input))&&previous){
  relation=match[1];name=familyQuestion(previous)?.name;
  if(!name){const candidates=[...referencePeople().keys()].filter(key=>new RegExp('\\b'+escapedPattern(key)+'\\b','i').test(previous));name=candidates.sort((a,b)=>b.length-a.length)[0];}
 }
 if(!name)return null;
 name=name.replace(/^(?:who (?:was|is|were|are) |the )/,'').trim();
 const type=/^(dad|daddy|father)$/.test(relation)?'father':/^(mom|mum|mother)$/.test(relation)?'mother':/^(children|child|sons|son|daughters|daughter)$/.test(relation)?'children':relation;
 return {name,type,word:relation,scope};
}

function questionIntent(message){
 const permission=/\b(can|may|allow|allows|allowed|okay|ok|permitted|permission|sin|should|right to)\b/i.test(message);
 const violence=/\b(beat|beating|hit|hitting|strike|striking|slap|slapping|hurt|harm|abuse|abusing|kill)\b/i.test(message)&&/\b(wif[ea]|wives|husbands?|spouses?|partners?|children|child|kids?|slaves?|servants?)\b/i.test(message);
 return {permission,violence:violence&&(permission||/\b(my|our|your)\b/i.test(message))};
}

function confirmsParent(text,parent,child,type='father'){
 const p=escapedPattern(parent.name),c=escapedPattern(child.name),space='[\\s\\S]';
 const parentWord=type==='mother'?'mother':'father';
 // Direct relationships; a list of ancestors must not reverse the relation.
 if(new RegExp('\\b'+c+'\\b[^.;!?]{0,65}\\b(?:son|daughter|child) of (?:the )?'+p+'\\b','i').test(text))return true;
 if(new RegExp('\\b'+p+'\\b[^.;!?]{0,45}\\b(?:the )?'+parentWord+' of '+c+'\\b','i').test(text))return true;
 if(type==='father'&&new RegExp('\\b'+p+'\\b(?:(?!\\bbegat\\b|[.;!?])'+space+'){0,130}\\bbegat\\b(?:(?!\\bbegat\\b|[.;!?])'+space+'){0,100}\\b'+c+'\\b','i').test(text))return true;
 // The naming sentence can follow a birth sentence (e.g. Genesis 5:28–29).
 if(type==='father'&&new RegExp('\\b'+p+'\\b(?:(?!\\bbegat\\b|[.;!?])'+space+'){0,130}\\bbegat a son:?[\\s.]*And he called his name '+c+'\\b','i').test(text))return true;
 // Names in a daughters list remain subordinate to the named father.
 if(type==='father'&&new RegExp('\\b'+p+'\\b[^.;!?]{0,80}\\bdaughters?\\b[^.;!?]{0,140}\\b'+c+'\\b','i').test(text))return true;
 return false;
}

async function verifiedFamilyEdge(subject,relative,edge,type){
 const parent=type==='children'?subject:relative,child=type==='children'?relative:subject;
 const candidates=[...(edge.contextRefs||[]),...subject.refs].slice(0,24);
 const tried=new Set();
 for(const [book,ch,verse]of candidates){
  const key=book+':'+ch+':'+verse;if(tried.has(key))continue;tried.add(key);
  const data=await chapter(book,ch);if(!data)continue;
  const verses=data.verses.filter(v=>Math.abs(v.n-verse)<=1);
  const text=verses.map(v=>cleanExcerpt(v.kjv||v.web)).join(' ');
  if(!confirmsParent(text,parent,child,type==='mother'?'mother':'father'))continue;
  return verses.map(v=>({label:data.name+' '+ch+':'+v.n,text:cleanExcerpt(v.kjv||v.web),url:'#read/'+book+'/'+ch+'/'+v.n,kind:'Primary scripture text · KJV'}));
 }
 return null;
}

function referenceResponse(answer,primary=[],references=[],extra={}){
 const sources=[];
 for(const source of [...primary,...references])if(!sources.some(s=>s.url===source.url&&s.label===source.label))sources.push({...source,id:sources.length+1});
 return {answer,details:[...primary.map(s=>s.label+': “'+s.text+'”'),...references.map(s=>s.label+': '+s.text)].join('\n\n'),sources:sources.map(({text,...s})=>s),evidence:primary.map((s,i)=>({...s,id:String(i+1)})),mode:'reference',modelEligible:false,context:'Whole Bible',selected:[],...extra};
}

async function familyReply(question){
 const choices=(referencePeople().get(normalizedName(question.name))||[]).filter(p=>!question.scope.length||p.refs.some(([book])=>question.scope.includes(book)));
 if(!choices.length)return referenceResponse('I couldn’t identify that person in the included reference data. Try a fuller name or passage reference.',[],[],{mode:'clarification'});
 if(['wife','husband','spouse'].includes(question.type))return referenceResponse('The included family dataset does not supply spouse links. A passage reference will help me check the relationship without guessing.',[],[],{mode:'clarification'});
 const types=question.type==='parents'?['father','mother']:[question.type];
 const primary=[],answers=[],references=[];
 for(const person of choices.slice(0,4)){
  const found=[];
  for(const type of types)for(const edge of (person.relations[type]||[]).slice(0,12)){
   const relative=PEOPLE.find(p=>p.id===edge.id);if(!relative)continue;
   if(question.word.startsWith('son')&&relative.gender!=='Male'||question.word.startsWith('daughter')&&relative.gender!=='Female')continue;
   const proof=await verifiedFamilyEdge(person,relative,edge,type);if(!proof)continue;
   primary.push(...proof);found.push({name:relative.name,type});
  }
  if(!found.length)continue;
  const bookName=BOOKS[person.refs[0]?.[0]]?.name;
  const label=choices.length>1?(person.label===person.name?person.name+' in '+bookName:person.label):person.name;
  for(const type of types){const names=[...new Set(found.filter(f=>f.type===type).map(f=>f.name))];if(!names.length)continue;
   const subject=choices.length>1?'For '+label+', '+(person.gender==='Female'?'her':person.gender==='Male'?'his':'the'):label+"’s";
   answers.push(type==='children'?'I could verify these children of '+label+': '+names.join(', ')+'.':subject+' '+type+' was '+names.join(' or ')+'.');
  }
  references.push({label:'Theographic: '+person.label,text:'Imported relationship checked against the linked scripture wording. Adapted reference data, CC BY-SA 4.0.',url:person.source,kind:'Third-party reference aid'});
 }
 if(!answers.length)return referenceResponse('I couldn’t verify that relationship from the included reference links and scripture wording. I’ll leave it open rather than guess.',[],[],{mode:'clarification'});
 return referenceResponse(answers.join('\n\n'),primary,references);
}

function findReferenceTopics(message){
 if(!topicLookup)topicLookup=new MiniSearch({fields:['label'],storeFields:['id'],tokenize:text=>text.toLowerCase().match(/[a-z]{3,}/g)||[]});
 if(!topicLookup.documentCount)topicLookup.addAll(TOPICS.map((t,i)=>({id:i,label:t.label})));
 const words=questionTerms(message).map(g=>g.original||g[0]).join(' ');
 const direct=TOPICS.filter(t=>normalizedName(message)===normalizedName(t.label));
 const ranked=topicLookup.search(words,{combineWith:'OR'}).slice(0,3).map(r=>TOPICS[r.id]);
 return [...new Map([...direct,...ranked].map(t=>[t.id,t])).values()].slice(0,3);
}

async function topicPassages(message){
 const terms=questionTerms(message),matches=[];
 // Do not allow a broad topic to erase an unknown word in a question.
 if(!terms.length||terms.some(g=>!g.some(w=>SEARCH[w])))return [];
 const scope=new Set(namedBooks(message).map(b=>b.id));
 for(const topic of findReferenceTopics(message)){
  const related=TOPICS.filter(t=>topic.related.includes(t.label)).slice(0,2);
  for(const [book,ch,verse,endChapter,endVerse]of [...topic.refs,...related.flatMap(t=>t.refs)].slice(0,80)){
   if(scope.size&&!scope.has(book))continue;const data=await chapter(book,ch);if(!data)continue;
   const candidates=verse?data.verses.filter(v=>v.n>=verse&&v.n<=(endChapter===ch?Math.min(endVerse,verse+3):verse)):data.verses.slice(0,8);
   for(const v of candidates){const text=cleanExcerpt(v.kjv||v.web),score=terms.filter(g=>groupMatches(g,text)).length;if(!score)continue;
    matches.push({book,chapter:ch,verse:v.n,text,label:data.name+' '+ch+':'+v.n,url:'#read/'+book+'/'+ch+'/'+v.n,kind:'Primary scripture text · KJV',score,topic});
   }
  }
 }
 return [...new Map(matches.sort((a,b)=>b.score-a.score).map(p=>[p.url,p])).values()].slice(0,4);
}

async function violenceReply(message){
 const topic=TOPICS.find(t=>t.label===(/\b(wife|wives|husband|spouse|partner)\b/i.test(message)?'HUSBAND':'CRUELTY'));
 const primary=[];
 for(const [book,ch,first,lastChapter,lastVerse]of topic?.refs||[]){
  const data=await chapter(book,ch);if(!data)continue;
  for(const verse of data.verses.filter(v=>v.n>=(first||1)&&v.n<=(lastChapter===ch?Math.min(lastVerse,(first||1)+4):(first||1)))){
   const text=cleanExcerpt(verse.kjv||verse.web);
   if(!/\bhusbands?,? love your wives\b|\blove (?:his|their) wi(?:fe|ves)\b|\bbe not bitter\b|\bmerciful man\b|\bhe that is cruel\b/i.test(text))continue;
   primary.push({label:data.name+' '+ch+':'+verse.n,text,url:'#read/'+book+'/'+ch+'/'+verse.n,kind:'Primary scripture text · KJV'});
  }
  if(primary.length>=3)break;
 }
 const reference=topic?[{label:'Nave’s Topical Bible: '+topic.label,text:'Related reference context. A topic classification is not itself a ruling about permission.',url:topic.source,kind:'Third-party reference aid'}]:[];
 return referenceResponse('No. Do not hit or abuse another person. A narrative describing violence does not give you permission to do it.',primary.slice(0,3),reference,{mode:'permission'});
}

async function answerIntent(message,previous){
 const intent=questionIntent(message);
 if(intent.violence)return violenceReply(message);
 const family=familyQuestion(message,previous);if(family)return familyReply(family);
 // Explicit passages retain priority over topic routing. Carry the food subject
 // only through a short dependent follow-up, never into a new named subject.
 if(!queryReferences(message).length){
  const dependent=/^(?:and |but |so |then )?(?:can (?:i|we) eat (?:it|that|them)|is (?:it|that) (?:allowed|a sin|kosher)|what about (?:christians|today)|does (?:that|it) apply (?:to (?:us|me)|today))[?.!]*$/i.test(message.trim());
  if(aquaticFoodQuestion(message)||dependent&&aquaticFoodQuestion(previous))return dietaryReply(message);
 }
 return null;
}

async function dietaryReply(message){
 const primary=[];
 for(const [book,ch,verses]of [[2,11,[9,10,11,12]],[4,14,[9,10]],[40,7,[18,19,20,21,22,23]],[43,10,[28]],[44,14,[2,3,14,20]]]){
  const data=await chapter(book,ch);if(!data)continue;
  for(const n of verses){const v=data.verses.find(v=>v.n===n);if(v)primary.push({label:data.name+' '+ch+':'+n,text:cleanExcerpt(v.kjv||v.web),url:'#read/'+book+'/'+ch+'/'+n,kind:'Primary scripture text · KJV'});}
 }
 const scope=namedBooks(message).map(b=>b.id);
 const scoped=scope.length?primary.filter(p=>scope.some(b=>p.url.startsWith('#read/'+b+'/'))):primary;
 if(scope.length&&!scoped.length)return referenceResponse('I do not have a matching dietary passage in the book you named. Try Leviticus 11:9–12 or Deuteronomy 14:9–10 for the rule about water creatures.',[],[],{mode:'clarification'});
 if(scope.length&&!scope.some(b=>b===2||b===4))return referenceResponse('This passage belongs to the discussion of food laws and their application. Are you asking about the Torah’s dietary rule or how Christians apply it?',scoped,[],{mode:'dietary'});
 const answer='Under the Torah’s dietary rule, water creatures must have both fins and scales to be eaten (Leviticus 11:9–12; Deuteronomy 14:9–10). Are you asking about that rule or how Christians apply food laws?';
 const result=referenceResponse(answer,scoped,[],{mode:'dietary'});
 result.details='The Torah passages give a criterion, not a list of modern species. Applying it to a particular animal requires checking its classification; a word match cannot establish that.\n\nLater context includes Mark 7:18–23 on defilement, Acts 10:28 on people, and Romans 14 on food and conscience. These should be read in context before drawing a conclusion about present-day practice.\n\n'+result.details;
 return result;
}
