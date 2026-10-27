// Bundles share one cache, including concurrent readers and directory modules.
// Only immutable public reference assets belong here; never cache user sync data.
const cache = globalThis[Symbol.for('biblelens.reference-cache')] ||= new Map();
export function referenceJson(path) {
 const url = new URL(path, globalThis.location?.href || 'https://biblelens.invalid/');
 if (!/^\/reference\/[\w-]+\.json$/.test(url.pathname) && !['/stories.json','/characters.json','/api/books'].includes(url.pathname)) throw Error('Not a reference asset');
 const key = url.href;
 if (!cache.has(key)) {
  const controller = new AbortController();
  let timer;
  const deadline = new Promise((_, reject) => {timer = setTimeout(() => {controller.abort();reject(Error('Reference request timed out'));}, 20000);});
  const request = Promise.race([fetch(path, {signal:controller.signal}).then(response => {
   if (!response.ok) throw Error('Reference request failed (' + response.status + ')');
   return response.json();
  }), deadline]).finally(() => clearTimeout(timer));
  cache.set(key, request);
  request.catch(() => {if (cache.get(key) === request) cache.delete(key);});
 }
 return cache.get(key);
}
globalThis.BibleLensReferences = {json:referenceJson};
