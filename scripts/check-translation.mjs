import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {alignmentHtml,createChapterLoader} from '../src/translation-core.js';
import {publicTranslationResponse} from '../worker/public-translation.mjs';
import {translationAssets} from './translation-assets.mjs';
const manifest=JSON.parse(fs.readFileSync('data/translation/manifest.json','utf8'));
const assets={},remote=translationAssets(assets);
assert.equal(Object.keys(assets).length,1189);assert.equal(manifest.coverage.verses,31086);assert.equal(manifest.coverage.missing.length,19);
let count=0,total=0,gaps=0;
for(const [name,file]of Object.entries(manifest.files)){
 const bytes=fs.readFileSync('data/translation/bsb-v1/'+name),chapter=JSON.parse(gunzipSync(bytes));
 assert.equal(bytes.length,file.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256);
 count+=Object.keys(chapter.verses).length;total+=bytes.length;
 for(const verse of Object.values(chapter.verses))for(const token of verse.tokens){
  assert(['Hebrew','Aramaic','Greek'].includes(token[3]));assert(!/[<>]/.test(token.slice(0,3).join('')));if(token[1]&&!token[2])gaps++;
 }
}
assert.equal(gaps,4);assert.equal(count,31086);assert.equal(total,7078262);
const get=(b,c,v)=>JSON.parse(gunzipSync(fs.readFileSync('data/translation/bsb-v1/'+b+'-'+c+'.json.gz'))).verses[v];
const genesis=get(0,1,28),phrases=genesis.tokens.map(t=>t[0]);
for(const phrase of ['Be fruitful','and multiply','and fill','the earth','and subdue it'])assert(phrases.includes(phrase));
assert(phrases.indexOf('Be fruitful')<phrases.indexOf('and multiply'));
assert(get(42,1,1).tokens.every(t=>t[3]==='Greek'));
assert.deepEqual([...new Set(get(26,2,4).tokens.map(t=>t[3]))],['Hebrew','Aramaic']);
assert.equal(get(39,17,21),undefined);
const html=alignmentHtml(genesis);assert(html.includes('dir="ltr"'));assert(html.includes('lang="he" dir="rtl"'));assert(html.indexOf('Be fruitful')<html.indexOf('and multiply'));
assert(alignmentHtml(get(42,1,1)).includes('lang="grc" dir="ltr"'));
assert(alignmentHtml(null).includes('unavailable'));
assert(alignmentHtml({tokens:[['<img onerror=x>','<svg>','&','Hebrew','']]}).includes('&lt;img'));
assert(!alignmentHtml({tokens:[['<img>','x','x','Hebrew','']]}).includes('<img>'));
assert(alignmentHtml({tokens:[['added','word','latin','Greek','',1]]}).includes('Word link unavailable'));
let requests=0;
const loader=createChapterLoader(async()=>{requests++;return new Response(fs.readFileSync('data/translation/bsb-v1/0-1.json.gz'));});
await Promise.all([loader(0,1),loader(0,1)]);assert.equal(requests,1);assert.equal(await loader(66,1),null);
let attempts=0;const retry=createChapterLoader(async()=>{if(++attempts===1)throw Error('offline');return new Response(fs.readFileSync('data/translation/bsb-v1/0-1.json.gz'));});
await assert.rejects(retry(0,1));await retry(0,1);assert.equal(attempts,2);
const missing=createChapterLoader(async()=>new Response('',{status:404}));assert.equal(await missing(0,1),null);
const file=remote['/translation/bsb-v1/0-1.json.gz'],bytes=fs.readFileSync('data/translation/bsb-v1/0-1.json.gz');
let upstream;
const response=await publicTranslationResponse(new Request('https://site/translation/bsb-v1/0-1.json.gz?private=secret',{headers:{authorization:'private',cookie:'private'}}),file,{},{
 fetcher:async(url,options)=>{upstream={url,options};return new Response(bytes);},cache:{match:async()=>null,put:async()=>{}}
});
assert.equal(response.status,200);assert.deepEqual(Buffer.from(await response.arrayBuffer()),bytes);
assert.equal(upstream.url,file.url);assert(!JSON.stringify(upstream).includes('private'));assert.equal(upstream.options.redirect,'manual');
for(const data of [Buffer.from('corrupt'),Buffer.alloc(bytes.length)])assert.equal((await publicTranslationResponse(new Request('https://site/chapter'),file,{}, {fetcher:async()=>new Response(data)})).status,503);
assert.equal((await publicTranslationResponse(new Request('https://site/chapter',{method:'POST'}),file)).status,405);
assert.equal((await publicTranslationResponse(new Request('https://site/chapter',{method:'HEAD'}),file)).status,200);
assert.equal((await publicTranslationResponse(new Request('https://site/chapter',{headers:{'if-none-match':'"'+file.sha256+'"'}}),file)).status,304);
if(fs.existsSync('dist/server/index.js')){
 const size=fs.statSync('dist/server/index.js').size;assert(size<=66060288,'Worker exceeds unchanged 63 MiB limit: '+size);
 const study=fs.readdirSync('dist/client/assets').find(name=>/^study\..*\.css$/.test(name));assert(fs.readFileSync('dist/client/assets/'+study,'utf8').includes('.translation-tiles'),'Study CSS retains translation layout');
 const built=fs.readFileSync('dist/server/index.js','utf8');assert(built.includes('PUBLIC_TRANSLATIONS'));assert(!built.includes(bytes.toString('base64')),'Chapter gzip bytes must not be embedded');
}
if(fs.existsSync('www/translation'))for(const name of Object.keys(manifest.files))assert.deepEqual(fs.readFileSync('www/translation/bsb-v1/'+name),fs.readFileSync('data/translation/bsb-v1/'+name));
console.log('PASS: 1189 verified chapters; 31086 verses; Hebrew/Greek/mixed Aramaic; missing references; escaped markup; English order; loader cache/retry; origin isolation; integrity failure; methods/cache; Worker budget; native parity when built.');


