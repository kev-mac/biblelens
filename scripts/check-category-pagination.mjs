import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createCategoryCatalog,categoryPage} from '../worker/categories.mjs';
const parse=ref=>{const m=/^(Genesis|Exodus) (\d+):(\d+)$/.exec(ref||'');return m?{book:m[1]==='Genesis'?0:1,chapter:+m[2],verse:+m[3]}:null;};
const source=Array.from({length:70},(_,i)=>({id:'record-'+i,mode:'history',tags:['T'],title:'Record '+i,ref:(i%2?'Exodus':'Genesis')+' 1:'+(i+1),summary:'Public text',status:'Disagrees',sources:[]}));
source.push({id:'qualified',mode:'history',tags:['T','V'],ref:'Genesis 2:1',appliesTo:['Genesis 2:1'],refs:[{label:'Exodus 2:1'}],summary:'Qualified',status:'Disagrees'});
const catalog=createCategoryCatalog(source,[],parse,r=>r.sources||[]);
const request=query=>categoryPage(catalog,new URLSearchParams(query));
assert.equal(request('book=all&limit=0').counts.T,71);
assert.equal(request('book=all&kind=T').records.length,24);
const pages=[0,1,2].flatMap(page=>request('book=all&kind=T&page='+page).records.map(r=>r.key));assert.equal(new Set(pages).size,71);assert.equal(pages.length,71);
assert(request('book=1&kind=T').records.every(r=>r.placements.every(p=>p.book===1)));
assert.equal(request('book=1&chapter=2&kind=V').total,0,'Context placement cannot inherit a key-only violation');
assert.equal(request('book=0&chapter=2&kind=V').total,1);
for(const query of ['book=66','page=-1','limit=1000','kind=notes','chapter=-2'])assert.equal(request(query),null);
assert.deepEqual(request('book=all&limit=0').records,[],'Collapsed categories return counts only');
assert.equal(request('book=all&kind=T&page=999').page,2,'Out-of-range pages are clamped');
console.log('PASS: bounded category pages, counts-only metadata, cross-book paging, scope filters, key-only qualifications and invalid query rejection.');

const directory={stories:[{stories:[{title:'Creation',passage:'Genesis 1:1 - 2:3',summary:'Narrative',cross_references:[]}]}],people:Array.from({length:30},(_,i)=>({id:'person-'+i,name:'Person '+i,refs:[[0,2,i+1],[1,1,1]]})),prophecies:[{id:'test',prediction_passage:'Genesis 1:1',fulfillment_passage:'Exodus 2:1',title:'Linked accounts'}]};
const parseRange=ref=>parse(ref?.split(/ [-–] /)[0]);
const expanded=createCategoryCatalog([],[],parseRange,()=>[],directory);
const browse=query=>categoryPage(expanded,new URLSearchParams(query));
assert.equal(browse('book=0&chapter=2&kind=stories').total,1,'Full story ranges include their closing chapter');
assert.equal(browse('book=1&kind=stories').total,0);
assert.equal(browse('book=all&kind=characters').records.length,24);
assert.equal(browse('book=all&kind=characters&page=1').records.length,6);
assert.equal(browse('book=1&chapter=2&kind=prophecies').total,1,'Linked fulfillment is included');
assert.equal(browse('book=all&kind=prophecies').total,1,'Cross-book links count once');
assert.equal(browse('book=0&chapter=1&kind=characters').total,0,'People respect chapter references');
assert.equal(browse('book=all&limit=0').counts.characters,30);
console.log('PASS: narrative chapter ranges, scoped people pagination and cross-book prophecy links.');

