import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=file=>fs.readFileSync(file,'utf8'),source=read('src/atlas-explore.js');
const artwork=JSON.parse(read('src/assets/explore-renditions.json')).images;
const catalog=JSON.parse(read('data/stories.json')),images=JSON.parse(read('data/story-images.json'));
const selection=source.slice(source.indexOf(' const journeys='),source.indexOf(' const routeScope='));
const slug=value=>value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function choose(random,storage){
 const math=Object.create(Math);math.random=()=>random;
 return vm.runInNewContext('(()=>{'+selection+'return {journeys,journeyKey,featuredJourney};})()',{window:{sessionStorage:storage},Math:math});
}
const options=choose(0).journeys;
assert.equal(options.length,4);assert.equal(new Set(options.map(j=>j.href)).size,options.length);
for(const journey of options){
 const group=catalog.find(g=>g.stories.some(story=>story.title===journey.title));assert(group,'Journey exists in the story catalog: '+journey.title);
 assert.equal(journey.href,'#stories/'+slug(group.book)+'/'+slug(journey.title));
 const art=artwork[journey.art];assert(art,'Journey has optimized artwork');
 if(journey.art==='hero')assert.equal(art.source,'chapter-genesis-07-v1.webp','The existing flood scene stays attached to Noah');
 else assert.equal('/assets/'+art.source,images[journey.title].src,'Artwork matches the destination story');
 for(const size of ['small','large'])assert(fs.existsSync('src/assets/'+art[size].file));
}
for(const [index,journey]of options.entries()){
 assert.equal(choose((index+.5)/options.length).featuredJourney.href,journey.href,'Every candidate can be selected');
 for(const random of [0,.25,.5,.75,.999999]){
  let saved;const next=choose(random,{getItem:()=>journey.href,setItem:(key,value)=>saved={key,value}});
  assert.notEqual(next.featuredJourney.href,journey.href,'Reload excludes the previous selection');assert.equal(saved.key,next.journeyKey);assert.equal(saved.value,next.featuredJourney.href);
 }
}
for(const storage of [undefined,{getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}},{getItem:()=>null,setItem(){throw Error('quota');}},{getItem:()=> 'obsolete-journey',setItem(){}}]){
 assert.equal(choose(0,storage).featuredJourney.href,options[0].href,'Unavailable, empty or obsolete session storage has a usable fallback');
 assert.equal(choose(.999999,storage).featuredJourney.href,options.at(-1).href);
}
let markup='',randomCalls=0,writes=0;
const input={addEventListener(){}},form={},status={};
const host={set innerHTML(value){markup=value;},querySelector:selector=>({'#ux-explore-search':input,'#ux-explore-search-form':form,'#ux-explore-search-status':status}[selector]),querySelectorAll:()=>[]};
const math=Object.create(Math);math.random=()=>{randomCalls++;return .6;};
const built=source.replace('/*__EXPLORE_RENDITIONS__*/{}',JSON.stringify(artwork));
const header=built.slice(built.indexOf(' const host='),built.indexOf(' function updateCounts()'));
const render=built.slice(built.indexOf(' function render(){'),built.indexOf(" fetch('/collection-counts"));
const fixture=vm.runInNewContext('(()=>{'+header+render+'return {render,scope:value=>scope=value,featuredJourney};})()',{document:{getElementById:()=>host},location:{hash:'#discover'},URLSearchParams,Math:math,window:{sessionStorage:{getItem:()=>null,setItem(){writes++;}}}});
fixture.render();const first=markup,selected=fixture.featuredJourney,art=artwork[selected.art];
assert(markup.includes('<small>Featured Story</small>'));assert(!markup.includes('Begin Journey')&&!markup.includes('explore-hero-cta'),'The full featured card stays linked without a separate CTA');
assert(markup.includes('class="browse-feature" href="'+selected.href+'"'));assert(markup.includes('<strong>'+selected.title.toUpperCase()+'</strong>'));
assert(markup.includes('data-explore-image="hero" data-explore-src="/assets/'+art.small.file+'"'));
assert(!/<img\s+src=/.test(markup),'Selected hero retains deferred loading');
fixture.render();assert.equal(markup,first,'Counts do not change the feature');
fixture.scope('evidence');fixture.render();assert(!markup.includes('class="browse-feature"'));
fixture.scope('all');fixture.render();assert.equal(markup,first,'Evidence scope navigation preserves the selected title, link and image');
assert.equal(randomCalls,1,'One random choice per document');assert.equal(writes,1,'Navigation does not rewrite selection storage');
console.log('PASS: four catalog-matched journeys and responsive images; every choice reachable; reload avoids immediate repeats; absent/blocked/quota/obsolete session storage stays usable; one choice per document; count updates and scope navigation keep title, image and destination together.');
