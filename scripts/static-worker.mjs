import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {encodeEmbeddedAsset,decodeEmbeddedAsset} from './embedded-encoding.mjs';
import {createEmbeddedByteCache} from '../worker/embedded-bytes.mjs';

// Default: compressed lazy assets preserve the existing Sites ESM contract.
// Opt-in static mode removes their bytes and needs Cloudflare's ASSETS binding.
export function splitWorker(source, output = 'dist', external = false, publicArtwork = {}, preparedAssets) {
  // Reuse the build's asset table without allocating and parsing another full
  // artwork payload. Stream the same JSON bytes to preserve immutable prefixes.
  const assetBounds = text => {
    const start = text.indexOf('const ASSETS=');
    const ends = [text.indexOf(';\nconst SEARCH=', start), text.indexOf(';\nlet SEARCH=', start)].filter(end => end >= 0);
    const end = ends.length ? Math.min(...ends) : -1;
    if (start < 0 || end < 0) throw Error('Missing asset declaration boundary');
    return {start, value: start + 'const ASSETS='.length, end};
  };
  const fingerprint = createHash('sha256');
  let beforeBytes = 0;
  const hash = text => {fingerprint.update(text); beforeBytes += Buffer.byteLength(text);};
  if (preparedAssets) {
    const bounds = assetBounds(source);
    hash(source.slice(0, bounds.value)); hash('{');
    let first = true;
    for (const [url, asset] of Object.entries(preparedAssets)) {
      if (!first) hash(','); first = false;
      hash(JSON.stringify(url)); hash(':'); hash(JSON.stringify(asset));
    }
    hash('}'); hash(source.slice(bounds.end));
  } else hash(source);
  const context = {Response, Blob, DecompressionStream, Uint8Array, atob};
  vm.createContext(context);
  vm.runInContext(source.slice(0, source.indexOf('async function chat(')) +
    '\nthis.data={BOOKS,CHAPTERS,STUDIES,EVIDENCE,ASSETS,SEARCH,MINI_INDEX,VOCABULARY,PEOPLE,TOPICS};', context);
  const data = context.data;
  if (preparedAssets) data.ASSETS = preparedAssets;
  const prefix = '/_biblelens/' + fingerprint.digest('hex').slice(0, 16) + '/';
  const assets = {...data.ASSETS};
  const pack = (name, value) => {
    const url = prefix + name + '.json';
    assets[url] = {type: 'application/json; charset=utf-8', body: JSON.stringify(value)};
    return url;
  };
  const parts = {};
  for (const key of ['EVIDENCE', 'PEOPLE', 'TOPICS', 'SEARCH', 'VOCABULARY']) {
    parts[key] = pack(key.toLowerCase(), data[key]);
    const literal = JSON.stringify(data[key]);
    // Build sources retain whitespace in JSON literals. Locate declaration end
    // through the next declaration/function boundary rather than string equality.
    const start = source.indexOf('const ' + key + '=');
    if (start < 0) throw Error('Missing split declaration: ' + key);
    const tail = source.slice(start + ('const ' + key + '=').length);
    // JSON.parse can identify the original literal via source corpus values.
    let end;
    if (tail.startsWith(literal + ';')) end = start + ('const ' + key + '=').length + literal.length;
    else {
      // EVIDENCE is the only raw, formatted corpus literal among these.
      const raw = fs.readFileSync('data/evidence.json', 'utf8');
      if (key !== 'EVIDENCE' || !tail.startsWith(raw + ';')) throw Error('Unexpected declaration: ' + key);
      end = start + ('const ' + key + '=').length + raw.length;
    }
    source = source.slice(0, start) + 'let ' + key + '=' + (Array.isArray(data[key]) ? '[]' : '{}') + source.slice(end);
  }
  // One 9.75 MB asset avoids 66 first-search subrequests. It remains below
  // Cloudflare's static asset file limit; ranking still visits the same shards.
  const index = pack('search/index', data.MINI_INDEX);
  const offline = pack('offline-bible',data.CHAPTERS);
  source=source.replace("request.method==='GET'?json(CHAPTERS)","request.method==='GET'?json(await readPack("+JSON.stringify(offline)+"))");
  source = source.replace('const MINI_INDEX=' + JSON.stringify(data.MINI_INDEX), 'const MINI_INDEX={}');
  const chapterStart = source.indexOf('const CHAPTERS=');
  const chapterEnd = source.indexOf(';\nconst STUDIES=', chapterStart);
  if (chapterEnd < 0) throw Error('Missing chapter boundary');
  for (const [key, encoded] of Object.entries(data.CHAPTERS)) pack('chapters/' + key.replace(':', '-'), encoded);
  source = source.slice(0, chapterStart) + 'const CHAPTERS=' + JSON.stringify(Object.fromEntries(Object.keys(data.CHAPTERS).map(key => [key, true]))) + source.slice(chapterEnd);
  source = source.replace('atob(CHAPTERS[key])', "atob(await readPack(PACK_PREFIX+'chapters/'+key.replace(':','-')+'.json'))");
  // Hosting owns HTTP compression. Keep storage compressed below, but expose
  // only identity asset bodies and omit negotiation metadata from the handler.
  const metadata = Object.fromEntries(Object.entries(data.ASSETS).map(([url, {body,gzip,...meta}]) => [url,meta]));
  const bounds = assetBounds(source);
  source = source.slice(0, bounds.start) + 'const ASSETS=' + JSON.stringify(metadata) + source.slice(bounds.end);
  source = source.replace("new Response(ASSETS['/release.json'].body,", "new Response(await assetBody('/release.json'),");
  source = source.replace("asset.encoding==='base64'?Uint8Array.from(atob(asset.body),char=>char.charCodeAt(0)):asset.body", "await assetBody(url.pathname==='/index.html'?'/':url.pathname)");
  const loader = `
const PACK_PREFIX=${JSON.stringify(prefix)}, PACKS=${JSON.stringify(parts)}, SEARCH_PACKS=${JSON.stringify(index)};
let assetStore;
const packRequests=new Map();
async function assetBody(path){
 const response=await assetStore.fetch(new Request('https://assets.biblelens.invalid'+(path==='/'?'/index.html':path)));
 if(!response.ok)throw Error('Packaged asset unavailable: '+path);
 return response.body;
}
async function readPack(path){
 const response=await assetStore.fetch(new Request('https://assets.biblelens.invalid'+path));
 if(!response.ok)throw Error('Packaged data unavailable: '+path);
 return response.json();
}
async function loadPack(key){
 if(!packRequests.has(key)){
  const pending=readPack(PACKS[key]).then(value=>{switch(key){
   case 'EVIDENCE': EVIDENCE=value;break;case 'PEOPLE':PEOPLE=value;break;
   case 'TOPICS':TOPICS=value;break;case 'SEARCH':SEARCH=value;break;case 'VOCABULARY':VOCABULARY=value;break;
  }}).catch(error=>{packRequests.delete(key);throw error;});packRequests.set(key,pending);
 }
 await packRequests.get(key);
}
async function prepareAssets(request,env){
 assetStore=EMBEDDED_ASSETS||env.ASSETS;
 if(!assetStore?.fetch)throw Error('Split Worker requires the ASSETS binding');
 const path=new URL(request.url).pathname;
 if(path==='/reference/people.json')await loadPack('PEOPLE');
 if(path==='/reference/topics.json')await loadPack('TOPICS');
 if(['/api/search','/api/chat','/api/categories','/api/marked-comparisons','/api/comparisons','/api/debates','/api/debate'].includes(path))await loadPack('EVIDENCE');
 if(['/api/search','/api/chat','/api/categories'].includes(path))await loadPack('PEOPLE');
 if(['/api/search','/api/chat'].includes(path)){
  await Promise.all(['TOPICS','SEARCH','VOCABULARY'].map(loadPack));
  if(!packRequests.has('index'))packRequests.set('index',readPack(SEARCH_PACKS).then(index=>Object.assign(MINI_INDEX,index)).catch(error=>{packRequests.delete('index');throw error;}));
  await packRequests.get('index');
 }
}
`;
  // Sync requests use the original guards and storage path, without asset reads.
  source = source.replace('export default {async fetch(request,env,ctx){const url=new URL(request.url);', loader + '\nexport default {async fetch(request,env,ctx){const url=new URL(request.url);if(!url.pathname.startsWith(\'/api/sync\')){try{await prepareAssets(request,env);}catch{return json({error:"Packaged assets unavailable."},503);}}');
  for (const [url, asset] of Object.entries(assets)) {
    const file = path.join(output, 'client', url === '/' ? 'index.html' : url.slice(1));
    fs.mkdirSync(path.dirname(file), {recursive: true});
    fs.writeFileSync(file, asset.encoding === 'base64' ? Buffer.from(asset.body, 'base64') : asset.body);
  }
  const splitBytes = Buffer.byteLength(source) + Buffer.byteLength('const EMBEDDED_ASSETS=null;\n');
  // The offline corpus and individual chapter routes share one encoded copy.
  // Keeping both compressed representations embedded doubled the Bible bytes.
  const chapterPaths=new Map(Object.keys(data.CHAPTERS).map(key=>[prefix+'chapters/'+key.replace(':','-')+'.json',key]));
  const compressed={},aliases={},bodies=new Map();
  for(const [url,asset]of Object.entries(assets)){
    if(!external&&(url===offline||chapterPaths.has(url)||publicArtwork[url]))continue;
    const route=url==='/'?'/index.html':url;
    const body=encodeEmbeddedAsset(gzipSync(asset.encoding==='base64'?Buffer.from(asset.body,'base64'):Buffer.from(asset.body),{level:9}));
    if(bodies.has(body))aliases[route]=bodies.get(body);
    else {bodies.set(body,route);compressed[route]=body;}
  }
  const embedded = external ? 'const EMBEDDED_ASSETS=null;\n' : `
const COMPRESSED_ASSETS=${JSON.stringify(compressed)};
${decodeEmbeddedAsset.toString()}
const ASSET_ALIASES=${JSON.stringify(aliases)},CHAPTER_PACKS=${JSON.stringify(data.CHAPTERS)},CHAPTER_PATHS=${JSON.stringify(Object.fromEntries(chapterPaths))};
${createEmbeddedByteCache.toString()}
const BINARY_PATHS=new Set(${JSON.stringify(Object.entries(assets).filter(([,asset])=>asset.encoding==='base64').map(([url])=>url))});
const binaryBytes=createEmbeddedByteCache(async path=>{
 const bytes=decodeEmbeddedAsset(COMPRESSED_ASSETS[path]);
 return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
});
const EMBEDDED_ASSETS={async fetch(request){
 const path=new URL(request.url).pathname;
 if(path===${JSON.stringify(offline)})return new Response(JSON.stringify(CHAPTER_PACKS));
 if(CHAPTER_PATHS[path])return new Response(JSON.stringify(CHAPTER_PACKS[CHAPTER_PATHS[path]]));
 const encoded=COMPRESSED_ASSETS[path]||COMPRESSED_ASSETS[ASSET_ALIASES[path]];
 if(!encoded)return new Response('Not found',{status:404});
 if(BINARY_PATHS.has(path))return new Response(await binaryBytes(ASSET_ALIASES[path]||path));
 const bytes=decodeEmbeddedAsset(encoded);
 return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')));
}};
`;
  source=source.replace('export default {async fetch',()=>embedded+'\nexport default {async fetch');
  // Keep the response policy on every route, including release and lazy APIs.
  source=source.replace('export default {async fetch', 'const packagedWorker={async fetch');
  const artworkLoader=fs.readFileSync('worker/public-artwork.mjs','utf8').replace('export async function','async function');
  source+=`\nconst PUBLIC_ARTWORK=${JSON.stringify(external?{}:publicArtwork)};
${artworkLoader}
export default {async fetch(request,env,ctx){
 const art=PUBLIC_ARTWORK[new URL(request.url).pathname];
 const response=art?await publicArtworkResponse(request,art,ctx):await packagedWorker.fetch(request,env,ctx);
 const headers=new Headers(response.headers);
 headers.set('content-security-policy-report-only',ASSETS['/'].csp);
 headers.set('content-security-policy',"object-src 'none'; base-uri 'none'; form-action 'self'; worker-src 'self'");
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}};\n`;
  const sizes = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, Buffer.byteLength(JSON.stringify(value))]));
  fs.writeFileSync(path.join(output, 'asset-manifest.json'), JSON.stringify({mode:external?'static':'compressed',prefix, parts, index, sizes, splitBytes, publicArtwork:Object.keys(publicArtwork), before: beforeBytes, after: Buffer.byteLength(source)}, null, 2));
  fs.writeFileSync(path.join(output, 'server/index.js'), source);
  // Standard Cloudflare contract, deliberately separate from Sites metadata.
  fs.writeFileSync(path.join(output, 'wrangler.json'), JSON.stringify({name:'biblelens', main:'server/index.js', compatibility_date:'2026-10-28', assets:{directory:'client',binding:'ASSETS',run_worker_first:true}}, null, 2));
  return source;
}
