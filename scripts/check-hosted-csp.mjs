import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import {chromium, webkit} from 'playwright';
import worker from '../dist/server/index.js';

// Replay the hosting layer after the real Worker response, as on Sites. These
// captures contain no account credentials; their ray IDs/times are test data.
const fixture = JSON.parse(fs.readFileSync(new URL('./fixtures/sites-host-injection.json', import.meta.url), 'utf8'));
assert.equal(fixture.buildNumber, 273);
assert(fixture.samples.length >= 3, 'Keep three independently captured hosting injections');
assert.equal(fixture.remoteScriptPath, '/cdn-cgi/challenge-platform/scripts/jsd/main.js');
for (const sample of fixture.samples) {
  assert.match(sample.html, /^<script>[\s\S]*<\/script>$/);
  assert(sample.html.includes(sample.params.r) && sample.html.includes(sample.params.t));
}
assert(new Set(fixture.samples.map(sample => sample.html)).size > 1, 'The fixture must retain the varying ray/time values');

async function serve(sample, enforce) {
  const challengeRequests = [], errors = [];
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://127.0.0.1:${server.address().port}`);
      if (url.pathname === fixture.remoteScriptPath) {
        challengeRequests.push(url.pathname);
        // The real captured outer/iframe inline scripts execute unchanged. Stop
        // at the challenge network boundary: no live bot checks or telemetry.
        res.writeHead(200, {'content-type': 'application/javascript'});
        res.end('/* Remote Cloudflare challenge intentionally omitted in local CSP regression. */');
        return;
      }
      const requestHeaders = new Headers(req.headers); requestHeaders.set('accept-encoding', 'identity');
      const response = await worker.fetch(new Request(url, {method: req.method, headers: requestHeaders}), {}, {});
      const headers = Object.fromEntries(response.headers);
      let body = Buffer.from(await response.arrayBuffer());
      if (headers['content-type']?.includes('text/html')) {
        const html = body.toString();
        assert.match(html, /<\/body>/i, 'Host injection needs the actual document body');
        body = Buffer.from(html.replace(/<\/body>/i, () => sample.html + '</body>'));
        if (enforce && headers['content-security-policy-report-only']) {
          // Negative control recreates build 274's enforced web policy without
          // changing its directives or touching either generated build.
          headers['content-security-policy'] = headers['content-security-policy-report-only'];
          delete headers['content-security-policy-report-only'];
        }
      }
      res.writeHead(response.status, headers);
      res.end(body);
    } catch (error) {
      errors.push(error.message);
      res.writeHead(500);
      res.end('Hosted CSP fixture failed');
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    challengeRequests,
    errors,
    close: () => new Promise(resolve => {server.close(resolve); server.closeAllConnections();})
  };
}

async function observe(browser, sample, enforce = false) {
  const server = await serve(sample, enforce);
  const context = await browser.newContext({viewport: {width: 390, height: 844}});
  const page = await context.newPage(), pageErrors = [], policyErrors = [], externalRequests = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => {
    const text = message.text();
    if (/content[- ]security[- ]policy/i.test(text) && !/report[ -]only/i.test(text)) policyErrors.push(text);
  });
  await context.route('**/*', route => {
    if (new URL(route.request().url()).origin === server.url) return route.continue();
    externalRequests.push(route.request().url());
    return route.abort();
  });
  await context.addInitScript(() => {
    globalThis.__hostedCspViolations = [];
    document.addEventListener('securitypolicyviolation', event => __hostedCspViolations.push({
      directive: event.effectiveDirective,
      disposition: event.disposition,
      blockedURI: event.blockedURI
    }));
  });
  try {
    const response = await page.goto(server.url, {waitUntil: 'load', timeout: 60000});
    assert.equal(response.status(), 200);
    await page.waitForFunction(() =>
      !document.documentElement.classList.contains('bl-starting') &&
      document.getElementById('biblelens-app-script')?.dataset.biblelensReady === 'true' &&
      typeof reading !== 'undefined' && reading?.verses?.length > 0,
    {}, {timeout: 60000});
    // An event, not a fixed delay, also proves CSP diagnostics were collected.
    await page.waitForFunction(() => globalThis.__hostedCspViolations.some(event => event.directive.startsWith('script-src')));
    const result = await page.evaluate(() => ({
      meta: [...document.querySelectorAll('meta[http-equiv]')].filter(meta => /content-security-policy/i.test(meta.httpEquiv)).map(meta => meta.outerHTML),
      violations: globalThis.__hostedCspViolations,
      hostParams: [...document.querySelectorAll('iframe')].map(frame => frame.contentWindow?.__CF$cv$params).filter(Boolean),
      verses: reading.verses.length,
      ready: document.getElementById('biblelens-app-script').dataset.biblelensReady
    }));
    return {...result, headers: response.headers(), pageErrors, policyErrors, externalRequests,
      challengeRequests: server.challengeRequests, serverErrors: server.errors};
  } finally {
    await context.close();
    await server.close();
  }
}

function assertHealthy(result, sample) {
  assert.deepEqual(result.violations.filter(event => event.disposition !== 'report'), [], 'Hosted startup must have no enforced CSP violations');
  assert.deepEqual(result.policyErrors, [], 'Hosted startup must have no enforced CSP console errors');
  assert(result.headers['content-security-policy-report-only'], 'Web CSP must be report-only');
  assert.equal(result.headers['content-security-policy'], undefined, 'Web must not send an enforced CSP header');
  assert.deepEqual(result.meta, [], 'Web must not enforce CSP through a meta tag');
  assert.deepEqual(result.pageErrors, [], 'Hosted startup must not throw');
  assert.deepEqual(result.serverErrors, [], 'The fixture server must serve real built assets');
  assert.deepEqual(result.externalRequests, [], 'The regression must make no external requests');
  assert.equal(result.ready, 'true');
  assert(result.verses > 0, 'Reading must finish startup');
  assert.deepEqual(result.hostParams, [sample.params], 'The captured host script and its iframe inline bootstrap must actually execute');
  assert.deepEqual(result.challengeRequests, [fixture.remoteScriptPath], 'The host must reach the locally stubbed remote-script boundary');
  assert(result.violations.some(event => event.directive.startsWith('script-src') && event.disposition === 'report'), 'The unchanged restrictive policy must still report the unapproved host injection');
}

for (const [name, engine] of [['Chromium', chromium], ['WebKit', webkit]]) {
  const browser = await engine.launch({headless: true});
  try {
    for (const sample of fixture.samples) assertHealthy(await observe(browser, sample), sample);
    const blocked = await observe(browser, fixture.samples[0], true);
    assert(blocked.violations.some(event => event.disposition === 'enforce' && event.directive.startsWith('script-src')), 'Negative control must reproduce the blocked host script');
    assert.deepEqual(blocked.hostParams, [], 'An enforced policy must stop the captured host bootstrap');
    assert.throws(() => assertHealthy(blocked, fixture.samples[0]), /no enforced CSP violations/, 'The same startup check must reject build 274 policy enforcement');
    console.log(`PASS: ${name} hosted CSP: ${fixture.samples.length} captured injections, app/reader startup, report-only diagnostics, no external requests; enforced-policy negative control rejected.`);
  } finally {
    await browser.close();
  }
}
