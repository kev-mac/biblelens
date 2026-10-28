import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const code = fs.readFileSync('src/retry.js', 'utf8');
async function fixture(outcomes, input = '/api/books', init) {
  const nodes = [], delays = [], visibleDuring = []; let calls = 0;
  const context = {URL, DOMException, location: {href: 'https://test/', origin: 'https://test'},
    Math: Object.assign(Object.create(Math), {random: () => 0.5}),
    setTimeout(fn, ms) { delays.push(ms); return setTimeout(fn, 0); }, clearTimeout,
    document: {createElement: () => ({setAttribute() {}}), body: {appendChild(node) {nodes.push(node);}}},
    fetch: async () => { visibleDuring.push(nodes.some(node => !node.hidden)); const result = outcomes[Math.min(calls++, outcomes.length - 1)];
      if (result instanceof Error) throw result;
      return new Response('{}', {status: result}); }};
  vm.runInNewContext(code, context);
  let result, error; try { result = await context.fetch(input, init); } catch (failure) { error = failure; }
  return {result, error, nodes, delays, calls, visibleDuring};
}
for (const first of [500, 503, new TypeError('Network failed')]) {
  const result = await fixture([first, 200]); assert.equal(result.calls, 2); assert.equal(result.result.status, 200);
  assert.deepEqual(result.delays, [300]); assert.deepEqual(result.visibleDuring, [false, true]); assert.equal(result.nodes[0].textContent, 'Retrying…'); assert(result.nodes[0].hidden);
}
for (const failure of [500, new TypeError('Offline')]) {
  const result = await fixture([failure]); assert.equal(result.calls, 3); assert.deepEqual(result.delays, [300, 600]);
  assert(failure === 500 ? result.result.status === 500 : result.error === failure); assert(result.nodes[0].hidden);
}
for (const status of [400, 401, 403, 404, 429]) assert.equal((await fixture([status])).calls, 1);
for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']) {
  for (const path of ['/api/chat', '/api/sync/document', '/api/sync/disconnect']) {
    for (const failure of [500, new TypeError('Network failed')]) {
      const result = await fixture([failure], path, {method}); assert.equal(result.calls, 1); assert.equal(result.nodes.length, 0);
    }
  }
}
assert.equal((await fixture([503, 200], '/api/sync/session')).calls, 2);
assert.equal((await fixture([500], new Request('https://test/api/sync/document', {method: 'POST'}))).calls, 1);
assert.equal((await fixture([500], new Request('https://test/api/sync/document'), {method:'POST'})).calls, 1);
const controller = new AbortController(); controller.abort();
assert.equal((await fixture([500], '/api/books', {signal: controller.signal})).calls, 0);
assert.equal((await fixture([new DOMException('Cancelled', 'AbortError')])).calls, 1);
assert.equal((await fixture([500], 'https://external.test/')).calls, 1);
assert.equal((await fixture([new Error('Programming failure')])).calls, 1);
console.log('PASS: GET retries then success; bounded 5xx/network failures; exponential jitter backoff; quiet status clears; 4xx, writes, abort and external requests never retry.');
