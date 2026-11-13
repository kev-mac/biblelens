'use strict';
// A small reviewed concept bridge works offline as well as online. These are
// retrieval leads, not claims about historical events or exhaustive coverage.
const BibleLensConcepts=(()=>{
 const concepts=[
  {id:'child-consumption',label:'accounts and warnings about eating children',pattern:/\bcannibalis(?:m|tic)\b|\b(?:eat|ate|eaten|eating|boil(?:ed|ing)?|devour(?:ed|ing)?)\s+(?:(?:their|his|her|our|your|own|the|of|flesh|young)\s+){0,5}(?:children|child|sons?|daughters?|bab(?:y|ies))\b/i,terms:['eat','children','famine','siege'],refs:['2 Kings 6:28-29','Lamentations 4:10','Lamentations 2:20','Leviticus 26:29','Deuteronomy 28:53-57','Jeremiah 19:9'],strict:true,description:'These passages concern people eating children during famine or siege. Some describe events; others warn what could happen. Open each passage to check its setting.'},
  {id:'healing',label:'healing',pattern:/\b(?:heal(?:ing|ed|ings)?|cur(?:e|es|ed)|restore sight|made? (?:the )?(?:blind|lame|sick))\b/i,terms:['heal','healing','blind','sick','leper'],refs:['Mark 2:9-12','John 9:6-7','Luke 17:13-16']},
  {id:'miracles',label:'acts often called miracles',pattern:/\b(?:miracles?|miraculous|supernatural|signs and wonders|extraordinary acts)\b/i,terms:['miracle','miracles','healing','raised','feeding','wine','sea'],refs:['John 2:7-10','Mark 4:38-41','Mark 6:41-44','John 11:41-44','Exodus 14:21-24']},
  {id:'forgiveness',label:'forgiveness',pattern:/\b(?:forgiv(?:e|en|ing|eness)|pardon(?:ed|ing)?|letting go of (?:anger|resentment))\b/i,terms:['forgive','forgiveness','mercy','debt'],refs:['Matthew 18:21-35','Luke 15:11-32','Luke 23:34']},
  {id:'resurrection',label:'returning to life',pattern:/\b(?:resurrect(?:ion|ed)?|raised from (?:the )?dead|ris(?:e|ing) from (?:the )?dead|return(?:ing)? to life|(?:coming|came|brought) back to life)\b/i,terms:['resurrection','raised','dead','lazarus'],refs:['John 11:41-44','Luke 24:4-8','1 Corinthians 15:3-8']},
  {id:'feeding',label:'feeding a crowd',pattern:/\b(?:feed(?:ing)? (?:a |the )?(?:crowd|multitude|hungry)|food for (?:a |the )?crowd|loaves and (?:fishes|fish))\b/i,terms:['feeding','bread','loaves','fish'],refs:['Mark 6:41-44','Matthew 15:35-38']},
  {id:'generosity',label:'sharing with people in need',pattern:/\b(?:generosity|generous|help(?:ing)? (?:the )?poor|shar(?:e|ing) with|giv(?:e|ing) to (?:the )?poor)\b/i,terms:['poor','give','neighbour','samaritan'],refs:['Deuteronomy 15:7-11','Luke 10:30-37','Acts 4:32-35']}
 ];
 function lookup(query){return concepts.find(concept=>concept.pattern.test(String(query||'')))||null;}
 function references(query,books){
  const concept=lookup(query);if(!concept)return [];
  const normalized=BibleLensSearch.canonicalBooks(query,books),scope=[];let remainder=normalized;
  for(const book of [...books].sort((a,b)=>b.name.length-a.name.length)){
   const pattern=new RegExp('\\b'+book.name+'\\b','gi');if(pattern.test(remainder)){scope.push(book);remainder=remainder.replace(pattern,' ');}
  }
  remainder=remainder.replace(concept.pattern,' ').replace(/\b(?:show|me|examples?|of|some|find|verses?|stories?|passages?|about|the|bible|biblical|in|from|please|give|list|what|where|which|are|is|can|you|tell|acts?|called|events?|and|people|does|say|says|happened)\b/gi,' ');
  if(concept.strict)remainder=remainder.replace(/\b(?:did|do|ever|really|actually|was|were|there|any|ancient|israelites?|israel|judeans?|judah|jews|hebrews|during|a|famine|sieges?|starvation|hunger|parents?|mothers?|women)\b/gi,' ');
  // A general example set must not silently ignore a named person, place or
  // other qualifier. Narrow questions retain lexical/online semantic retrieval.
  if(remainder.replace(/[^a-z0-9]/gi,''))return [];
  return concept.refs.flatMap(ref=>BibleLensSearch.references(ref,books)).filter(ref=>!scope.length||scope.some(book=>book.id===ref.book));
 }
 return {lookup,references};
})();
