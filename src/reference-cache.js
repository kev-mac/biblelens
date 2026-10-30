// Bundles share one cache, including concurrent readers and directory modules.
// Only immutable public reference assets belong here; never cache user sync data.
const cache = globalThis[Symbol.for('biblelens.reference-cache')] ||= new Map();
export function referenceJson(path) {
 const url = new URL(path, globalThis.location?.href || 'https://biblelens.invalid/');
 if (!/^\/reference\/[\w-]+\.json$/.test(url.pathname) && !['/stories.json','/characters.json','/commandments-catalog.json','/api/books'].includes(url.pathname)) throw Error('Not a reference asset');
 // Older offline shells hold the people list without biographies. A versioned
 // request bypasses that old public cache; offline readers retain its fallback.
 const people=url.pathname==='/reference/people.json';
 if(people)url.searchParams.set('profile_context','1');
 const key = url.href;
 if (!cache.has(key)) {
  const controller = new AbortController();
  let timer;
  const deadline = new Promise((_, reject) => {timer = setTimeout(() => {controller.abort();reject(Error('Reference request timed out'));}, 20000);});
  const options={signal:controller.signal};
  const network=fetch(url.pathname+url.search,options);
  const response=people?network.catch(()=>fetch(url.pathname,options)):network;
  const request = Promise.race([response.then(response => {
   if (!response.ok) throw Error('Reference request failed (' + response.status + ')');
   return response.json();
  }), deadline]).finally(() => clearTimeout(timer));
  cache.set(key, request);
  request.catch(() => {if (cache.get(key) === request) cache.delete(key);});
 }
 return cache.get(key);
}
globalThis.BibleLensReferences = {json:referenceJson};
