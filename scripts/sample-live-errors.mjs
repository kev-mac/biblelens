import fs from 'node:fs';
import {performance} from 'node:perf_hooks';
import {setTimeout as sleep} from 'node:timers/promises';

// Deliberately no retries, cookies, credentials, sign-in or writes: measure each GET.
const base = 'https://scripture-lens.kvn-mcgwn.chatgpt.site';
const output = process.argv[2] || '/Users/kevin/git/codex-reports/B5-live-sample.json';
const paths = ['/', '/release.json', '/api/books', '/api/chapter?book=0&chapter=1',
  '/api/search?q=mercy', '/api/comparisons?book=0&chapter=1&mode=history',
  '/reference/people.json', '/reference/places.json', '/assets/explore-places.webp', '/api/sync/session'];
const started = Date.now(), count = 200, durationMs = 600000, requests = [];
const report = {base, started: new Date(started).toISOString(), durationMs, count, requests};
function save() {
  report.summary = Object.fromEntries(paths.map(path => {
    const rows = requests.filter(row => row.path === path), failures = rows.filter(row => row.status >= 500);
    return [path, {requests: rows.length, errors5xx: failures.length,
      rate5xx: rows.length ? failures.length / rows.length : 0,
      networkErrors: rows.filter(row => row.status === null).length,
      exampleRays: failures.map(row => row.cfRay).filter(Boolean).slice(0, 3)}];
  }));
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
}
async function sample(index) {
  const path = paths[index % paths.length], begin = performance.now();
  const row = {index: index + 1, at: new Date().toISOString(), path, status: null, cfRay: null, runtimeErrorKind: null};
  try {
    const response = await fetch(base + path, {method: 'GET', redirect: 'manual',
      headers: {'cache-control': 'no-cache', ...(path === '/api/sync/session' ? {'X-BibleLens-Sync': '1'} : {})},
      signal: AbortSignal.timeout(60000)});
    row.status = response.status; row.cfRay = response.headers.get('cf-ray');
    if (response.status >= 500) {
      const body = await response.text();
      row.runtimeErrorKind = /site-runtime-error/.test(body) ? 'site-runtime-error' : null;
      row.errorKind = body.match(/(?:"kind"\s*:\s*"|data-error-kind=["'])([^"']+)/)?.[1] || null;
      row.bodyExcerpt = body.slice(0, 1000);
    } else await response.arrayBuffer();
  } catch (error) { row.error = error.message; }
  row.latencyMs = Math.round(performance.now() - begin);
  requests.push(row); requests.sort((a, b) => a.index - b.index); save();
  console.log(JSON.stringify(row));
}
const pending = [];
for (let index = 0; index < count; index++) {
  await sleep(Math.max(0, started + index * durationMs / (count - 1) - Date.now()));
  pending.push(sample(index));
}
await Promise.all(pending);
report.finished = new Date().toISOString(); save();
console.log(JSON.stringify(report.summary, null, 2));
