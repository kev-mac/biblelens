// Isolated D1-compatible fixture. All credentials are synthetic and memory-only.
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {syncRequest} from '../worker/sync.mjs';
export function syncFixture(){
 const db=new DatabaseSync(':memory:');
 for(const file of fs.readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())db.exec(fs.readFileSync('drizzle/'+file,'utf8'));
 const statement=(sql,args=[])=>({bind:(...values)=>statement(sql,values),first:async()=>db.prepare(sql).get(...args)||null,run:async()=>db.prepare(sql).run(...args)});
 const env={DB:{prepare:statement,async batch(statements){db.exec('BEGIN');try{const values=[];for(const s of statements)values.push(await s.run());db.exec('COMMIT');return values;}catch(error){db.exec('ROLLBACK');throw error;}}}};
 const call=(path,{method='GET',body,token,user='security-test'}={})=>syncRequest(new Request('https://bible.test/api/sync'+path,{method,headers:{'content-type':'application/json','x-biblelens-sync':'1',...(token?{origin:'capacitor://localhost',authorization:'Bearer '+token}:{'oai-authenticated-user-id':user})},...(body?{body:JSON.stringify(body)}:{})}),env);
 const pair=async()=>{const {code}=await (await call('/pair',{method:'POST'})).json();return (await call('/pair/redeem',{method:'POST',body:{code}})).json();};
 return {env,call,pair,close:()=>db.close()};
}
