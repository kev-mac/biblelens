import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {addUX13Events} from './ux13-content.mjs';
import {assess,words} from './check-readability.mjs';
const catalog=addUX13Events(JSON.parse(fs.readFileSync('data/stories.json'))).flatMap(g=>g.stories).filter(s=>s.title!=='Parallel Accounts in Genesis');
const excerpts=JSON.parse(fs.readFileSync('data/story-excerpts.json'));
assert.equal(Object.keys(excerpts).length,catalog.length);
for(const story of catalog){
 const text=excerpts[story.title];assert.equal(typeof text,'string',story.title);
 assert(words(text).length>=24&&words(text).length<=44,story.title+' excerpt length');
 assert(!story.summary.startsWith(text),story.title+' duplicates narrative opener');
 const first=story.summary.match(/^.*?[.!?](?:\s|$)/)?.[0].trim();
 assert(!text.startsWith(first),story.title+' copies first sentence');
 for(const sentence of story.summary.split(/(?<=[.!?])\s+/)){if(words(sentence).length>4)assert(!text.includes(sentence),story.title+' copies a full narrative sentence');}
 assert(!assess(text).tooLong,story.title+' excerpt sentence too long');
}
const source=fs.readFileSync('src/stories.js','utf8');
assert(source.includes('STORY_EXCERPTS[story.title]'));
assert(!source.includes('class="story-footer"'));
assert(!source.includes('class="story-linked-meta"'));
assert(!source.includes('Open story'));
assert(source.includes('class="story-expand-icon"')&&source.includes('class="story-collapse-icon"'));
assert(!source.includes('class="story-entities"'),'Removed people/place footer is not rendered');
// Check the shared renderer, including topic pivots and auto-expanded direct routes.
const renderer=vm.createContext({window:{},location:{hash:'#stories'},esc:String,readRef:()=>null,passagePillText:refs=>refs.join(', ')});
vm.runInContext(source.slice(0,source.indexOf('async function renderStoriesView')),renderer);
for(const hash of ['#stories','#stories/genesis/cain-and-abel']){
 renderer.location.hash=hash;
 for(const story of catalog)for(const pivot of [false,true]){
  renderer.story=story;renderer.pivot=pivot;
  const html=vm.runInContext('storyCard(story,pivot)',renderer);
  const disclosureStart=html.indexOf('<details class="story-full-details"');
  const disclosureEnd=html.lastIndexOf('</details>');
  const action=html.indexOf('>Read story</button>');
  assert(action>disclosureStart&&action<disclosureEnd,story.title+' read action must be inside the disclosure');
  assert.equal(html.match(/>Read story<\/button>/g)?.length,1);
  assert(!html.includes('class="story-entities"'),story.title+' has no people/place footer');
  assert.equal(html.slice(disclosureStart,html.indexOf('>',disclosureStart)).includes(' open'),!pivot&&hash!=='#stories');
 }
}

const cain=catalog.find(s=>s.title==='Cain and Abel');
const cainSequence=[/Abel (?:keeps|tends) sheep/,/Cain (?:attacks and )?kills Abel/,/protective (?:mark|sign)/].map(pattern=>cain.summary.search(pattern));
assert(cainSequence.every(index=>index>=0),'Cain narrative retains the occupations, killing and protective sign');
assert(cainSequence[0]<cainSequence[1]&&cainSequence[1]<cainSequence[2],'Cain narrative remains in passage order');
console.log('PASS: '+catalog.length+' independent excerpts, compact actions, disclosure icons and Cain narrative order.');
