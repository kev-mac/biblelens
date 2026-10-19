import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
// Exercise detached and late-loaded cards while retaining their original nodes/listeners.
class Node {
 constructor(tag){this.tagName=tag;this.nodeType=1;this.childNodes=[];this.open=false;this.attributes={};}
 append(...nodes){for(const node of nodes){if(node.parent){node.parent.childNodes.splice(node.parent.childNodes.indexOf(node),1);}node.parent=this;this.childNodes.push(node);}}
 querySelector(selector){return selector.startsWith('.character-summary')?this.summary||null:this.title||null;}
 querySelectorAll(){return this.cards||[];}
 matches(){return !!this.isCard;}
 setAttribute(key,value){this.attributes[key]=value;}
 hasAttribute(key){return key in this.attributes;}
}
const events={},body=new Node('body'),observed=[],opened=new Node('details'),evidence=new Node('div'),toggle=new Node('button');
toggle.attributes['data-summary-expand']='';opened.open=true;
const context={WeakSet,document:{body,createElement:tag=>new Node(tag),querySelectorAll:selector=>selector.includes('character-detail-toggle')?[]:selector.includes('details[open]')?[opened]:selector==='.comparison-evidence'?[evidence]:[toggle]},window:{addEventListener:(type,fn)=>{events[type]=fn;}},comparisonEvidenceOpen:new Set(['marked:0:test']),MutationObserver:class{constructor(fn){observed.push(fn);}observe(){}}};
vm.createContext(context);vm.runInContext(fs.readFileSync('src/card-disclosures.js','utf8'),context);
function card(){const node=new Node('article'),title=new Node('h2'),body=new Node('p');title.listener=()=>42;node.isCard=true;node.title=title;node.summary=body;node.append(title,body);return {node,title,body};}
const initial=card();body.cards=[initial.node];events.DOMContentLoaded();
const preview=initial.node.childNodes[0],disclosure=initial.node.childNodes[1];assert.equal(disclosure.tagName,'details');assert.equal(disclosure.open,false);assert.equal(preview.childNodes[0],initial.title);assert.equal(preview.childNodes[1],initial.body,'Summary stays visible outside the collapsed disclosure');assert.equal(initial.title.listener(),42);assert.equal(disclosure.childNodes[1].childNodes.length,0);
context.collapseDirectoryCard(initial.node);assert.equal(initial.node.childNodes.length,2,'Hydration cannot duplicate a card');
const late=card();observed[0]([{addedNodes:[late.node]}]);assert.equal(late.node.childNodes[1].tagName,'details','Search and pagination results also start closed');
events.viewchange();assert.equal(opened.open,false);assert.equal(evidence.hidden,true);assert.equal(context.comparisonEvidenceOpen.size,0);assert.equal(toggle.attributes['aria-expanded'],'false');
assert(!fs.readFileSync('src/card-disclosures.js','utf8').split('const collapsedCards=')[0].includes('.commandment-card'),'Commandments have no Details disclosure');
const html=fs.readFileSync('src/index.html','utf8');assert.match(html,/<details id="atlas-sources" class="atlas-sources"><summary>Sources<\/summary>/);assert(!/<details id="atlas-sources"[^>]*\bopen\b/.test(html));assert(html.indexOf('id="atlas-description"')<html.indexOf('id="atlas-sources"'),'Place summary stays visible before Sources');
const places=fs.readFileSync('src/places.js','utf8');assert.match(places,/querySelector\('#atlas-sources'\)\.open=false/);
console.log('PASS: initial/dynamic cards start closed, preserve interactive nodes, avoid duplicate wrapping, reset on navigation, and Places Sources starts closed per opening.');
