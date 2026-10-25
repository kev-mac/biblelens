import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {assetDigest, classicScriptBundle, consolidateStartupAssets, insertDeviceBootstrap, startupAssetReferences} from './startup-assets.mjs';

const inline = '<style id="startup-style">body{opacity:1}</style><script>globalThis.startupProbe=true;</script>';
const fixture = {
  '/': {type: 'text/html', body: `<html><head>${inline}<link rel="stylesheet" href="base.css"><script defer src="first.js"></script><link rel="stylesheet" href="vendor/icons.css"><script defer src="second.js"></script></head><body></body></html>`},
  '/base.css': {type: 'text/css', body: 'body{color:red} .art{background:url(data:image/png;base64,aBcD)}'},
  '/vendor/icons.css': {type: 'text/css', body: 'body{color:blue} .icon{background:url("icons/marker.svg")}'},
  '/first.js': {type: 'application/javascript', body: "'use strict'; const shared = 7; trace.push(typeof later); document.addEventListener('DOMContentLoaded', () => trace.push('ready:'+later()));"},
  '/second.js': {type: 'application/javascript', body: "'use strict'; function later(){return shared + 1;} trace.push(later());"}
};
const original = fixture['/'].body;
const manifest = consolidateStartupAssets(fixture);
assert(fixture['/'].body.includes(inline), 'Inline recovery logic and styles remain intact');
assert(fixture['/'].body.indexOf(inline) < fixture['/'].body.indexOf('id="biblelens-app-script"'), 'Recovery logic runs before bundle request');
assert.deepEqual(startupAssetReferences(fixture['/'].body), {css: [manifest.css.path], js: [manifest.js.path]});
assert.deepEqual(manifest.css.sources.map(item => item.path), startupAssetReferences(original).css);
assert.deepEqual(manifest.js.sources.map(item => item.path), startupAssetReferences(original).js);
assert(fixture[manifest.css.path].body.indexOf('color:red') < fixture[manifest.css.path].body.indexOf('color:blue'), 'Styles retain cascade order');
assert.match(fixture[manifest.css.path].body, /url\("\/vendor\/icons\/marker\.svg"\)/, 'Relative CSS paths retain original base');
assert.match(fixture[manifest.css.path].body, /url\(data:image\/png;base64,aBcD\)/, 'Embedded font and image data is unchanged');
for (const kind of ['css', 'js']) {
  assert.equal(assetDigest(fixture[manifest[kind].path].body), manifest[kind].sha256);
  assert(manifest[kind].path.includes(manifest[kind].sha256.slice(0, 16)));
  for (const source of manifest[kind].sources) assert.equal(source.sha256, assetDigest(fixture[source.path].body), 'Original asset routes remain available');
}

// Run the fetched bundle as one deferred script, with each inserted classic
// script receiving a separate VM script context in the same global realm.
function executeBundle(bundle) {
  const trace = [], errors = [], scripts = [], listeners = [];
  const document = {
    currentScript: {nonce: 'hosting-nonce', dataset: {}},
    createElement: () => ({dataset: {}, remove(){this.removed = true;}}),
    addEventListener(type, listener){assert.equal(type, 'DOMContentLoaded');listeners.push(listener);},
    head: {appendChild(script){
      const previous = document.currentScript; document.currentScript = script; scripts.push(script);
      try { vm.runInContext(script.textContent, context); } catch (error) { errors.push(error); }
      finally { document.currentScript = previous; }
    }}
  };
  const context = vm.createContext({document, trace});
  vm.runInContext(bundle, context);
  return {trace, errors, scripts, listeners, ready: document.currentScript.dataset.biblelensReady};
}
const execution = executeBundle(fixture[manifest.js.path].body);
assert.deepEqual(execution.trace, ['undefined', 8], 'Later functions do not hoist into earlier scripts, and lexical state remains shared');
assert.equal(execution.errors.length, 0);
assert.equal(execution.ready, 'true', 'The outer script reports readiness only after every original source completes');
assert(execution.scripts.every(script => script.nonce === 'hosting-nonce' && script.removed), 'CSP nonce is propagated and temporary nodes are removed');
execution.listeners.forEach(listener => listener());
assert.deepEqual(execution.trace, ['undefined', 8, 'ready:8'], 'DOMContentLoaded follows the complete deferred bundle');
assert.throws(() => executeBundle(classicScriptBundle([{path: '/broken.js', body: 'throw new Error("failed");'}, {path: '/later.js', body: 'trace.push("must not run");'}])), /Application startup failed: \/broken.js/, 'A broken script produces a visible startup failure instead of silently continuing');
assert.throws(() => classicScriptBundle([{path: '/invalid.js', body: 'const = ;'}]), /Unexpected token/, 'Invalid source fails packaging');

const native = insertDeviceBootstrap(fixture['/'].body);
assert(native.indexOf('id="biblelens-device-bootstrap"') < native.indexOf('id="biblelens-app-script"'));
assert.deepEqual(startupAssetReferences(native).js, ['/device-bootstrap.js', manifest.js.path]);
console.log('PASS: fingerprinted startup assets preserve stylesheet order and URL bases, classic global execution boundaries, nonce, DOM readiness, failure detection, and native bootstrap order.');

if (!process.argv.includes('--fixtures-only')) {
  const worker = (await import('../dist/server/index.js')).default;
  const get = async path => {
    const response = await worker.fetch(new Request(new URL(path, 'https://biblelens.test/')), {}, {});
    assert.equal(response.status, 200, path); return {body: await response.text(), type: response.headers.get('content-type')};
  };
  const packed = JSON.parse((await get('/assets/startup-manifest.json')).body);
  const sourceReferences = startupAssetReferences(fs.readFileSync('src/index.html', 'utf8'));
  const html = (await get('/')).body;
  assert.deepEqual(startupAssetReferences(html), {css: [packed.css.path], js: [packed.js.path]}, 'Only two application assets are fetched at startup');
  for (const kind of ['css', 'js']) {
    const bundle = await get(packed[kind].path);
    assert.equal(assetDigest(bundle.body), packed[kind].sha256, 'Bundle fingerprint matches actual response');
    assert(packed[kind].path.includes(packed[kind].sha256.slice(0, 16)));
    assert.deepEqual(packed[kind].sources.map(item => item.path), sourceReferences[kind], 'Every startup asset is included exactly once, in source order');
    for (const source of packed[kind].sources) assert.equal(assetDigest((await get(source.path)).body), source.sha256, source.path);
    assert.match(bundle.type, kind === 'css' ? /text\/css/ : /application\/javascript/);
  }
  const packedSources = [...packed.css.sources, ...packed.js.sources].map(item => item.path);
  assert(!packedSources.some(path => /device-engine|beginnings-landscape|chapters\.json/.test(path)), 'Corpus and illustration are not duplicated into the browser startup bundle');
  console.log(`PASS: packaged worker serves ${packedSources.length} original startup assets through two correct, content-fingerprinted bundles.`);
}