// Category pages preserve scope when opened directly or returned to the index.
const client={URLSearchParams,location:{hash:'#categories/T?book=1&chapter=2&theme=all&type=all'},markedBookSelection:1,markedChapterSelection:2,markedKind:'T',markedTheme:'all',markedCommandmentType:'all',MARKED_CATEGORIES:[['all','All categories'],['T','Translation'],['bookmark','Marked']]};
vm.createContext(client);
vm.runInContext(fs.readFileSync('src/categories.js','utf8').split('async function renderPagedCategories()')[0],client);
assert.equal(client.categoryRoute().key,'T');
assert.equal(client.categoryRoute().params.get('book'),'1');
const resultUrl=client.categoryLocation('T');assert(resultUrl.startsWith('#categories/T?'));assert(resultUrl.includes('chapter=2'));
const backUrl=client.categoryLocation('all',true);assert(backUrl.startsWith('#categories?'));assert(backUrl.includes('book=1'));assert(backUrl.includes('kind=all'));
client.location.hash='#categories/unknown';assert.equal(client.categoryRoute(),null);
console.log('PASS: independent category routes and filter-preserving page/back links.');

// The Categories index must open the original directories, including old bookmarks.
const app=fs.readFileSync('src/app.js','utf8');
const directories={};vm.createContext(directories);
vm.runInContext(app.slice(app.indexOf('const CATEGORY_DIRECTORY_VIEWS='),app.indexOf('function updateHeaderContext()')),directories);
for(const [key,url] of Object.entries({places:'#places',stories:'#stories',characters:'#people',commandments:'#commandments',prophecies:'#prophecies'}))assert.equal(directories.categoryDirectoryLocation(key),url);
assert.equal(directories.categoryDirectoryLocation('academic'),null);
const routes=[];
Object.assign(directories,{location:{hash:'#categories/stories?book=0&chapter=1'},history:{replaceState(_a,_b,url){directories.location.hash=url;}},setView:(...args)=>routes.push(args),window:{scrollTo(){},addEventListener(){}}});
vm.runInContext(app.slice(app.indexOf('function route(){'),app.indexOf('function route(){')+app.slice(app.indexOf('function route(){')).indexOf("window.addEventListener('hashchange',route)")),directories);
for(const [key,view] of Object.entries({places:'places',stories:'stories',characters:'characters',commandments:'commandments',prophecies:'prophecies'})){directories.location.hash='#categories/'+key+'?book=0';directories.route();assert.equal(routes.at(-1)[0],view);assert.equal(directories.location.hash,directories.categoryDirectoryLocation(key));}
assert(!fs.readFileSync('src/categories.js','utf8').includes('class="category-back"'));
console.log('PASS: category links and legacy routes restore the original directory controls without a body back link.');

// Marked profile rendering keeps private note text escaped and existing action references intact.
{
 const profileContext={state:{verseNotes:{'0:1:3':{title:'My note',text:'<private>'}},passageNotes:{},notes:{},noteTitles:{}},books:[{name:'Genesis'}],esc:s=>String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;'),bookmarkVerseTextHtml:()=>'<p data-marked-verse-text="0/1/3">Loading verse text…</p>',noteActionButtons:ref=>'<button data-edit-marked-note="'+ref+'">Edit</button>'};
 vm.createContext(profileContext);
 const categorySource=fs.readFileSync('src/categories.js','utf8');
 vm.runInContext(categorySource.slice(categorySource.indexOf('function categoryPersonalProfile('),categorySource.indexOf('function categoryQuery(')),profileContext);
 const profile=profileContext.categoryPersonalProfile('verse',{book:0,chapter:1,verse:3});
 assert(profile.includes('category-personal-profile'));assert(!profile.includes('passage-saved-card'));
 assert(profile.includes('&lt;private&gt;'));assert(profile.includes('data-edit-marked-note="0/1/3"'));
 assert(profile.includes('data-marked-verse-text="0/1/3"'));assert(profile.includes('aria-expanded="false"'));
 assert(profile.includes('id="personal-verse-0-1-3-note" aria-labelledby="personal-verse-0-1-3-note-toggle" hidden'));
 console.log('PASS: Marked profile cards preserve escaped private notes, text hydration and editor references in initially closed note sections.');
}
