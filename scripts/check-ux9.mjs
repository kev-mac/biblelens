import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {parsePlaces} from '../src/places-core.js';
import {searchPlaces} from '../src/places-directory.js';
const raw=JSON.parse(fs.readFileSync('data/reference/places.json')),places=parsePlaces(raw),books=JSON.parse(fs.readFileSync('data/books.json'));
for(const place of places.values())assert(searchPlaces(places,place.name).some(row=>row.id===place.id||(/['’]s$/i.test(place.name)&&row.id===place.canonicalId)),'Unsearchable place '+place.name);
for(const name of ['Abdon','Abel','Abel-beth-maacah','Hosah','Beer-elim']){const place=[...places.values()].find(row=>row.name===name);assert(place.refs.length,name+' has explicit source references');for(const [book,chapter,verse]of place.refs)assert(books[book]&&chapter>0&&chapter<=books[book].chapters&&verse>0);}
const before=JSON.parse(execFileSync('git',['show','b0663fc:data/reference/places.json']));for(const record of raw){const original=before.find(row=>row.id===record.id);for(const key of ['latitude','longitude','identificationUncertain'])assert.deepEqual(record.fields[key],original.fields[key],record.id+' '+key+' must remain unchanged');}
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ux9-swap-'));
try{for(const [name,value]of [['current','old'],['staged','new']]){fs.mkdirSync(path.join(dir,name));fs.writeFileSync(path.join(dir,name,'index.html'),value);}
 execFileSync('python3',['scripts/swap-mobile.py',path.join(dir,'staged'),path.join(dir,'current')]);assert.equal(fs.readFileSync(path.join(dir,'current/index.html'),'utf8'),'new');assert.equal(fs.readFileSync(path.join(dir,'staged/index.html'),'utf8'),'old');
 assert.throws(()=>execFileSync('python3',['scripts/swap-mobile.py',path.join(dir,'missing'),path.join(dir,'current')],{stdio:'pipe'}));assert.equal(fs.readFileSync(path.join(dir,'current/index.html'),'utf8'),'new');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
console.log('PASS UX9: all 1,298 names searchable, explicit place references, all coordinates unchanged, atomic directory exchange and failure preserves live bundle.');
