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
console.log('PASS: Sites package excludes static bypass paths; embedded HTML retains both CSP headers and sync retains authentication.');
