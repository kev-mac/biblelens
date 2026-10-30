import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {checkSitesPackage, packageSites} from './package-sites.mjs';

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'biblelens-sites-'));
const output = path.join(temporary, 'dist');
try {
  packageSites('dist', output);
  const {default: worker} = await import(pathToFileURL(path.join(output, 'server/index.js')));
  for (const route of ['/', '/index.html']) {
    const response = await worker.fetch(new Request('https://example.test' + route), {}, {});
    assert.equal(response.status, 200);
    assert(response.headers.get('content-security-policy-report-only'));
    assert.equal(response.headers.get('content-security-policy'), "object-src 'none'; base-uri 'none'; form-action 'self'; worker-src 'self'");
    assert((await response.text()).includes('<html'));
  }
  const sync = await worker.fetch(new Request('https://example.test/api/sync', {headers: {'X-BibleLens-Sync': '1'}}), {DB: {}}, {});
  assert.equal(sync.status, 401);
  // Sites supplies an ASSETS binding that does not contain our internal packs.
  // A self-contained Worker must use its embedded files even with that binding.
  let externalReads = 0;
  const hostedEnv = {DB: {}, ASSETS: {async fetch() {
    externalReads++;
    return new Response('Not found', {status: 404});
  }}};
  for (const encoding of ['', 'gzip']) for (const route of ['/', '/index.html', '/release.json', '/api/chapter?book=0&chapter=1', '/api/search?q=mercy', '/offline-bible.json']) {
    const response = await worker.fetch(new Request('https://example.test' + route, {headers: encoding ? {'accept-encoding': encoding} : {}}), hostedEnv, {});
    assert.equal(response.status, 200, route);
    assert(response.headers.get('content-security-policy-report-only'), route);
    assert(response.headers.get('content-security-policy'), route);
    assert.equal(response.headers.get('content-encoding'), null, route + ' identity encoding');
    assert.equal(response.headers.get('vary'), null, route + ' no encoding negotiation');
    if (route === '/' || route === '/index.html') {
      const body = Buffer.from(await response.arrayBuffer());
      assert.match(body.toString('utf8'), /^<!doctype/i, route + ' decoded HTML');
      assert.notEqual(body.subarray(0, 2).toString('hex'), '1f8b');
    } else if (route === '/release.json') {
      assert.equal((await response.json()).buildNumber, JSON.parse(fs.readFileSync('package.json', 'utf8')).buildNumber);
    } else {
      assert((await response.arrayBuffer()).byteLength > 0, route);
    }
  }
  for (const encoding of ['', 'gzip']) {
    const hostedSync = await worker.fetch(new Request('https://example.test/api/sync', {headers: {'X-BibleLens-Sync': '1', ...(encoding ? {'accept-encoding': encoding} : {})}}), hostedEnv, {});
    assert.equal(hostedSync.status, 401);
    assert.equal(hostedSync.headers.get('content-encoding'), null);
    assert(!/accept-encoding/i.test(hostedSync.headers.get('vary') || ''), 'Sync must not negotiate encoding');
    await hostedSync.arrayBuffer();
  }
  assert.equal(externalReads, 0, 'Self-contained Sites Worker must not read the platform asset store');
  fs.mkdirSync(path.join(output, 'client'));
  fs.writeFileSync(path.join(output, 'client/index.html'), '<html>unsafe static response</html>');
  assert.throws(() => checkSitesPackage(output), /static assets may bypass/);
  fs.rmSync(path.join(output, 'client'), {recursive: true});
  fs.writeFileSync(path.join(output, 'wrangler.json'), '{}');
  assert.throws(() => checkSitesPackage(output), /static assets may bypass/);
  fs.rmSync(path.join(output, 'wrangler.json'));
  const hosting = path.join(output, '.openai/hosting.json');
  fs.writeFileSync(hosting, JSON.stringify({static: {directory: 'client'}}));
  assert.throws(() => checkSitesPackage(output), /all requests through the Worker/);
} finally {
  fs.rmSync(temporary, {recursive: true, force: true});
}
console.log('PASS: Sites package excludes static bypass paths; embedded routes retain both CSP headers with a failing platform ASSETS binding, identity bodies with and without gzip negotiation, release identity matches, and sync retains authentication.');
