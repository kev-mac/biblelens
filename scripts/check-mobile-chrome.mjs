import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const styles=new Map(),classes=new Set(),events={},viewportEvents={},timers=new Map();let nextTimer=0,scrolls=0;
class Field {matches(){return true;}closest(){return null;}getBoundingClientRect(){return {top:500,bottom:540,height:40};}}
const viewport={height:810,offsetTop:0,addEventListener(type,fn){viewportEvents[type]=fn;}};
const root={style:{setProperty(k,v){styles.set(k,v);}},classList:{add(c){classes.add(c);},remove(c){classes.delete(c);},contains(){return false;}}};
const document={documentElement:root,activeElement:null,addEventListener(type,fn){events[type]=fn;}};
const context={document,Element:Field,setTimeout(fn){timers.set(++nextTimer,fn);return nextTimer;},clearTimeout(id){timers.delete(id);},window:{visualViewport:viewport,innerHeight:810,matchMedia:()=>({matches:true}),addEventListener(){},scrollBy(){scrolls++;}}};
vm.runInNewContext(fs.readFileSync('src/mobile.js','utf8'),context);
assert.equal(styles.get('--visual-offset-top'),'0px');
const field=new Field();document.activeElement=field;events.focusin({target:field});assert(classes.has('mobile-editing'));
viewport.offsetTop=120;viewport.height=390;viewportEvents.scroll();assert.equal(styles.get('--visual-offset-top'),'120px','Keyboard panning must update chrome immediately without waiting for resize');
assert.equal(scrolls,0,'Viewport scrolling must not start a corrective page scroll');
viewport.offsetTop=-10;viewportEvents.resize();assert.equal(styles.get('--visual-offset-top'),'0px','Rubber-band overscroll cannot shift chrome above the screen');
viewport.offsetTop=75;viewportEvents.resize();assert.equal(styles.get('--visual-offset-top'),'75px');
document.activeElement=null;events.focusout();for(const fn of [...timers.values()])fn();assert(!classes.has('mobile-editing'));
viewport.offsetTop=0;viewport.height=810;viewportEvents.scroll();assert.equal(styles.get('--visual-offset-top'),'0px','Chrome returns to its original anchor after keyboard dismissal');
console.log('PASS: mobile chrome follows keyboard pan/resize, clamps overscroll, avoids scroll loops and resets after dismissal.');
