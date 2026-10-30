import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';

// Default: compressed lazy assets preserve the existing Sites ESM contract.
// Opt-in static mode removes their bytes and needs Cloudflare's ASSETS binding.
export function splitWorker(source, output = 'dist', external = false) {
  const context = {Response, Blob, DecompressionStream, Uint8Array, atob};
  vm.createContext(context);
  vm.runInContext(source.slice(0, source.indexOf('async function chat(')) +
    '\nthis.data={BOOKS,CHAPTERS,STUDIES,EVIDENCE,ASSETS,SEARCH,MINI_INDEX,VOCABULARY,PEOPLE,TOPICS};', context);
  const data = context.data;
  const prefix = '/_biblelens/' + createHash('sha256').update(source).digest('hex').slice(0, 16) + '/';
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
  source = source.replace('const ASSETS=' + JSON.stringify(data.ASSETS), 'const ASSETS=' + JSON.stringify(metadata));
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
  const compressed = Object.fromEntries(Object.entries(assets).map(([url, asset]) => [url==='/'?'/index.html':url, gzipSync(asset.encoding==='base64'?Buffer.from(asset.body,'base64'):Buffer.from(asset.body),{level:9}).toString('base64')]));
  const embedded = external ? 'const EMBEDDED_ASSETS=null;\n' : `
const COMPRESSED_ASSETS=${JSON.stringify(compressed)};
const EMBEDDED_ASSETS={async fetch(request){
 const encoded=COMPRESSED_ASSETS[new URL(request.url).pathname];
 if(!encoded)return new Response('Not found',{status:404});
 const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));
 return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')));
}};
`;
  source=source.replace('export default {async fetch',()=>embedded+'\nexport default {async fetch');
  // Keep the response policy on every route, including release and lazy APIs.
  source=source.replace('export default {async fetch', 'const packagedWorker={async fetch');
  source+=`\nexport default {async fetch(request,env,ctx){
 const response=await packagedWorker.fetch(request,env,ctx);
 const headers=new Headers(response.headers);
 headers.set('content-security-policy-report-only',ASSETS['/'].csp);
 headers.set('content-security-policy',"object-src 'none'; base-uri 'none'; form-action 'self'; worker-src 'self'");
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}};\n`;
  const sizes = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, Buffer.byteLength(JSON.stringify(value))]));
  fs.writeFileSync(path.join(output, 'asset-manifest.json'), JSON.stringify({mode:external?'static':'compressed',prefix, parts, index, sizes, splitBytes, before: Buffer.byteLength(fs.readFileSync(path.join(output, 'server/index.js'))), after: Buffer.byteLength(source)}, null, 2));
  fs.writeFileSync(path.join(output, 'server/index.js'), source);
  // Standard Cloudflare contract, deliberately separate from Sites metadata.
  fs.writeFileSync(path.join(output, 'wrangler.json'), JSON.stringify({name:'biblelens', main:'server/index.js', compatibility_date:'2026-10-28', assets:{directory:'client',binding:'ASSETS',run_worker_first:true}}, null, 2));
  return source;
}
