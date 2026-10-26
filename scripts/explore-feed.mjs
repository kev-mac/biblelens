import fs from 'node:fs';
import {debateCard} from '../worker/debates.mjs';
export function exploreFeed(){
 const read=name=>JSON.parse(fs.readFileSync(name,'utf8'));
 const evidence=read('data/evidence.json'),slug=text=>text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const debates=test=>evidence.filter(test).slice(0,6).map(record=>({...debateCard(record),url:'#debate/'+encodeURIComponent(record.id),meta:record.ref}));
 const people=read('src/data/characters.json').slice(0,6).map(person=>({title:person.name,meta:person.era,url:'#characters/'+person.id}));
 const places=read('data/reference/places.json').filter(place=>['Jerusalem','Nazareth','Bethlehem','Jericho','Bethany','Hebron'].includes(place.fields.displayTitle)).slice(0,6).map(place=>({title:place.fields.displayTitle,meta:'Place reference',placeId:place.id}));
 const stories=read('data/stories.json').slice(0,3).flatMap(group=>group.stories.slice(0,2).map(story=>({title:story.title,meta:story.passage,url:'#stories/'+slug(group.book)+'/'+slug(story.title)})));
 const commandments=read('data/commandments-catalog.json').records.slice(0,6).map(record=>({title:record.title,meta:record.code+' · '+record.passage,url:'#commandments?code='+record.code}));
 const titleCase=text=>text.replace(/\b[a-z]/g,letter=>letter.toUpperCase());
 const timeline=read('data/timeline-events.json').events.slice(0,6).map(event=>({title:titleCase(event.title),meta:event.traditional_date,url:'#timeline?event='+event.id}));
 return {text:debates(r=>r.mode==='contradictions'&&r.sides?.length),science:debates(r=>r.mode==='science'),history:debates(r=>r.mode==='history'),translation:debates(r=>(r.tags||[r.tag]).includes('T')),people,places,stories,commandments,timeline};
}
