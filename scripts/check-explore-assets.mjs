import assert from 'node:assert/strict';
import fs from 'node:fs';

// Exercise the deployed Response path, not only the encoded build dictionary.
// Run after the web build; --mobile also verifies the native bundle on disk.
const names = ['places','people','stories','evidence','timeline','commandments','prophecies','method'];
const filenames = names.map(name => `explore-${name}.webp`);
const included = fs.readdirSync('src/assets').filter(name => /^explore-[a-z]+\.webp$/.test(name));
assert.deepEqual(included.sort(), [...filenames].sort(), 'All eight Explore illustrations must be bundled');
const explore = fs.readFileSync('src/atlas-explore.js', 'utf8');
const used = [...explore.matchAll(/\bimage:'([a-z]+)'/g)].map(match => match[1]);
assert.deepEqual([...used].sort(), [...names].sort(), 'Every Explore collection references its illustration exactly once');

const worker = (await import('../dist/server/index.js')).default;
const get = async pathname => {
  const response = await worker.fetch(new Request(new URL(pathname, 'https://biblelens.test')), {}, {});
  assert.equal(response.status, 200, pathname);
  return response;
};
const manifest = await (await get('/assets/startup-manifest.json')).json();
const startup = await (await get(manifest.js.path)).text();
const mobile = process.argv.includes('--mobile');
const engine = mobile ? fs.readFileSync('www/device-engine.js', 'utf8') : '';
let total = 0;
for (const filename of filenames) {
  const original = fs.readFileSync(`src/assets/${filename}`);
  assert.equal(original.toString('ascii', 0, 4), 'RIFF', `${filename} has a WebP container`);
  assert.equal(original.toString('ascii', 8, 12), 'WEBP', `${filename} has a WebP signature`);
  const response = await get(`/assets/${filename}`);
  assert.equal(response.headers.get('content-type'), 'image/webp', filename);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), original, `${filename}: worker serves the source bytes without UTF-8 corruption`);
  assert(!startup.includes(original.toString('base64')), `${filename}: artwork stays outside startup JavaScript`);
  if (mobile) {
    assert.deepEqual(fs.readFileSync(`www/assets/${filename}`), original, `${filename}: native bundle preserves exact image bytes`);
    assert(!engine.includes(original.toString('base64')), `${filename}: native API engine does not duplicate UI image bytes`);
  }
  total += original.length;
}
console.log(`PASS: eight Explore WebP images (${Math.round(total / 1024)} KiB total), correct MIME, exact worker/source${mobile ? '/native' : ''} byte equality, and no image payloads in startup${mobile ? ' or native API' : ''} JavaScript.`);
