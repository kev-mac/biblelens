import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium, webkit} from 'playwright';

export const syncProbeHeaders = {'X-BibleLens-Sync': '1'};
export function assertPolicy(violations) {
  assert(!violations.some(event => event.disposition === 'enforce'), 'Enforced CSP violation');
}

// A cold hosted request can exceed the UI's 20-second deadline. Retry the UI
// once, retaining both attempts. A local/catalog fallback never proves health.
export async function smokeSearch(page, {timeout = 90000, attempts = 2} = {}) {
  const observations = [];
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const requests = [], pending = [], started = Date.now();
    const onResponse = response => {
      if (new URL(response.url()).pathname !== '/api/search') return;
      pending.push((async () => {
        try {
          const text = await response.text();
          const headers = await response.allHeaders();
          if (!response.ok()) {
            requests.push({status: response.status(), ms: Date.now() - started,
              contentType: headers['content-type'], rayId: headers['cf-ray'],
              hostRuntimeError: text.includes('site-runtime-error'),
              error: text.startsWith('{') ? JSON.parse(text).error : 'Non-JSON error response'});
            return;
          }
          const body = JSON.parse(text);
          requests.push({status: response.status(), ms: Date.now() - started,
            query: body.query, passages: body.passages?.length, research: body.research?.length, ...(body.error ? {error: String(body.error).slice(0, 300)} : {})});
        } catch (error) { requests.push({status: response.status(), error: error.message}); }
      })());
    };
    page.on('response', onResponse);
    try {
      // Navigate away first: submitting an unchanged hash need not rerun search.
      await page.evaluate(() => BibleLensWorkspace.route('#search'));
      await page.evaluate(() => BibleLensWorkspace.route('#search?q=mercy'));
      await page.waitForFunction(() => {
        const status = document.querySelector('#lens-search-status');
        return status && !status.classList.contains('loading-state') &&
          document.querySelector('#lens-search-results')?.getAttribute('aria-busy') !== 'true' &&
          /result|unavailable|could not/i.test(status.textContent);
      }, null, {timeout});
      await Promise.all(pending);
      const summary = await page.locator('#lens-search-status').textContent();
      const count = await page.locator('#lens-results-scripture .lens-result').count();
      observations.push({attempt, summary, count, requests, ms: Date.now() - started});
      if (count > 0 && !/unavailable|could not/i.test(summary) &&
          requests.some(r => r.status === 200 && r.query === 'mercy' && r.passages > 0)) {
        return {status: 'PASS', attempts: observations};
      }
    } catch (error) { observations.push({attempt, requests, error: error.message}); }
    finally { page.off('response', onResponse); }
  }
  const error = new Error('Scripture search failed: ' + JSON.stringify(observations));
  error.observations = observations;
  throw error;
}

export async function smokeSignin(page, context, base) {
  const link = page.locator('a[href^="/signin-with-chatgpt"]').first();
  // Cloud sync lives in Settings; the link can be attached in a closed
  // panel. This probe checks its destination, not modal visibility.
  await link.waitFor({state: 'attached', timeout: 60000});
  const response = await context.request.get(new URL(await link.getAttribute('href'), base).href, {timeout: 90000});
  const url = new URL(response.url()); assert(response.ok(), 'Sign-in link does not resolve');
  return {status: 'PASS', httpStatus: response.status(), resolvedTo: url.origin + url.pathname};
}

