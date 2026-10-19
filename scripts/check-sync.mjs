import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {syncRequest} from '../worker/sync.mjs';
import '../src/sync-core.js';
const core=globalThis.BibleLensSync;
const sqlite=new DatabaseSync(':memory:');
for(const file of fs.readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sqlite.exec(fs.readFileSync('drizzle/'+file,'utf8'));
class Statement{
 constructor(sql,args=[]){this.sql=sql;this.args=args;}
 bind(...args){return new Statement(this.sql,args);}
 async first(){return sqlite.prepare(this.sql).get(...this.args)||null;}
 async run(){return sqlite.prepare(this.sql).run(...this.args);}
}
const env={DB:{prepare:sql=>new Statement(sql),async batch(statements){sqlite.exec('BEGIN');try{const result=[];for(const s of statements)result.push(await s.run());sqlite.exec('COMMIT');return result;}catch(e){sqlite.exec('ROLLBACK');throw e;}}}};
async function call(path,{method='GET',user='alice',origin='https://bible.test',secret,body,csrf=true}={}){
 const headers={'content-type':'application/json',origin};if(csrf)headers['x-biblelens-sync']='1';if(user)headers['oai-authenticated-user-id']=user;if(secret)headers.authorization='Bearer '+secret;
 return syncRequest(new Request('https://bible.test/api/sync'+path,{method,headers,...(body?{body:JSON.stringify(body)}:{})}),env);
}
assert.equal((await call('/document',{user:null})).status,401);
assert.equal((await call('/document',{csrf:false})).status,403);
assert.equal((await call('/document',{origin:'https://evil.test'})).status,403);
assert.equal((await call('/document',{origin:'capacitor://localhost',user:'alice'})).status,401,'Native origins cannot use visitor identity headers');
assert.equal((await call('/document',{method:'OPTIONS',origin:'capacitor://localhost',user:null,csrf:false})).status,204);
let r=await call('/document');assert.deepEqual(await r.json(),{revision:0,data:{}});
assert.equal((await call('/document',{method:'PUT',body:{revision:0,data:{notes:{a:'first'}}}})).status,200);
assert.equal((await call('/document',{method:'PUT',body:{revision:0,data:{notes:{a:'stale overwrite'}}}})).status,409);
assert.equal((await call('/document',{method:'PUT',body:{revision:1,data:{notes:{a:'second'}}}})).status,200);
assert.equal((await (await call('/document',{user:'bob'})).json()).revision,0,'Accounts are isolated');
const pairing=await (await call('/pair',{method:'POST'})).json();assert.match(pairing.code,/^[a-f0-9]{4}(-[a-f0-9]{4}){3}$/);
const redemption=await call('/pair/redeem',{method:'POST',user:null,origin:'capacitor://localhost',body:{code:pairing.code}});assert.equal(redemption.status,200);
assert.equal(redemption.headers.get('access-control-allow-origin'),'capacitor://localhost');
const device=await redemption.json();assert.equal(device.userId,'alice');
assert.equal((await call('/pair/redeem',{method:'POST',user:null,body:{code:pairing.code}})).status,400,'Pairing codes are single-use');
assert.equal((await call('/document',{origin:'capacitor://localhost',user:null,secret:device.token})).status,200);
const rows=sqlite.prepare('SELECT * FROM sync_devices').all();assert(!JSON.stringify(rows).includes(device.token),'Only token hashes are stored');
await call('/disconnect',{method:'POST'});
assert.equal((await call('/document',{origin:'capacitor://localhost',user:null,secret:device.token})).status,401,'Revocation takes effect immediately');
const old=await (await call('/pair',{method:'POST'})).json();sqlite.exec('UPDATE sync_pair_codes SET expires_at=0');
assert.equal((await call('/pair/redeem',{method:'POST',user:null,body:{code:old.code}})).status,400);
const base=core.snapshot({bookmarks:['a'],verseNotes:{'0:1:1':{text:'Original',title:'Note'}},notes:{study:'Original'}});
const local=structuredClone(base),remote=structuredClone(base);local.verseNotes['0:1:1'].text='iPhone edit';remote.verseNotes['0:1:1'].text='Web edit';local.notes.local='Local note';remote.notes.remote='Remote note';delete local.bookmarks.a;
const merged=core.merge(base,local,remote);assert.equal(merged.conflicts,1);assert(merged.data.verseNotes['0:1:1'].text.includes('iPhone edit'));assert(merged.data.verseNotes['0:1:1'].text.includes('Web edit'));assert.equal(merged.data.notes.local,'Local note');assert.equal(merged.data.notes.remote,'Remote note');assert(!merged.data.bookmarks.a);
const edited=structuredClone(base);edited.notes.study='Changed elsewhere';const removed=structuredClone(base);delete removed.notes.study;
assert.equal(core.merge(base,removed,edited).data.notes.study,'Changed elsewhere','Deletion must not discard another device’s concurrent note edit');
const deleted=core.merge(base,removed,base);assert(!Object.hasOwn(deleted.data.notes,'study'),'Non-conflicting deletions propagate');
const withUnsafe=JSON.parse('{"notes":{"__proto__":{"polluted":true}}}');assert(!Object.hasOwn(core.merge({},withUnsafe,{}).data.notes,'__proto__'));
assert.equal({}.polluted,undefined);
const afterUpload=structuredClone(merged.data);afterUpload.notes.study='Typed while syncing';assert.equal(core.merge(local,afterUpload,merged.data).data.notes.study,'Typed while syncing');
const fontState={readerPreferences:{verseFont:'inter',categoryFont:'inter'}};
core.apply(fontState,{preferences:{navColors:'off',font:'system',verseFont:'system',categoryFont:'system'}});
assert.equal(fontState.readerPreferences.navColors,'off');assert.equal(core.snapshot(fontState).preferences.navColors,'off');assert.equal(fontState.readerPreferences.font,'system');assert.equal(core.snapshot(fontState).preferences.font,'system');
assert.deepEqual(fontState.verseNotes,{},'Font preference sync must not add note data');
sqlite.close();
console.log('PASS: schema migrations, account isolation, CSRF/origin checks, single-use/expiring device codes, hashed/revocable tokens, revision conflicts, offline edits, deletions and preservation of concurrent note text.');
const bookmarkBase=core.snapshot({bookmarks:[],verseBookmarks:{'0:1:1':{book:0,chapter:1,verse:1,name:'Genesis'}}});
const highlightLocal=structuredClone(bookmarkBase),highlightRemote=structuredClone(bookmarkBase);
highlightLocal.verseBookmarks['0:1:1'].highlights=[{edition:'kjv',start:0,end:2,text:'In'}];
highlightRemote.verseBookmarks['0:1:1'].highlights=[{edition:'kjv',start:3,end:6,text:'the'}];
const highlightMerge=core.merge(bookmarkBase,highlightLocal,highlightRemote).data;
assert.equal(highlightMerge.verseBookmarks['0:1:1'].highlights.length,2,'Concurrent selections on the same verse survive on both devices');
const removedHighlight=structuredClone(highlightLocal);delete removedHighlight.verseBookmarks['0:1:1'];
assert(!core.merge(highlightLocal,removedHighlight,highlightLocal).data.verseBookmarks['0:1:1'],'Non-conflicting unmarking still propagates');
console.log('PASS: concurrent saved text highlights merge without losing offline selections; bookmark deletions still propagate.');

const sameRange=structuredClone(highlightLocal);sameRange.verseBookmarks['0:1:1'].highlights[0].color='pink';
const recolored=structuredClone(highlightLocal);recolored.verseBookmarks['0:1:1'].highlights[0].color='blue';
const colorMerge=core.merge(bookmarkBase,sameRange,recolored).data.verseBookmarks['0:1:1'].highlights;
assert.equal(colorMerge.length,1);assert.equal(colorMerge[0].color,'pink','Concurrent recolors use the local choice without duplicating the range');
