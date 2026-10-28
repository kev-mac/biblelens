'use strict';
const CACHE = 'biblelens-shell-' + /*__FINGERPRINT__*/'';
const SHELL = /*__SHELL__*/[];
const PUBLIC = new Set(SHELL);
self.addEventListener('install', event => {
 // addAll is atomic: a quota/network failure leaves the active version intact.
 event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL.map(path => new Request(path, {credentials:'omit', redirect:'error'})))));
});
self.addEventListener('activate', event => {
 event.waitUntil((async () => {
  for (const key of await caches.keys()) if(key.startsWith('biblelens-shell-') && key !== CACHE) await caches.delete(key);
  await self.clients.claim();
 })());
});
let corpus;
async function offlineChapter(url, cache) {
 const book = url.searchParams.get('book'), chapter = url.searchParams.get('chapter');
 if (!/^\d+$/.test(book || '') || !/^\d+$/.test(chapter || '')) return Response.error();
 if (!corpus) corpus = cache.match('/offline-bible.json').then(response => {
  if (!response) throw Error('Offline Bible unavailable');
  return response.json();
 }).catch(error => {corpus = null; throw error;});
 const encoded = (await corpus)[Number(book) + ':' + Number(chapter)];
 if (!encoded) return new Response('{"error":"Chapter not found"}', {status:404, headers:{'content-type':'application/json'}});
 const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
 return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')), {
  headers:{'content-type':'application/json', 'cache-control':'no-store'}
 });
}
self.addEventListener('fetch', event => {
 const request = event.request, url = new URL(request.url);
 // Explicit allowlist, before *any* cache lookup. Bypass credentials, auth,
 // private APIs, methods and query variants even if an old cache is poisoned.
 if (url.origin !== self.location.origin || request.method !== 'GET' || request.headers.has('authorization')) return;
 const chapter = url.pathname === '/api/chapter' && [...url.searchParams.keys()].every(key => ['book','chapter'].includes(key));
 if (url.pathname.startsWith('/api/') && url.pathname !== '/api/books' && !chapter) return;
 if (chapter) {
  event.respondWith(fetch(request).catch(async () => offlineChapter(url, await caches.open(CACHE))));
  return;
 }
 const path = url.pathname === '/index.html' ? '/' : url.pathname;
 if (!PUBLIC.has(path) || url.search) return;
 event.respondWith((async () => {
  const cache = await caches.open(CACHE);
  return await cache.match(path) || fetch(request);
 })());
});
