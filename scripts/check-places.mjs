import {searchPlaces} from '../src/places-directory.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parsePlaces,createPlaceMatcher,wrapLocationNames,getLocationDetails,loadPlaces,atlasDescription} from '../src/places-core.js';
import {placePreviewGeometry,placePreviewSVG} from '../src/place-map-preview.js';
import {createPersonMatcher,wrapReferenceNames} from '../src/people-links.js';
const places=parsePlaces(JSON.parse(fs.readFileSync('data/reference/places.json','utf8'))),match=createPlaceMatcher(places);
assert.equal(places.size,1298);
assert.equal(match('The Lord put Rahab straight before Israel.').length,0,'Do not turn people, tribes or common words into geographic claims');
assert.equal(match('Let there be light; and there was light.').length,0,'Ordinary words must not become location chips');
assert.equal(match('pillars and judgment. Pillars support the roof. Judgment is given. Salt and beer.').length,0);
assert.equal(match('jericho and egypt').length,0,'Lowercase ordinary words must not become claims');
assert.equal(match('India and Egypt and Jericho').length,3,'Confirmed place types and the sourced India region remain available');
assert.equal(match('Madmen went out. The Arab spoke.').length,0,'Sentence capitalization alone cannot disambiguate ordinary words');
const storyContext={scope:'story',book:0,chapter:11,verse:27,endChapter:12,endVerse:9};
assert.equal(match('Abram’s family leaves Ur for Haran.',storyContext).find(hit=>hit.label==='Ur')?.id,'recgQtoCtBjbsPwAw');
assert.equal(match('Terah takes Abram from Ur toward Canaan.',storyContext).find(hit=>hit.label==='Ur')?.id,'recgQtoCtBjbsPwAw');
assert.equal(match('Ur, father of Eliphalet.',storyContext).filter(hit=>hit.label==='Ur').length,0,'Personal-name use must remain unlinked');
assert.equal(match('They travel from Ur.').length,0,'The short-name exception is narrative-only');
assert.equal(match('Ur of the Chaldees',storyContext).length,1,'Prefer the existing full place name without nested chips');
const matchPeople=createPersonMatcher(JSON.parse(fs.readFileSync('data/reference/people.json','utf8')));
const abramStory=JSON.parse(fs.readFileSync('data/stories.json','utf8'))[0].stories.find(story=>story.title==='The Call of Abram').summary;
const linkedStory=wrapReferenceNames(abramStory,match,matchPeople,storyContext);
for(const [label,id,count] of [['Haran','recyuzIRhPm1IFEu0',2],['Canaan','recRxBBePxyyV6TFO',3],['Ur','recgQtoCtBjbsPwAw',2]]){
 assert.equal((linkedStory.match(new RegExp('data-place-id="'+id+'"','g'))||[]).length,count,label+' resolves to the geographical record in narrative movement/residence phrases');
 assert(!new RegExp('class="person-chip"[^>]*>'+label+'</button>').test(linkedStory),label+' must not be linked as a person in this story');
}
const personalMentions=wrapReferenceNames('Terah is the father of Haran. Noah curses Canaan.',match,matchPeople,{scope:'story',book:0,chapter:9,verse:1,endChapter:12,endVerse:9});
assert(!personalMentions.includes('data-place-id='),'Genealogy and personal actions are not locations');
assert(/class="person-chip"[^>]*>Canaan<\/button>/.test(personalMentions));
const pendingPlaces=wrapReferenceNames(abramStory,()=>[],matchPeople,{...storyContext,placesReady:false});
assert(!/class="person-chip"[^>]*>(?:Haran|Canaan)<\/button>/.test(pendingPlaces),'Do not publish a provisional personal link while place data is loading');
assert.equal(match(' from Ur toward Canaan.',{...storyContext,leadingText:'Terah takes Abram, Sarai and Lot'})[0]?.id,'recgQtoCtBjbsPwAw','Existing person links do not erase the preceding movement context');
const jericho=[...places.values()].find(p=>p.name==='Jericho');assert.deepEqual(jericho.coordinates,{latitude:31.8700465,longitude:35.443876});
assert.equal(jericho.modern_name,null);assert(!/\]\(/.test(jericho.description));
assert.equal(match('Jericho, JERICHO; notJericho')[0].id,jericho.id);assert.equal(match('Jericho, JERICHO; notJericho').length,2);
const fixture=parsePlaces([{id:'a',name:'Sea of Galilee',featureType:'Water',aliases:['Galilee sea'],modern_name:'Lake Kinneret',latitude:0,longitude:0},{id:'b',name:'Galilee',featureType:'Region'},{id:'c',name:'Bethany',featureType:'City'},{id:'d',name:'Bethany',featureType:'City'},{id:'e',name:'Missing',latitude:'',longitude:'12'},{id:'f',name:'Invalid',latitude:91,longitude:0},{id:'g',name:'Unknown',latitude:null,longitude:null}]);
assert.deepEqual(fixture.get('a').coordinates,{latitude:0,longitude:0});assert.equal(fixture.get('a').modern_name,'Lake Kinneret');
for(const id of ['e','f','g'])assert.equal(fixture.get(id).coordinates,null);
const fm=createPlaceMatcher(fixture);assert.equal(fm('Sea of Galilee')[0].id,'a');assert.equal(fm('Galilee sea')[0].id,'a');assert.equal(fm('Bethany').length,0);
const html=wrapLocationNames('<script>alert("x")</script> Jericho & Jericho',match);assert(!html.includes('<script>'));assert.equal((html.match(/data-place-id/g)||[]).length,2);assert(html.includes('&amp;'));
assert(wrapLocationNames(['Jericho','Unknown'],match).includes('</button>, Unknown'));
let calls=0;globalThis.fetch=async()=>{calls++;if(calls===1)throw Error('offline');return {ok:true,json:async()=>[{id:'a',name:'Jericho'}]};};
await assert.rejects(loadPlaces(),/offline/);const [a,b]=await Promise.all([getLocationDetails('a'),getLocationDetails('a')]);assert.equal(a,b);assert.equal(calls,2);assert.equal(await getLocationDetails('absent'),null);
const htmlSource=fs.readFileSync('src/index.html','utf8'),build=fs.readFileSync('scripts/build.mjs','utf8');assert(htmlSource.includes('id="atlas-sheet"'));assert(build.includes("['places','places-provenance']"));
const style=JSON.parse(fs.readFileSync('src/data/atlas-style.json','utf8'));
const allowedLayers=new Set(['water','waterway','water_name','boundary','place']);
assert(style.layers.every(layer=>layer.type==='background'||allowedLayers.has(layer['source-layer'])),'Atlas must omit roads, buildings, terrain and modern POIs');
assert(Object.values(style.sources).every(source=>source.type==='vector'),'No terrain raster sources');
assert(style.sources.openmaptiles.attribution.includes('OpenStreetMap'));
for(const layer of style.layers.filter(layer=>layer.type==='symbol'))assert.deepEqual(layer.layout['text-field'],['coalesce',['get','name:en'],['get','name_en'],['get','name:latin'],'']);
assert(build.includes("'maplibre-gl-worker.mjs'"),'Ship the local map worker on both platforms');
assert(htmlSource.includes('/vendor/MAPLIBRE-LICENSE.txt'));
console.log('Places checks passed: dataset, aliases, boundaries, ambiguity, coordinates, escaping, fetch retry and cache.');

