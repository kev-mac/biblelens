import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync('src/app.js','utf8');
const parent={setAttribute(key,value){this[key]=value;}};
const contextNode={dataset:{passage:'Genesis 15 · KJV',description:'God’s Covenant with Abram'},parentElement:parent,children:[],set textContent(text){this.text=text;this.children=[];},append(node){this.children.push(node);}};
let rect={top:80,bottom:145};
const context={view:'read',location:{hash:'#read'},window:{innerHeight:800},document:{title:'Read · BibleLens',querySelector:()=>({getBoundingClientRect:()=>({bottom:48})}),createElement:()=>({})},$:selector=>selector==='#header-context'?contextNode:{getBoundingClientRect:()=>rect,setAttribute(){}}};
vm.createContext(context);
vm.runInContext(source.slice(source.indexOf('function updateHeaderContext(){'),source.indexOf('let headerContextFrame=0;')),context);
const update=()=>vm.runInContext('updateHeaderContext()',context);
update();assert.equal(contextNode.text,'Read');assert.equal(contextNode.children.length,0);
rect={top:-50,bottom:49};update();assert.equal(contextNode.text,'Read','Partially visible description still supplies page context');
rect={top:-50,bottom:48};update();assert.equal(contextNode.text,'Genesis 15 · KJV');assert.equal(contextNode.children[0].textContent,contextNode.dataset.description);
rect={top:80,bottom:145};update();assert.equal(contextNode.text,'Read','Returning to the heading restores Read');assert.equal(contextNode.children.length,0);
context.view='characters';rect={top:-50,bottom:0};update();assert.equal(contextNode.text,'People');assert.equal(contextNode.children.length,0);
context.view='evidence';context.location.hash='#evidence/academic';update();assert.equal(contextNode.text,'Evidence · Academic');
console.log('PASS: reader header follows title/description visibility, returns to Read, and preserves other page contexts.');

// Category cards must keep their icons after the legacy header is removed.
const html=fs.readFileSync('src/index.html','utf8');
assert.equal((html.match(/<header\b/g)||[]).length,2,'The live masthead and dedicated Stories collection header remain');
assert(!html.includes('id="reader-picker"'),'No hidden Settings proxy remains');
const template=/<template id="navigation-icons">([\s\S]*?)<\/template>/.exec(html)?.[1];
assert(template,'The live masthead hosts inert navigation icons');
const iconNodes=new Map([...template.matchAll(/(<svg data-navigation-icon="([^"]+)"[\s\S]*?<\/svg>)/g)].map(([,outerHTML,key])=>[key,{outerHTML}]));
const iconContext=vm.createContext({document:{querySelector(selector){
 assert.equal(selector,'#navigation-icons','Icons come from the live template, not removed header buttons');
 return {content:{querySelector(selector){return iconNodes.get(/data-navigation-icon="([^"]+)"/.exec(selector)?.[1]);}}};
}}});
const reader=fs.readFileSync('src/reader.js','utf8');
vm.runInContext(reader.slice(reader.indexOf('function categoryIcon('),reader.indexOf('function comparisonIcon(')),iconContext);
for(const key of ['stories','characters','prophecies'])assert.match(iconContext.categoryIcon(key),/^<svg[\s\S]*<\/svg>$/);
console.log('PASS: live masthead and collection header, direct Settings trigger and retained category icons.');
