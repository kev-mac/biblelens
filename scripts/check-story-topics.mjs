import assert from 'node:assert/strict';
import {genericTopics,mergeStoryTopics,referenceVerses,passageReference,loadTopicOptions,tagStoryCatalog} from './story-topics.mjs';
import fs from 'node:fs';
const options={books:[{id:0,name:'Genesis'},{id:1,name:'Exodus'}],chapters:{'0:37':[1,2,3],'0:38':[1,2,3],'0:50':[25,26],'1:1':[1]}};
const topic=(label,refs)=>({label,refs:[...refs,[1,1,1,0,0]]});
const topics=[topic('JEALOUSY',[[0,37,2,0,0]]),topic('FAMILY',[[0,38,0,0,0]]),topic('GOD',[[0,37,2,0,0]]),topic('OUTSIDE',[[0,50,26,0,0]])];
const stories=[{title:'Joseph',summary:'Family jealousy',passage:'Genesis 37:2-38:2'}];
const merged=mergeStoryTopics(stories,topics,options);
assert(merged[0].topics.includes('JEALOUSY'));assert(merged[0].topics.includes('FAMILY'));assert(!merged[0].topics.includes('GOD'));assert(!merged[0].topics.includes('OUTSIDE'));assert(!('topics' in stories[0]));
assert.deepEqual(referenceVerses([0,38,0,0,0],options.chapters),['0:38:1','0:38:2','0:38:3']);
assert.deepEqual(referenceVerses([0,37,2,38,2],options.chapters),['0:37:2','0:37:3','0:38:1','0:38:2']);
assert.deepEqual(passageReference('Genesis 37:1-50:26',options.books),[0,37,1,50,26]);
assert.throws(()=>passageReference('Genesis 38:2-37:1',options.books));
assert.equal(mergeStoryTopics(stories,topics,{...options,maxTopics:1})[0].topics.length,1);
const catalog=JSON.parse(fs.readFileSync('data/stories.json'));
const topicCatalog=JSON.parse(fs.readFileSync('data/reference/topics.json'));
const topicOptions=loadTopicOptions(), original=structuredClone(catalog);
const suggestions=tagStoryCatalog(catalog,topicCatalog,topicOptions);
assert.deepEqual(tagStoryCatalog(catalog,topicCatalog,topicOptions),suggestions,'Topic suggestions are reproducible');
assert.deepEqual(catalog,original,'Topic suggestions do not mutate the stored catalog');
// Saved browsing tags remain editorial metadata when full-story prose changes.
// Re-ranking suggestions must not silently replace them; verify their grounding instead.
const topicIndex=new Map();
for(const topic of topicCatalog){
 const verses=topicIndex.get(topic.label)||new Set();
 for(const ref of topic.refs)for(const verse of referenceVerses(ref,topicOptions.chapters))verses.add(verse);
 topicIndex.set(topic.label,verses);
}
const blocked=new Set([...genericTopics,...topicOptions.books.map(book=>book.name.toUpperCase()),...topicOptions.people.flatMap(person=>[person.name,person.label,...(person.aliases||[])]).filter(Boolean).map(name=>name.toUpperCase())]);
for(const entry of catalog)for(const story of entry.stories){
 assert(story.topics.length<=5,`${story.title}: at most five saved topics`);
 assert.equal(new Set(story.topics).size,story.topics.length,`${story.title}: unique saved topics`);
 const verses=referenceVerses(passageReference(story.passage,topicOptions.books),topicOptions.chapters);
 for(const label of story.topics){
  assert(!blocked.has(label.toUpperCase())&&!blocked.has(label.replace(/\s*\(.*/, '').toUpperCase()),`${story.title}: specific topic ${label}`);
  assert(topicIndex.has(label),`${story.title}: known topic ${label}`);
  assert(verses.some(verse=>topicIndex.get(label).has(verse)),`${story.title}: topic ${label} intersects the cited passage`);
 }
}
console.log('PASS: Inclusive range and chapter intersections, book isolation, generic filtering, caps, immutable deterministic suggestions and passage-grounded saved topics.');