export async function releaseSmoke({base, expected, report, legacyCsp = false}) {
  const results = [];
  for (const [name, engine] of [['Chromium', chromium], ['WebKit', webkit]]) {
    const result = {engine: name, viewport: '390x844', violations: [], errors: [], network: [], tiles: [], failures: []};
    results.push(result);
    let browser, context;
    const step = async (name, action) => {
      const attempts = [];
      for (let attempt = 1; attempt <= (name === 'startup' ? 2 : 1); attempt++) {
        try { result[name] = {...await action(), ...(attempts.length ? {recoveredAttempts: attempts} : {})}; return; }
        catch (error) {
          attempts.push({attempt, error: error.message});
          // Never retry a policy, identity or runtime assertion failure. Only a
          // timed-out first navigation/startup may recover through a reload.
          if (name !== 'startup' || attempt === 2 || !/Timeout/i.test(error.message) ||
              result.errors.length || result.violations.some(v => v.disposition === 'enforce')) break;
        }
      }
      result[name] = {status: 'FAIL', attempts}; result.failures.push(name);
    };
    try {
      browser = await engine.launch({headless: true});
      context = await browser.newContext({viewport: {width: 390, height: 844}});
      await context.exposeBinding('__recordPolicy', ({frame}, event) => result.violations.push({...event, frame: frame.url()}));
      await context.addInitScript(() => document.addEventListener('securitypolicyviolation', e => {
        globalThis.__recordPolicy({disposition: e.disposition, violatedDirective: e.violatedDirective, blockedURI: e.blockedURI});
      }));
      const page = await context.newPage();
      page.on('pageerror', error => result.errors.push(error.message));
      page.on('requestfailed', request => result.network.push({url: request.url(), failure: request.failure()}));
      page.on('response', response => {
        if (/tiles\.openfreemap\.org/.test(response.url())) result.tiles.push({url: response.url(), status: response.status()});
        if (response.status() >= 400) result.network.push({url: response.url(), status: response.status()});
      });
      await step('startup', async () => {
        const response = await page.goto(base, {waitUntil: 'domcontentloaded', timeout: 90000});
        assert.equal(response.status(), 200);
        const headers = await response.allHeaders();
        result.csp = {reportOnly: headers['content-security-policy-report-only'] ?? null,
          enforced: headers['content-security-policy'] ?? null,
          meta: await page.locator('meta[http-equiv]').evaluateAll(nodes => nodes.filter(n => /content-security-policy/i.test(n.httpEquiv)).map(n => n.outerHTML))};
        if (!legacyCsp) assert(result.csp.reportOnly && !result.csp.enforced && !result.csp.meta.length, 'HTML CSP response mode mismatch');
        const release = await context.request.get(base + '/release.json', {headers: {'cache-control': 'no-cache'}, timeout: 90000});
        assert.equal(release.status(), 200); result.release = await release.json();
        assert.equal(result.release.buildNumber, expected.buildNumber); assert.equal(result.release.sourceHash, expected.sourceHash);
        await page.waitForFunction(() => !document.documentElement.classList.contains('bl-starting') &&
          document.getElementById('biblelens-app-script')?.dataset.biblelensReady === 'true' &&
          typeof reading !== 'undefined' && reading?.verses?.length > 0, null, {timeout: 90000});
        assert.deepEqual(result.errors, [], 'Startup threw a page error');
        return {status: 'PASS'};
      });
      if (result.startup.status === 'PASS') {
        await step('read', async () => {
          await page.evaluate(() => BibleLensWorkspace.route('#read/0/1'));
          await page.waitForFunction(() => document.querySelector('.verse-body')?.textContent.trim().length > 15, null, {timeout: 60000});
          return {status: 'PASS', text: (await page.locator('.verse-body').first().textContent()).slice(0, 120)};
        });
        await step('search', () => smokeSearch(page));
        await step('map', async () => {
          await page.evaluate(() => {location.hash = '#places';});
          await page.locator('#places-search').fill('Jerusalem');
          await page.locator('#places-view .place-map-preview:not([disabled])').first().click({timeout: 60000});
          await page.waitForFunction(() => document.querySelector('#atlas-sheet')?.open && document.querySelector('#atlas-map canvas') &&
            document.querySelector('.atlas-map-notice')?.textContent === '', null, {timeout: 90000});
          assert(result.tiles.some(t => t.status === 200 && /\/(?:\d+\/){2}\d+\.pbf(?:\?|$)/.test(t.url)), 'No successful geographic tile');
          await page.locator('#atlas-close').click();
          return {status: 'PASS'};
        });
        await step('sync', async () => {
          const response = await context.request.get(base + '/api/sync/session', {headers: syncProbeHeaders, timeout: 60000});
          const status = response.status(); assert([200, 401].includes(status), `Sync endpoint returned ${status}: ${await response.text()}`);
          return {status: 'PASS', httpStatus: status};
        });
        await step('signin', async () => {
          // A failed map check must not leave a modal blocking later diagnostics.
          await page.evaluate(() => {document.querySelector('#atlas-sheet')?.close(); location.hash = '#sync';});
          return smokeSignin(page, context, base);
        });
      }
      await step('policy', async () => { assertPolicy(result.violations); return {status: 'PASS'}; });
      await step('runtime', async () => { assert.deepEqual(result.errors, [], 'Page runtime error'); return {status: 'PASS'}; });
    } catch (error) { result.failures.push('browser'); result.failure = error.message; }
    finally {
      await context?.close(); await browser?.close();
      if (result.violations.some(v => v.disposition === 'enforce') && !result.failures.includes('policy')) result.failures.push('policy');
      result.status = result.failures.length ? 'FAIL' : 'PASS';
      if (report) fs.writeFileSync(report, JSON.stringify(results, null, 2) + '\n');
      console.log(JSON.stringify(result));
    }
  }
  return results;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [base, expectedFile, report, flag] = process.argv.slice(2);
  assert(base && expectedFile && report, 'Usage: node scripts/release-smoke.mjs URL expected-release.json report.json [--legacy-csp]');
  const results = await releaseSmoke({base: base.replace(/\/$/, ''), expected: JSON.parse(fs.readFileSync(expectedFile, 'utf8')), report, legacyCsp: flag === '--legacy-csp'});
  process.exitCode = results.every(result => result.status === 'PASS') ? 0 : 1;
}
