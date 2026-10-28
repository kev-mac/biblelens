// Node-only adapter for the exact production handler and packaged static files.
// No public HTTP fallback: a missing asset must fail, including in offline tests.
import fs from 'node:fs';
import path from 'node:path';
import raw from '../dist/server/index.js';
const manifest = fs.existsSync('dist/asset-manifest.json') ? JSON.parse(fs.readFileSync('dist/asset-manifest.json','utf8')) : null;
const split = manifest?.mode === 'static';
const root = path.resolve('dist/client');
export const assets = {async fetch(request) {
  const pathname = decodeURIComponent(new URL(request.url).pathname);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) return new Response('Not found', {status:404});
  try {return new Response(await fs.promises.readFile(file));}
  catch {return new Response('Not found', {status:404});}
}};
export default {fetch(request, env = {}, ctx = {}) {
  return raw.fetch(request, {...env, ...(split ? {ASSETS: assets} : {})}, ctx);
}};

// Existing white-box checks exercise synchronous retrieval helpers in a VM.
// Hydrate those fixtures only; real API/browser checks use lazy production I/O.
export function inspectionSource() {
  let source = fs.readFileSync('dist/server/index.js', 'utf8');
  if (!manifest) return source;
  const read = url => JSON.parse(fs.readFileSync(path.join(root, url), 'utf8'));
  for (const [key, url] of Object.entries(manifest.parts)) source = source.replace('let ' + key + '=' + (['EVIDENCE','PEOPLE','TOPICS'].includes(key) ? '[]' : '{}'), () => 'let ' + key + '=' + JSON.stringify(read(url)));
  const index = read(manifest.index);
  source = source.replace('const MINI_INDEX={}', () => 'const MINI_INDEX=' + JSON.stringify(index));
  const chapters = Object.fromEntries(fs.readdirSync(path.join(root, manifest.prefix, 'chapters')).map(name => [name.replace('.json','').replace('-', ':'), read(manifest.prefix + 'chapters/' + name)]));
  const start = source.indexOf('const CHAPTERS='), end = source.indexOf(';\nconst STUDIES=', start);
  source = source.slice(0, start) + 'const CHAPTERS=' + JSON.stringify(chapters) + source.slice(end);
  return source.replace("await readPack(PACK_PREFIX+'chapters/'+key.replace(':','-')+'.json')", 'CHAPTERS[key]');
}
