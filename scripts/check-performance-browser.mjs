import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||process.env.BIBLELENS_URL||'http://127.0.0.1:8788';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined)});
const errors=[];
async function page(){const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});p.on('pageerror',e=>errors.push(e.message));return p;}
async function go(p,hash,selector){await p.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await p.waitForSelector(selector);}
async function skip(p){const hash=await p.evaluate(()=>location.hash);await p.locator('.skip').focus();await p.keyboard.press('Enter');assert.equal(await p.evaluate(()=>location.hash),hash);assert.equal(await p.evaluate(()=>document.activeElement.id),'main');await p.keyboard.press('Tab');assert(await p.evaluate(()=>!!document.activeElement.closest('main')));}
try{
 const p=await page(),requests=[];p.on('request',r=>requests.push(new URL(r.url()).pathname));
 await p.goto(base+'/#discover');await p.waitForSelector('.phase2-hero');await skip(p);
 assert(!requests.some(path=>/\/assets\/(?:study|map|references|characters|debates)\./.test(path)),'Explore loads no other view code');
 assert(!requests.includes('/reference/people.json'));assert(!requests.includes('/reference/places.json'));
 let release;const gate=new Promise(resolve=>release=resolve);await p.route('**/api/comparisons?*',async route=>{await gate;await route.continue();});
 await go(p,'#read/8/17','#verse-58');await p.evaluate(()=>window.retainedScripture=document.querySelector('#verse-2 [data-scripture]'));
 assert(await p.locator('#chapter-text .person-chip').count(),'Reference links arrive with the chapter');assert(!requests.includes('/reference/people.json'),'Reading does not need the whole People catalog');
 release();await p.waitForSelector('[data-lens-inspect]');assert(await p.evaluate(()=>retainedScripture===document.querySelector('#verse-2 [data-scripture]')),'Evidence arrival preserves scripture nodes and selection');await skip(p);
 await p.locator('#chapter-text .person-chip').first().click();await p.waitForSelector('#character-sheet[open]');await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>location.hash),'#read/8/17');
 await go(p,'#search?q=creation','.lens-result');await skip(p);await go(p,'#people','.character-card');await go(p,'#stories','.story-card');
 await p.waitForLoadState('networkidle');assert.equal(requests.filter(path=>path==='/reference/people.json').length,1,'Search, chips and profiles share the same People request');assert.equal(requests.filter(path=>path==='/reference/places.json').length,1,'Other references are shared too');
 await go(p,'#debates','.phase2-debate-card');await skip(p);await go(p,'#debate/early-ahaziah','.phase2-sides:not([aria-busy])');await skip(p);await go(p,'#notebook','#lens-notebook-list');await skip(p);
 await go(p,'#discover','.phase2-hero');await p.locator('#lens-settings').click();await p.waitForSelector('#reader-settings[open]');await p.locator('#app-font-family').selectOption('lora');assert.match(await p.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--ui-font')),/Lora/);await p.locator('#app-font-family').selectOption('inter');await p.keyboard.press('Escape');
 assert(!requests.some(path=>/\/assets\/map\./.test(path)),'Map remains unloaded until requested');
 await p.route('https://**/*',route=>route.abort());await go(p,'#places','.place-profile-card');await p.locator('.place-map-action[data-place-id]:not(:disabled)').first().click();await p.waitForSelector('#atlas-sheet[open]');await p.waitForFunction(()=>document.querySelector('#atlas-name').textContent!=='Loading place…');assert(requests.some(path=>/\/assets\/map\./.test(path)));await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>location.hash),'#places');await p.close();
 // Cold keyboard navigation waits for the destination heading, not the first frame.
 const focus=await page();let releaseFocus;const focusGate=new Promise(resolve=>releaseFocus=resolve);
 await focus.route('**/assets/characters.*.js',async route=>{await focusGate;await route.continue();});
 await focus.goto(base+'/#discover');await focus.waitForSelector('.phase2-hero');
 await focus.locator('[aria-labelledby="rail-people"] .phase2-rail-heading a').focus();await focus.keyboard.press('Enter');
 await focus.waitForSelector('#route-loading');releaseFocus();await focus.waitForSelector('.character-card');
 await focus.waitForFunction(()=>document.activeElement===document.querySelector('#characters-view h1'));
 await focus.goBack();await focus.waitForSelector('.phase2-hero');
 await focus.waitForFunction(()=>document.activeElement===document.querySelector('[aria-labelledby="rail-people"] .phase2-rail-heading a'));
 await focus.close();
 // A failed feature download retries without discarding private state.
 const retry=await page();let failed=false;await retry.route('**/assets/study.*.js',route=>{if(!failed){failed=true;return route.abort();}return route.continue();});
 await retry.goto(base+'/#notebook');await retry.waitForSelector('#route-loading button');await retry.evaluate(()=>{state.notes.animals='Keep this offline note';persist();});await retry.locator('#route-loading button').click();await retry.waitForSelector('#lens-notebook-list');assert.equal(await retry.evaluate(()=>state.notes.animals),'Keep this offline note');await retry.close();
 // Navigating away while code is pending must not restore the obsolete route.
 const race=await page();let finish;const delayed=new Promise(resolve=>finish=resolve);await race.route('**/assets/study.*.js',async route=>{await delayed;await route.continue();});await race.goto(base+'/#discover');await race.waitForSelector('.phase2-hero');await race.evaluate(()=>BibleLensWorkspace.navigate('#notebook'));await race.waitForSelector('#route-loading');await race.evaluate(()=>BibleLensWorkspace.navigate('#discover'));finish();await race.waitForLoadState('networkidle');assert.equal(await race.evaluate(()=>view),'explore');assert(await race.locator('#route-loading').isHidden());assert.equal(await race.locator('#main').getAttribute('aria-busy'),null);assert.equal(await race.evaluate(()=>document.activeElement===document.querySelector('#explore-view h1')),true,'Obsolete feature completion cannot steal destination focus');await race.close();
 assert.deepEqual(errors,[]);console.log('PASS: route-preserving skip links, lazy views/map, shared reference fetches, stable scripture nodes, profile overlays, font choices, failed-download retry, offline notes cold heading focus, history focus and obsolete-route isolation.');
 const shortcut=await page();await shortcut.goto(base);await shortcut.waitForSelector('.phase2-hero');await shortcut.keyboard.press('/');await shortcut.waitForSelector('#lens-search-input');await shortcut.waitForFunction(()=>document.activeElement?.id==='lens-search-input');await shortcut.close();assert.deepEqual(errors,[]);console.log('PASS: bare home URL and cold Search keyboard shortcut.');
}finally{await browser.close();}
