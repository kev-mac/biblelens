import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {b4SourceHash,b4Content,b4Proposals,contentFiles} from './b4-neutral.mjs';

const original=process.cwd(),root=fs.mkdtempSync(path.join(os.tmpdir(),'biblelens-b4-lines-'));
const lf=JSON.stringify([{title:'Evidence agrees',text:'An exact quotation stays unchanged.'}],null,2)+'\n';
const crlf=lf.replace(/\n/g,'\r\n');
assert.equal(b4SourceHash(lf),b4SourceHash(crlf));
assert.notEqual(b4SourceHash(lf),b4SourceHash(lf.replace('exact quotation','changed quotation')));
assert.notEqual(b4SourceHash(lf),b4SourceHash(lf.replace('  ','   ')),'Only newline encoding is normalized');
try{
 process.chdir(root);
 for(const file of contentFiles){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,lf);}
 fs.mkdirSync('research/b4',{recursive:true});
 const staged=b4Proposals();fs.writeFileSync('research/b4/wording-proposals.json',JSON.stringify(staged));
 const expected=b4Content(contentFiles[0],{BIBLELENS_DRAFTS:'1'});
 for(const file of contentFiles){
  fs.writeFileSync(file,crlf);
  assert.equal(b4Content(file,{BIBLELENS_DRAFTS:'1'}),expected,'CRLF preserves reviewed content and wording decisions');
  assert.equal(b4Content(file,{}),crlf,'Production source is not rewritten');
 }
 assert.deepEqual(b4Proposals(),staged,'Generated review hashes are platform-independent');
 fs.writeFileSync(contentFiles[0],crlf.replace('exact quotation','changed quotation'));
 assert.throws(()=>b4Content(contentFiles[0],{BIBLELENS_DRAFTS:'1'}),/B4 source needs review/);
 fs.writeFileSync(contentFiles[0],crlf);
 staged.collections[contentFiles[0]][0].draft='Different reviewed wording';
 fs.writeFileSync('research/b4/wording-proposals.json',JSON.stringify(staged));
 assert.throws(()=>b4Content(contentFiles[0],{BIBLELENS_DRAFTS:'1'}),/B4 wording proposals need review/);
}finally{process.chdir(original);fs.rmSync(root,{recursive:true,force:true});}
console.log('PASS: LF/CRLF review-hash parity; changed content, whitespace and wording decisions still require review; production bytes remain untouched.');
