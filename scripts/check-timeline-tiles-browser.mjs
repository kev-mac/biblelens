import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium, webkit} from 'playwright';
import worker from './built-worker.mjs';
import {loadTimelineCatalog} from './timeline-catalog.mjs';

// Test the packaged app after build, or the offline bundle after build:mobile.
const mobile = process.argv.includes('--mobile');
const output = path.resolve('.release/timeline-tiles' + (mobile ? '-mobile' : ''));
fs.mkdirSync(output, {recursive: true});
const mobileRoot = path.resolve('www');
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.svg':'image/svg+xml'};
const server = http.createServer(async (req, res) => {
 try {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (mobile) {
   const file = path.resolve(mobileRoot, '.' + (url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname)));
   if (!file.startsWith(mobileRoot + path.sep)) {res.writeHead(403);res.end();return;}
   if (!fs.existsSync(file)) {res.writeHead(404);res.end();return;}
   res.writeHead(200, {'content-type':types[path.extname(file)] || 'application/octet-stream'});
   res.end(fs.readFileSync(file));return;
  }
  if (url.pathname.startsWith('/assets/') && /\.(webp|png|jpg)$/.test(url.pathname)) {
   const file = path.join('src/assets', path.basename(url.pathname));
   if (fs.existsSync(file)) {res.writeHead(200, {'content-type':types[path.extname(file)]});res.end(fs.readFileSync(file));return;}
  }
  const response = await worker.fetch(new Request(url, {headers:req.headers}), {DB:{prepare(){throw Error('Unexpected SQL');}}}, {});
  res.writeHead(response.status, Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 } catch (error) {if (!res.headersSent) res.writeHead(500);res.end(error.message);}
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:' + server.address().port;
const expectedIds = loadTimelineCatalog().events.map(event => event.id);
const traditionalCount = JSON.parse(fs.readFileSync('data/reference/events.json')).length;
const results = [];
const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
async function go(page, hash, selector) {
 await page.evaluate(hash => BibleLensWorkspace.navigate(hash), hash);
 await page.locator(selector).first().waitFor();
 await page.waitForFunction(() => !document.getElementById('main').hasAttribute('aria-busy'));
 await page.evaluate(() => document.fonts.ready);await settle(page);
}
async function fit(page) {
 assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'No horizontal overflow');
 assert(await page.locator('#timeline-view article').evaluateAll(cards => cards.every(card => card.scrollWidth <= card.clientWidth + 1)), 'No tile clips its text or controls');
}
async function surface(locator) {
 return locator.evaluate(node => {
  const css = getComputedStyle(node);
  return {background:css.backgroundColor, radius:css.borderRadius, shadow:css.boxShadow,
   padding:css.padding, borderWidths:[css.borderTopWidth,css.borderRightWidth,css.borderBottomWidth,css.borderLeftWidth],
   backdrop:css.backdropFilter || css.webkitBackdropFilter};
 });
}
try {
 for (const [engine, kind] of Object.entries({chromium, webkit})) {
  const browser = await kind.launch();
  try {
   for (const width of [320,390,760,768,1280]) for (const theme of ['light','dark']) {
    const name = `${engine}-${width}-${theme}`;
    const context = await browser.newContext({viewport:{width,height:1000},hasTouch:width<768,reducedMotion:'reduce',serviceWorkers:'block'});
    await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    if (mobile) await context.addInitScript(() => Object.defineProperty(navigator, 'onLine', {get:() => false}));
    const page = await context.newPage(), errors = [], apiRequests = [];
    page.setDefaultTimeout(30000);
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url());});
    try {
     await page.goto(base + '/#stories');await page.locator('#stories-list .story-card').first().waitFor();
     await page.evaluate(theme => {state.theme=theme;applyTheme();}, theme);await settle(page);
     const sharedTile = await surface(page.locator('#stories-list .story-card').first());
     await go(page, '#timeline', '#timeline-list .timeline-event-card');
     const reviewed = page.locator('#timeline-list .timeline-event-card');
     const traditional = page.locator('.timeline-list .timeline-card');
     assert.equal(await reviewed.count(), expectedIds.length);
     assert.equal(await traditional.count(), traditionalCount);
     assert.deepEqual(await page.locator('#timeline-list .timeline-node').evaluateAll(nodes => nodes.map(node => node.dataset.timelineEvent)), expectedIds, 'Reviewed event order unchanged');
     assert.equal(await page.locator('#timeline-list .timeline-history').count(), 6);
     assert.match(await page.locator('#timeline-count').innerText(), /^18 of 18 reviewed events/);
     assert.equal(await page.locator('.timeline-controls [role=status]').innerText(), `${traditionalCount} of ${traditionalCount} events`);
     for (const cards of [reviewed,traditional]) {
      const actual = await surface(cards.first());
      for (const key of ['background','radius','shadow','padding']) assert.equal(actual[key], sharedTile[key], 'Shared directory tile ' + key);
      assert.deepEqual(actual.borderWidths, ['1px','1px','1px','1px']);
      assert.equal(actual.backdrop, 'none');
     }
     assert(await page.locator('#timeline-list, .timeline-list').evaluateAll(lists => lists.every(node => getComputedStyle(node).gap === '12px' && getComputedStyle(node).borderTopWidth === '0px')), 'Separated tiles replace dividers');
     await fit(page);
     const first = reviewed.first(), button = first.locator('.timeline-history');
     assert.equal(await first.getAttribute('aria-labelledby'), await first.locator('h3').getAttribute('id'));
     const drawer = first.locator('.timeline-discrepancy');
     assert.equal(await button.getAttribute('aria-controls'), await drawer.getAttribute('id'));
     assert.equal(await button.getAttribute('aria-expanded'), 'false');
     assert(await drawer.evaluate(node => node.inert));
     assert.equal(await drawer.evaluate(node => getComputedStyle(node).transitionDuration), '0s', 'Reduced motion honored');
     await button.focus();await settle(page);
     assert(await button.evaluate(node => {const css=getComputedStyle(node);const box=node.getBoundingClientRect();return css.outlineStyle==='solid'&&parseFloat(css.outlineWidth)>=2&&box.height>=44&&box.width>=44;}), 'Visible keyboard focus and 44px target');
     await page.keyboard.press('Enter');
     assert.equal(await button.getAttribute('aria-expanded'), 'true');assert(!(await drawer.evaluate(node => node.inert)));
     assert.equal(await drawer.getAttribute('aria-hidden'), 'false');
     assert(await drawer.locator('a').count() > 0);await fit(page);
     await page.keyboard.press('Space');assert.equal(await button.getAttribute('aria-expanded'), 'false');
     await button.click();assert.equal(await button.getAttribute('aria-expanded'), 'true');
     await button.click();assert.equal(await button.getAttribute('aria-expanded'), 'false');
     if ([390,1280].includes(width)) {await first.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,name+'.png'),fullPage:false});}
     const source = reviewed.filter({has:page.locator('.timeline-source-details')}).first().locator('.timeline-source-details');
     await source.locator('summary').click();assert(await source.evaluate(node => node.open));await fit(page);
     await source.locator('summary').click();assert(!(await source.evaluate(node => node.open)));
     const filter = page.locator('[data-timeline-filter]');
     await filter.click();assert.equal(await reviewed.count(), 6);assert.equal(await traditional.count(), 9);await fit(page);
     await filter.click();assert.equal(await reviewed.count(), 18);assert.equal(await traditional.count(), traditionalCount);
     const search = page.locator('#timeline-view input[type=search]');
     await search.fill('Camels');assert.equal(await reviewed.count(), 1);assert.equal(await traditional.count(), 0);
     assert.equal(await reviewed.first().locator('h3').innerText(), 'Camels in Abraham’s Household');
     await search.fill('no-matching-timeline-event');assert.equal(await reviewed.count(), 0);assert.equal(await traditional.count(), 0);
     assert(await page.locator('#timeline-list .reference-empty').isVisible());await fit(page);
     await search.fill('');assert.equal(await reviewed.count(), 18);
     const firstTraditional = traditional.first();await firstTraditional.locator('summary.card-disclosure-heading').click();
     assert(await firstTraditional.locator('.card-disclosure').evaluate(node => node.open));await fit(page);
     await firstTraditional.locator('summary.card-disclosure-heading').click();
     const titles = await traditional.locator('h2').allTextContents();
     const passage = reviewed.first().locator('.timeline-passage');
     await passage.focus();await page.keyboard.press('Enter');await page.locator('#verse-10').waitFor();
     assert.equal(await page.evaluate(() => location.hash), '#read/0/24/10');
     await page.goBack();await reviewed.first().waitFor();
     assert.deepEqual(await traditional.locator('h2').allTextContents(), titles, 'Order retained after passage navigation and Back');
     await button.click();await go(page,'#stories','#stories-list .story-card');await page.goBack();await reviewed.first().waitFor();
     assert.equal(await button.getAttribute('aria-expanded'),'false','Navigation resets comparison disclosure');
     await page.goForward();await page.locator('#stories-view:not([hidden]) .story-card').first().waitFor();
     assert.deepEqual(errors, []);if (mobile) assert.deepEqual(apiRequests, [], 'Offline app makes no API requests');
     results.push({engine,width,theme,mobile,status:'PASS'});console.log('PASS Timeline tiles',name,mobile?'offline':'web');
    } catch(error) {
     await page.screenshot({path:path.join(output,name+'-failure.png'),fullPage:false}).catch(()=>{});
     console.error('FAIL',name,{route:page.url(),errors,message:error.message});throw error;
    } finally {await context.close();fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2)+'\n');}
   }
  } finally {await browser.close();}
 }
 assert.equal(results.length,20);
 console.log('PASS: Timeline tile parity, responsive layouts, light/dark themes, keyboard controls, filters, disclosures, passage navigation and history in Chromium and WebKit.');
} finally {await new Promise(resolve => server.close(resolve));}