assert.equal(searchPlaces(places).length,places.size-5,'Possessive source aliases resolve through their canonical places');
assert.equal(searchPlaces(places,'  PROMISED LAND  ')[0].name,'Canaan','Search location aliases without case sensitivity');
assert.equal(searchPlaces(places,'Jericho')[0].name,'Jericho','Exact place names sort first');
assert.equal(searchPlaces(places,'not-a-real-place-name').length,0);
const accented=new Map([['accent',{id:'accent',name:'Élodie',aliases:['A friendly place'],modern_name:'Modern name'}]]);
assert.equal(searchPlaces(accented,'elodie')[0].id,'accent');
assert.equal(searchPlaces(accented,'friendly place')[0].id,'accent');
console.log('PASS: Places directory search, aliases, accent folding, exact matches and empty results.');

assert.equal(atlasDescription({description:'region'}),'');
assert.equal(atlasDescription({description:'City.'}),'');
assert.equal(atlasDescription({description:'A region mentioned in Genesis.'}),'A region mentioned in Genesis.');
assert.equal(atlasDescription({description:''}),'');
console.log('PASS: atlas hides generic feature labels while preserving meaningful descriptions.');

const adam=[...places.values()].find(place=>place.name==='Adam');
const preview=placePreviewGeometry(adam);
assert(Math.abs(preview.point[0]-300)<1e-8&&Math.abs(preview.point[1]-140)<1e-8);assert(preview.land.length);assert(preview.water.length,'The regional preview retains nearby lakes');
assert.equal(placePreviewGeometry({coordinates:null}),null);assert.equal(placePreviewSVG({coordinates:null}),'');
assert(!placePreviewSVG({...adam,name:'<img onerror="bad">'}).includes('<img'));
for(const place of places.values())if(place.coordinates){
 const geometry=placePreviewGeometry(place);
 assert(geometry.bounds.west>=-24&&geometry.bounds.east<=100&&geometry.bounds.south>=-4&&geometry.bounds.north<=64,'Vendored geometry covers the reference point: '+place.name);
 assert(placePreviewSVG(place).length<30000,'Each preview stays compact: '+place.name);
}
console.log('PASS: narrative Ur links preserve ambiguity safeguards; real map previews cover every reference point, escape labels and keep unknown coordinates empty.');
const prefixPlaces=new Map([
 ['alias',{id:'alias',name:'A location',aliases:['King road'],modern_name:''}],
 ['inner',{id:'inner',name:'Baking',aliases:[],modern_name:''}],
 ['primary',{id:'primary',name:'Kadesh',aliases:[],modern_name:''}],
 ['word',{id:'word',name:'Old Kadesh',aliases:[],modern_name:''}],
]);
assert.deepEqual(searchPlaces(prefixPlaces,'K').map(place=>place.id),['primary','word','alias']);
assert.deepEqual(searchPlaces(prefixPlaces,'king').map(place=>place.id),['alias'],'No substring match in Baking');
console.log('PASS: UX2 Places primary prefix/word-start ranking ahead of displayed aliases, without inner substrings.');
