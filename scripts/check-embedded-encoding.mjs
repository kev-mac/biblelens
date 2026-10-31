import assert from 'node:assert/strict';
import fs from 'node:fs';
import {randomBytes} from 'node:crypto';
import vm from 'node:vm';
import {encodeEmbeddedAsset, decodeEmbeddedAsset} from './embedded-encoding.mjs';

// Run the emitted function without module scope, as the hosted Worker does.
const decode = vm.runInNewContext('(' + decodeEmbeddedAsset.toString() + ')');
const verify = bytes => {
  const encoded = encodeEmbeddedAsset(bytes);
  assert.equal(JSON.stringify(encoded).length, encoded.length + 2, 'No JSON escape overhead');
  assert.deepEqual(Buffer.from(decode(encoded)), bytes, 'Exact binary round trip');
};
for (let length = 0; length < 260; length++) verify(randomBytes(length));
verify(Buffer.from(Array.from({length: 256}, (_, i) => i)));
const images = JSON.parse(fs.readFileSync('data/story-images.json', 'utf8'));
for (const image of Object.values(images)) verify(fs.readFileSync('src' + image.src));
verify(fs.readFileSync('src/workspace-shell.js'));
console.log('PASS: hosted asset encoding preserves every story image byte, text, all byte values and every padding length without JSON escapes.');
