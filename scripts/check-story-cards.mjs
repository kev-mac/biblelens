import fs from 'node:fs';
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
assert(source.includes('class="story-actions"><div class="story-entities"'));
const cain=catalog.find(s=>s.title==='Cain and Abel');
assert(cain.summary.indexOf('Abel keeps sheep')<cain.summary.indexOf('Cain kills Abel'));
assert(cain.summary.indexOf('Cain kills Abel')<cain.summary.indexOf('protective mark'));
console.log('PASS: '+catalog.length+' independent excerpts, compact actions, disclosure icons and Cain narrative order.');
