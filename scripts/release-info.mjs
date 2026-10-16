import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
export function releaseInfo(root=process.cwd()){
 const files=['package.json','package-lock.json','capacitor.config.json','.openai/hosting.json'];
 function walk(dir){if(!fs.existsSync(path.join(root,dir)))return;for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const f=dir+'/'+e.name;if(e.isDirectory())walk(f);else if(e.isFile())files.push(f);}}
 for(const dir of ['src','worker','data','scripts','db','drizzle'])walk(dir);
 const hash=createHash('sha256');for(const file of files.sort()){hash.update(file+'\0');hash.update(fs.readFileSync(path.join(root,file)));hash.update('\0');}
 return {version:JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version,sourceHash:hash.digest('hex')};
}
