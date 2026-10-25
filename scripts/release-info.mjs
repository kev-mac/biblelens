import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const binarySource = /\.(?:avif|gif|ico|jpe?g|png|webp|woff2?|ttf|otf|pdf|zip|gz)$/i;
export function releaseInfo(root=process.cwd()){
 const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
 if(!Number.isSafeInteger(pkg.buildNumber)||pkg.buildNumber<1)throw Error('package.json requires a positive integer buildNumber');
 const files=['package.json','package-lock.json','capacitor.config.json','.openai/hosting.json'];
 function walk(dir){if(!fs.existsSync(path.join(root,dir)))return;for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const f=dir+'/'+e.name;if(e.isDirectory())walk(f);else if(e.isFile())files.push(f);}}
 for(const dir of ['src','worker','data','scripts','db','drizzle'])walk(dir);
 const hash=createHash('sha256');for(const file of files.sort()){
  const bytes=fs.readFileSync(path.join(root,file));
  hash.update(file+'\0');
  // Text stays portable across checkouts; binary assets must retain every byte.
  hash.update(binarySource.test(file)?bytes:bytes.toString('utf8').replace(/\r\n/g,'\n'));
  hash.update('\0');
 }
 return {version:pkg.version,buildNumber:pkg.buildNumber,sourceHash:hash.digest('hex')};
}
