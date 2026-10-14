import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync('src/reader.js','utf8'),handlers={},moves=[];
function button(id){return{id,classes:new Set(),attrs:{},addEventListener:(name,fn)=>handlers[id+':'+name]=fn,setAttribute(k,v){this.attrs[k]=v},classList:{contains(){return this.owner.classes.has('revealed')},add(){this.owner.classes.add('revealed')},remove(){this.owner.classes.delete('revealed')}}};}
const prev=button('edge-prev'),next=button('edge-next');prev.classList.owner=prev;next.classList.owner=next;
const context={$:selector=>selector==='#edge-prev'?prev:next,document:{addEventListener:(name,fn)=>handlers['document:'+name]=fn},clearTimeout(){},setTimeout(){return 1},moveChapter:d=>moves.push(d)};
vm.createContext(context);vm.runInContext(source.slice(source.indexOf('// Edge controls'),source.indexOf('// The category tray')),context);
handlers['edge-next:click']();assert(next.classes.has('revealed'));assert.equal(moves.length,0);assert.equal(next.attrs['aria-label'],'Next chapter');
handlers['edge-next:click']();assert.equal(moves.pop(),1);assert(!next.classes.has('revealed'));
handlers['edge-prev:click']();assert(prev.classes.has('revealed'));assert(!next.classes.has('revealed'));
handlers['document:pointerdown']({target:{closest:()=>null}});assert(!prev.classes.has('revealed'));
assert(!source.includes('touchstart')&&!source.includes('chapterSwipeDirection'),'Swipe navigation must be removed');
assert(source.includes("['#prev-bottom','#edge-prev']")&&source.includes("['#next-bottom','#edge-next']"),'Edge controls must share chapter boundary state');
console.log('PASS: edge pagination reveals before navigation, hides on outside tap, and replaces swipe navigation.');
