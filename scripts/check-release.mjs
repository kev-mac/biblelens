import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {releaseInfo} from './release-info.mjs';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'biblelens-release-'));
try{
 for(const f of ['package.json','package-lock.json','capacitor.config.json','.openai/hosting.json']){fs.mkdirSync(path.dirname(path.join(dir,f)),{recursive:true});fs.writeFileSync(path.join(dir,f),f==='package.json'?'{"version":"1.0.0"}':'{}');}
 fs.mkdirSync(path.join(dir,'src'));fs.writeFileSync(path.join(dir,'src/app.js'),'first');
 const first=releaseInfo(dir);assert.equal(first.sourceHash,releaseInfo(dir).sourceHash);
 fs.mkdirSync(path.join(dir,'dist'));fs.writeFileSync(path.join(dir,'dist/generated.js'),'generated');assert.equal(first.sourceHash,releaseInfo(dir).sourceHash,'Generated output cannot change the source fingerprint');
 fs.writeFileSync(path.join(dir,'src/app.js'),'changed');assert.notEqual(first.sourceHash,releaseInfo(dir).sourceHash,'A runtime change must change the release identity');
 assert.equal(first.version,'1.0.0');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
console.log('PASS: deterministic release identity, generated-output exclusion and source drift detection.');
