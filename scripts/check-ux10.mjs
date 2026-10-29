import assert from 'node:assert/strict';
import fs from 'node:fs';
import {linkPeopleStories} from '../src/story-people.js';
import {parsePlaces} from '../src/places-core.js';
const read=file=>JSON.parse(fs.readFileSync(file));
const people=read('data/reference/people.json'),books=read('data/books.json'),stories=read('data/stories.json');
const linked=linkPeopleStories(people,stories,books),elisha=linked.find(p=>p.name==='Elisha');
assert.equal(elisha.linked_stories.length,8);assert(elisha.linked_stories.some(s=>s.title==='Elijah Taken Up'&&s.passage==='2 Kings 1:1 - 2:25'));
assert.deepEqual(linkPeopleStories([{name:'Elisha',aliases:[],refs:[[0,1,1]]}],stories,books)[0].linked_stories,[],'Name alone cannot link a story');
assert.deepEqual(linkPeopleStories([{name:'Not a Participant',aliases:[],refs:[[11,2,1]]}],stories,books)[0].linked_stories,[],'Passage overlap alone cannot name a participant');
for(const person of linked)for(const anchor of person.linked_stories){const group=stories.find(group=>group.stories.some(s=>s.title===anchor.title&&s.passage===anchor.passage));assert(group);assert.equal(anchor.route,'#stories/'+anchor.story_id.replace(new RegExp('^'+group.book.toLowerCase().replaceAll(' ','-')+'-'),group.book.toLowerCase().replaceAll(' ','-')+'/'));}
const places=parsePlaces(read('data/reference/places.json'));for(const row of read('data/reference/place-coordinate-exclusions.json').excludedCoordinates)assert.equal(places.get(row.id).coordinates,null);
assert.equal(read('data/reference/place-coordinate-exclusions.json').excludedCoordinates.length,13);
assert.equal(read('package.json').buildNumber,279);
const web=read('dist/client/release.json'),mobile=read('www/release.json');assert.match(web.sourceHash,/^[a-f0-9]{64}$/);assert.equal(web.sourceHash,mobile.sourceHash);assert.equal(web.draftOnly,undefined);assert.equal(mobile.draftOnly,undefined);assert.equal(web.buildNumber,279);assert.equal(mobile.buildNumber,279);
const production=read('www/reference/people.json'),jesus=production.find(p=>p.sourceRecord==='jesus_905');assert(!jesus.summary&&!jesus.description,'Jesus draft must stay outside production');
for(const dir of ['www/gemini','www/mock'])assert(fs.existsSync(dir));
console.log('PASS UX10: real story participants plus passage overlap, eight Elisha links, source story routes, 13 unknown locations, build 279, matching web/native fingerprints, no Jesus draft in production, preserved owner previews.');
