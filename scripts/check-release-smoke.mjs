import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import {chromium, webkit} from 'playwright';
import worker from './built-worker.mjs';
import {smokeSearch, smokeSignin, syncProbeHeaders, assertPolicy} from './release-smoke.mjs';

const fixture = JSON.parse(fs.readFileSync('scripts/fixtures/sites-host-injection.json', 'utf8'));
assert(fs.statSync('dist/server/index.js').size > 100_000, 'Test the actual built Worker');
if(fs.existsSync('dist/asset-manifest.json'))assert(fs.readdirSync('dist/client').length>0, 'Split build must include packaged assets');
assert.deepEqual(syncProbeHeaders, {'X-BibleLens-Sync': '1'});
assertPolicy([{disposition: 'report', violatedDirective: 'script-src-elem', blockedURI: 'inline'}]);
assert.throws(() => assertPolicy([{disposition: 'report'}, {disposition: 'enforce'}]), /Enforced CSP/);
for (const [name, engine] of [['Chromium', chromium], ['WebKit', webkit]]) {
  const browser = await engine.launch({headless: true});
  const failures = [], requests = [];
  let mode = 'healthy', searchCount = 0;
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://127.0.0.1:${server.address().port}`);
      if (url.pathname === fixture.remoteScriptPath) { res.writeHead(200, {'content-type': 'text/javascript'}); res.end('/* Local challenge boundary. */'); return; }
      if (url.pathname === '/signin-with-chatgpt') {
        res.writeHead(mode === 'signin-broken' ? 500 : 200, {'content-type': 'text/html'}); res.end('Local sign-in resolution fixture'); return;
      }
      if (url.pathname === '/api/search') {
        searchCount++; requests.push({mode, query: url.search});
        if (mode === 'broken' || mode === 'transient' && searchCount === 1) { res.writeHead(500, {'content-type': 'application/json'}); res.end('{"error":"Controlled regression"}'); return; }
        // Exceed the actual UI timeout once, proving the harness can recover a
        // cold-load timeout without accepting the displayed local fallback.
        if (mode === 'cold' && searchCount === 1) await new Promise(resolve => setTimeout(resolve, 21000));
      }
      // The captured hosting script is inserted into decoded HTML, before transport compression.
      const headers=new Headers(req.headers);headers.set('accept-encoding','identity');
      const response = await worker.fetch(new Request(url, {headers}), {}, {});
      let body = Buffer.from(await response.arrayBuffer());
      if (response.headers.get('content-type')?.includes('text/html')) body = Buffer.from(body.toString().replace('</body>', fixture.samples[0].html + '</body>'));
      res.writeHead(response.status, Object.fromEntries(response.headers)); res.end(body);
    } catch (error) { failures.push(error.message); res.writeHead(500); res.end('Fixture failed'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const context = await browser.newContext({viewport: {width: 390, height: 844}});
  await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
  await context.addInitScript(() => {
    globalThis.__policy = [];
    document.addEventListener('securitypolicyviolation', e => __policy.push({disposition: e.disposition, violatedDirective: e.violatedDirective, blockedURI: e.blockedURI}));
  });
  try {
    const page = await context.newPage();
    const response = await page.goto(base+'/#read/0/1');
    assert(response.headers()['content-security-policy-report-only']);
    assert.equal(response.headers()['content-security-policy'],"object-src 'none'; base-uri 'none'; form-action 'self'; worker-src 'self'",'Retain the host-compatible enforced policy');
    await page.waitForFunction(() => typeof BibleLensWorkspace !== 'undefined' && reading?.verses?.length > 0);
    const signin = page.locator('a[href^="/signin-with-chatgpt"]').first();
    assert.equal(await signin.isVisible(), false, 'Settings link is attached in its closed panel');
    assert.equal((await smokeSignin(page, context, base)).status, 'PASS');
    mode = 'signin-broken';
    await assert.rejects(smokeSignin(page, context, base), /Sign-in link does not resolve/);
    console.log(`${name}: search probe healthy`);
    mode = 'healthy';
    const healthy = await smokeSearch(page);
    assert.equal(healthy.attempts.length, 1);
    assert(healthy.attempts[0].requests.some(r => r.passages === 24 && r.research === 12));
    console.log(`${name}: search probe transient`);
    mode = 'transient'; searchCount = 0;
    const transient = await smokeSearch(page);
    assert.equal(transient.attempts.length, 1, 'Client GET retry recovers within the same search');
    assert.equal(transient.attempts[0].requests[0].status, 500);
    console.log(`${name}: search probe cold`);
    mode = 'cold'; searchCount = 0;
    const cold = await smokeSearch(page);
    assert.equal(cold.attempts.length, 2);
    assert.match(cold.attempts[0].summary, /Scripture and research search unavailable/);
    console.log(`${name}: search probe broken`);
    mode = 'broken'; searchCount = 0;
    await assert.rejects(smokeSearch(page), /Scripture search failed/);
    assert.equal(searchCount, 6, 'Two smoke probes each exhaust three GET attempts');
    const violations = await page.evaluate(() => __policy);
    assertPolicy(violations);
    assert(violations.some(e => e.disposition === 'report' && e.violatedDirective.startsWith('script-src')));
    const sync = await context.request.get(base + '/api/sync/session');
    assert.equal(sync.status(), 403, 'Negative control: missing header must be rejected');
    // There is no D1 binding in this isolated Node fixture; passing the header
    // must reach the configuration check, rather than the request-origin guard.
    assert.equal((await context.request.get(base + '/api/sync/session', {headers: syncProbeHeaders})).status(), 503);
    assert.deepEqual(failures, []);
    console.log(`PASS: ${name}: full Worker search + host injection, 21s cold timeout recovery, persistent 500/fallback rejected, sync header and CSP disposition controls. ${JSON.stringify(violations)}`);
  } finally {
    await context.close(); await browser.close();
    await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
  }
}
