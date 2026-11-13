import fs from 'node:fs';
import {createHash} from 'node:crypto';
export function translationAssets(assets){
 const manifest=JSON.parse(fs.readFileSync('data/translation/manifest.json','utf8')),remote={};
 if(!/^[a-f0-9]{40}$/.test(manifest.sourceCommit))throw Error('Translation data requires an immutable source commit');
 for(const [name,file]of Object.entries(manifest.files)){
  if(!/^\d{1,2}-\d{1,3}\.json\.gz$/.test(name))throw Error('Invalid translation chapter path');
  const bytes=fs.readFileSync('data/translation/bsb-v1/'+name);
  if(bytes.length!==file.bytes||createHash('sha256').update(bytes).digest('hex')!==file.sha256)throw Error('Translation chapter integrity: '+name);
  const url='/translation/bsb-v1/'+name;
  assets[url]={type:'application/gzip',encoding:'base64',body:bytes.toString('base64')};
  remote[url]={url:'https://raw.githubusercontent.com/kev-mac/biblelens/'+manifest.sourceCommit+'/data/translation/bsb-v1/'+name,...file};
 }
 return remote;
}

