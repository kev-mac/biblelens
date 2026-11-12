import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
import {parsePlaces,loadPlaces} from '../src/places-core.js';
const rows=JSON.parse(fs.readFileSync('data/reference/places.json','utf8'));
const summaries=JSON.parse(fs.readFileSync('data/reference/place-summaries.json','utf8'));
// Exercise the exact build expression without running or writing an application build.
const source=fs.readFileSync('scripts/build.mjs','utf8');
const expression=source.match(/assets\['\/reference\/places\.json'\]\.body=(JSON\.stringify\(.*);/)[1];
const assets={'/reference/places.json':{body:JSON.stringify(rows)}};
const body=Function('assets','placeSummaries','placePassages','return '+expression)(assets,summaries,new Map());
const enriched=JSON.parse(body),parsed=parsePlaces(enriched);
for(const row of rows){
 assert.equal(parsed.get(row.id)?.summary,summaries[row.id]?.summary||'',row.id+' retains its complete summary');
 const {summary,linkedPassageCount,...originalFields}=enriched.find(item=>item.id===row.id).fields;
 assert.deepEqual(originalFields,row.fields,'Original metadata is preserved');
}
const original=globalThis.fetch,calls=[];
globalThis.fetch=async url=>{calls.push(url);return {ok:true,json:async()=>enriched};};
try{
 const other=await import('../src/places-core.js?separate-bundle');
 const [first,second]=await Promise.all([loadPlaces(),other.loadPlaces()]);
 assert.deepEqual(first,second);
 assert.equal(calls.length,1,'Separate UI bundles share one request and response');
 assert.equal(calls[0],'/reference/places.json?profile_context=1','Bypass obsolete summary-less web caches');
 for(const [id,place] of first)assert.equal(place.summary,summaries[id]?.summary||'');
}finally{globalThis.fetch=original;}
for(const entry of ['src/reference-links.js','src/places-directory-entry.js','src/places.js','src/components/characters/CharactersView.tsx']){
 const result=await build({entryPoints:[entry],bundle:true,write:false,minify:true,metafile:true,format:'iife',platform:'browser',target:['safari17','chrome119']});
 assert(!Object.keys(result.metafile.inputs).some(path=>path.endsWith('/place-summaries.json')),'No repeated summary blob in '+entry);
 console.log(entry+': '+result.outputFiles[0].contents.length+' bytes; no embedded place summaries');
}
const mobile=fs.readFileSync('scripts/stage-mobile.mjs','utf8');
assert(mobile.includes('Object.entries(mobileBundle.assets)'),'Native packaging copies the same shared reference asset');
console.log('PASS: all '+rows.length+' summaries preserved, metadata intact, one cross-bundle fetch, and shared offline asset packaging.');
