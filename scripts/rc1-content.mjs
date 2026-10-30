import fs from 'node:fs';
export const accepted=JSON.parse(fs.readFileSync(new URL('../data/rc1-accepted.json',import.meta.url),'utf8'));
for (const question of accepted.questions) if (question.comparison === 'text-vs-science' && !['Astronomy','Geology','Biology'].includes(question.branch)) throw Error('Missing science branch: ' + question.id);
const slug=text=>text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function releaseContent(file,text=fs.readFileSync(file,'utf8')){
 const value=JSON.parse(text);
 const merge=(rows,additions)=>{const map=new Map(rows.map(row=>[row.id,row]));for(const row of additions)map.set(row.id,row);return [...map.values()];};
 if(file==='data/evidence.json')return JSON.stringify(merge(value,accepted.evidence));
 if(file==='src/data/characters.json'){
  const rows=merge(value,accepted.people);
  for(const pair of accepted.meaning.filter(row=>row.targetCollection==='people')){const row=rows.find(row=>row.id===pair.targetId);if(!row||row.summary!==pair.original)throw Error('Meaning target changed: '+pair.id);row.summary=pair.record.summary;}
  return JSON.stringify(rows);
 }
 if(file==='data/stories.json'){
  for(const pair of accepted.meaning.filter(row=>row.targetCollection==='stories')){const row=value.flatMap(group=>group.stories.map(row=>({row,id:slug(group.book)+'-'+slug(row.title)}))).find(row=>row.id===pair.targetId)?.row;if(!row||row.summary!==pair.original)throw Error('Meaning target changed: '+pair.id);row.summary=pair.record.summary;}
  return JSON.stringify(value);
 }
 if(file==='data/timeline-events.json')return JSON.stringify({...value,events:merge(value.events,accepted.timeline)});
 if(file==='src/data/character-reference-ids.json')return JSON.stringify({...value,...Object.fromEntries(accepted.people.map(row=>[row.id,row.reference_binding.reference_id]))});
 return text;
}
export const releaseJsonPlugin={name:'rc1-accepted-json',setup(build){build.onLoad({filter:/\/(?:characters|character-reference-ids)\.json$/},args=>({contents:releaseContent(args.path.endsWith('/characters.json')?'src/data/characters.json':'src/data/character-reference-ids.json'),loader:'json'}));}};
export function releaseReferences(people,relationships){
 const profiles=JSON.parse(releaseContent('src/data/characters.json'));
 const ids=JSON.parse(releaseContent('src/data/character-reference-ids.json'));
 const controlled=new Set(accepted.people.map(row=>row.reference_binding.reference_id));
 const edges=relationships.filter(row=>!controlled.has(row.source_id)&&!controlled.has(row.target_id));
 const types={parents:'child',children:'parent',spouses:'spouse',siblings:'sibling'};
 for(const profile of accepted.people)for(const link of profile.lineage_bindings.links){const target=ids[link.profile_id];if(!target)throw Error('Missing explicit family target '+link.profile_id);edges.push({source_id:ids[profile.id],target_id:target,relationship_type:types[link.relation]});}
 const summaries=new Map(profiles.map(row=>[ids[row.id],row.summary]));
 return {people:people.map(row=>summaries.has(row.id)?{...row,summary:summaries.get(row.id)}:row),relationships:edges};
}
