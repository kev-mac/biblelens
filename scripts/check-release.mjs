import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {releaseInfo} from './release-info.mjs';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'biblelens-release-'));
try{
 for(const f of ['package.json','package-lock.json','capacitor.config.json','.openai/hosting.json']){fs.mkdirSync(path.dirname(path.join(dir,f)),{recursive:true});fs.writeFileSync(path.join(dir,f),f==='package.json'?'{"version":"1.0.0","buildNumber":219}':'{}');}
 fs.mkdirSync(path.join(dir,'src'));fs.writeFileSync(path.join(dir,'src/app.js'),'first');
 const first=releaseInfo(dir);assert.equal(first.sourceHash,releaseInfo(dir).sourceHash);
 fs.mkdirSync(path.join(dir,'dist'));fs.writeFileSync(path.join(dir,'dist/generated.js'),'generated');assert.equal(first.sourceHash,releaseInfo(dir).sourceHash,'Generated output cannot change the source fingerprint');
 fs.writeFileSync(path.join(dir,'src/app.js'),'changed');assert.notEqual(first.sourceHash,releaseInfo(dir).sourceHash,'A runtime change must change the release identity');
 assert.equal(first.version,'1.0.0');assert.equal(first.buildNumber,219);
 fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({version:'1.0.0',buildNumber:220}));const next=releaseInfo(dir);assert.equal(next.buildNumber,220);assert.notEqual(next.sourceHash,first.sourceHash);
 for(const buildNumber of [undefined,0,-1,1.5,'219']){fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({version:'1.0.0',buildNumber}));assert.throws(()=>releaseInfo(dir),/buildNumber/);}
}finally{fs.rmSync(dir,{recursive:true,force:true});}
console.log('PASS: deterministic release identity, generated-output exclusion and source drift detection.');

// Web and iOS execute the same settings renderer and show the same build metadata.
const {default:vm}=await import('node:vm');
for(const native of [false,true]){
 const version={},status={},button={};let ready;
 const panel={querySelector:selector=>selector==='[data-release-version]'?version:selector==='[data-release-status]'?status:button};
 const installed={version:'1.1.0',buildNumber:219,sourceHash:'abcdef0123456789'};
 let remote={...installed};
 const context={AbortSignal,document:{addEventListener:(event,fn)=>ready=fn,createElement:()=>panel,querySelector:()=>({append(){}}),documentElement:{classList:{contains:()=>native}}},fetch:async url=>({json:async()=>url==='/release.json'?installed:remote})};
 vm.createContext(context);vm.runInContext(fs.readFileSync('src/release.js','utf8'),context);await ready();await button.onclick();
 assert.equal(version.textContent,'1.1.0 · Build 219 · abcdef012345');assert.equal(status.textContent,'This app matches the website release.');
 remote={...installed,buildNumber:220};await button.onclick();assert(status.textContent.includes(native?'Install the latest iPhone build':'Reload this page'));
}
assert(fs.readFileSync('scripts/prepare-release.mjs','utf8').includes("'CURRENT_PROJECT_VERSION='+release.buildNumber"));
console.log('PASS: shared Build 219 settings label on web/iOS, build mismatch detection, and native CFBundleVersion uses release metadata.');
