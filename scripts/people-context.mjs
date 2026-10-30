import {gunzipSync} from 'node:zlib';
import {createPersonMatcher} from '../src/people-links.js';

// Keep sparse profiles grounded in their own cited scripture, without inventing biographies.
export function addPeopleContext(people, chapters) {
 const cache=new Map(),match=createPersonMatcher(people);
 const chapter=(book,number)=>{const key=book+':'+number;if(!cache.has(key))cache.set(key,chapters[key]?JSON.parse(gunzipSync(Buffer.from(chapters[key],'base64'))):null);return cache.get(key);};
 return people.map(person=>{
  let context,fallback;
  for(const [book,number,verse] of person.refs||[]){
   const data=chapter(book,number),text=data?.verses.find(row=>row.n===verse)?.kjv;
   if(!text)continue;
   const hits=match(text,{book,chapter:number,verse});
   const source={book,chapter:number,verse,ref:`${data.name} ${number}:${verse}`,text,links:hits.filter(hit=>hit.id!==person.id&&!/^(king|queen|lord|son|father)$/i.test(hit.label))};
   fallback ||= source;
   if(!hits.some(hit=>hit.id===person.id))continue;
   context=source;break;
  }
  if(person.id==='recO5ToygNrV47m4M'){
   const summary='Abagtha was one of King Ahasuerus’s seven court servants. They were sent to bring Queen Vashti before the king.';
   return {...person,summary,summary_source:'Esther 1:10–11',summary_route:'#read/16/1/10-11',summary_links:match(summary,{book:16,chapter:1,verse:11}).filter(hit=>['reck4FOoejZddGY7H','recX0LVuxaIsDqO6p'].includes(hit.id))};
  }
  context ||= fallback;
  return context?{...person,scripture_context:context}:person;
 });
}
