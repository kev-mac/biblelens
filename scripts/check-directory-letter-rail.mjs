import assert from 'node:assert/strict';
import {createDirectoryLetterRail} from '../src/directory-letter-rail.js';

class Element {
 constructor(){this.children=[];this.dataset={};this.attributes={};this.style={setProperty(){}};this.hidden=false;}
 append(...children){for(const child of children){child.parent=this;this.children.push(child);}}
 setAttribute(key,value){this.attributes[key]=value;}
 contains(target){return target===this||this.children.some(child=>child.contains(target));}
 focus(){document.activeElement=this;}
 click(){this.onclick?.({detail:0});}
 setPointerCapture(){}
 getClientRects(){return [{}];}
 getBoundingClientRect(){const top=100+(this.parent?.className==='directory-letter-rail'?this.parent.children.indexOf(this)*20:0);return {top,bottom:top+20};}
 querySelectorAll(){return [];}
 querySelector(){return null;}
}
const documentEvents={},windowEvents={},timers=new Map(),frames=[];
let now=0,nextTimer=0;
globalThis.document={createElement:()=>new Element(),documentElement:{},addEventListener:(type,fn)=>documentEvents[type]=fn};
globalThis.window={addEventListener:(type,fn)=>windowEvents[type]=fn};
globalThis.getComputedStyle=()=>({scrollPaddingTop:'88px'});
globalThis.ResizeObserver=class{observe(){}};
globalThis.requestAnimationFrame=fn=>{frames.push(fn);return frames.length;};
globalThis.setTimeout=(fn,delay)=>{const id=++nextTimer;timers.set(id,{fn,time:now+delay});return id;};
globalThis.clearTimeout=id=>timers.delete(id);
const advance=ms=>{now+=ms;for(const [id,timer]of [...timers])if(timer.time<=now){timers.delete(id);timer.fn();}};
const jumps=[],host=new Element(),list=new Element();
const controller=createDirectoryLetterRail(host,list,'People',letter=>jumps.push(letter));
controller.update(['Adam','Moses','Sarah']);
while(frames.length)frames.shift()();
const [edge,rail,preview]=controller.element.children;
const press=()=>({button:0,pointerId:1,clientX:390,clientY:350,currentTarget:edge,preventDefault(){}});
assert(rail.hidden&&preview.hidden,'Browsing starts with no rail or center letter');
edge.onpointerdown(press());advance(449);assert(rail.hidden);edge.onpointerup();advance(1000);assert.equal(jumps.length,0,'A quick edge tap never jumps');
edge.onpointerdown(press());advance(450);assert(!rail.hidden&&!preview.hidden);assert.equal(preview.textContent,'M');assert.equal(jumps.at(-1),'M');
edge.onpointermove({...press(),clientY:470});assert.equal(preview.textContent,'S');assert.equal(jumps.at(-1),'S');
edge.onpointerup();assert(rail.hidden&&preview.hidden,'Release hides the rail and letter');
const before=jumps.length;
edge.onpointerdown(press());edge.onpointermove({...press(),clientY:375});advance(450);assert(rail.hidden);assert.equal(jumps.length,before,'Movement before the hold cancels activation');edge.onpointerup();
edge.onpointerdown(press());edge.onpointercancel();advance(450);assert(rail.hidden);assert.equal(jumps.length,before,'A canceled pointer cannot open later');
edge.onclick({detail:0});assert(!rail.hidden,'Keyboard activation remains available');
documentEvents.keydown({key:'Escape'});assert(rail.hidden);
edge.onpointerdown(press());advance(450);windowEvents.viewchange();assert(rail.hidden&&preview.hidden,'Navigation clears an active hold');
controller.update(['Sarah']);assert(rail.children.filter(button=>!button.disabled).every(button=>button.dataset.letter==='S'));
console.log('PASS: delayed edge activation, slide selection, center letter, release, short-tap/movement cancellation, keyboard access, navigation cleanup and filtered letters.');
