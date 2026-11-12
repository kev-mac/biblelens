// Public scripture only. Resolve fetch at request time so native/offline and
// read-retry transports stay in control. Each consumer owns its cancellation.
export function createChapterLoader(target = globalThis, {limit = 64, timeoutMs = 15000} = {}) {
 const cache = new Map();
 const abortError = () => Object.assign(new Error('Chapter request cancelled.'), {name:'AbortError'});
 function request(url, key) {
  const controller = typeof target.AbortController === 'function' ? new target.AbortController() : null;
  const entry = {controller, active:0, settled:false, promise:null};
  const remove = () => {if (key !== undefined && cache.get(key) === entry) cache.delete(key);};
  entry.remove = remove;
  let response;
  try {response = target.fetch(url, controller ? {signal:controller.signal} : undefined);}
  catch (error) {response = Promise.reject(error);}
  entry.promise = Promise.resolve(response).then(response => {
   if (!response.ok) throw Error('The reader request failed (' + response.status + ').');
   return response.json();
  }).then(value => {entry.settled = true; return value;}, error => {entry.settled = true; remove(); throw error;});
  // A transport may ignore abort and settle after its last caller has left.
  entry.promise.catch(() => {});
  return entry;
 }
 function consume(entry, options = {}) {
  const {signal} = options, deadline = options.timeoutMs ?? timeoutMs;
  return new Promise((resolve, reject) => {
   let done = false, timer;
   entry.active++;
   function finish(callback, value) {
    if (done) return;
    done = true;
    if (timer !== undefined) target.clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
    entry.active--;
    if (!entry.settled && entry.active === 0) {
     entry.remove();
     entry.controller?.abort();
    }
    callback(value);
   }
   const cancel = () => finish(reject, signal.reason || abortError());
   signal?.addEventListener('abort', cancel, {once:true});
   if (signal?.aborted) {cancel(); return;}
   timer = target.setTimeout(() => finish(reject, Object.assign(new Error('The reader request timed out.'), {name:'TimeoutError'})), deadline);
   entry.promise.then(value => finish(resolve, value), error => finish(reject, error));
  });
 }
 function get(book, chapter, options = {}) {
  if (!Number.isInteger(book) || book < 0 || !Number.isInteger(chapter) || chapter < 1) return Promise.reject(Error('Invalid chapter reference'));
  if (options.signal?.aborted) return Promise.reject(options.signal.reason || abortError());
  const key = book + ':' + chapter;
  let entry = cache.get(key);
  if (!entry) entry = request(`/api/chapter?book=${book}&chapter=${chapter}`, key);
  cache.delete(key); cache.set(key, entry);
  // Evict only the lookup. Existing consumers keep their in-flight request.
  while (cache.size > limit) cache.delete(cache.keys().next().value);
  return consume(entry, options);
 }
 function json(url, options = {}) {
  const match = /^\/api\/chapter\?book=(\d+)&chapter=(\d+)$/.exec(url);
  if (match) return get(Number(match[1]), Number(match[2]), options);
  if (url !== '/api/books') return Promise.reject(Error('Not a public reader endpoint'));
  if (options.signal?.aborted) return Promise.reject(options.signal.reason || abortError());
  return consume(request(url), options);
 }
 return {get, json};
}

const loader = globalThis[Symbol.for('biblelens.chapter-loader')] ||= createChapterLoader();
export const getChapter = (...args) => loader.get(...args);
globalThis.BibleLensChapters = loader;
