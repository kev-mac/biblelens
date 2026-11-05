import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const destination=path.resolve('www');
const output=fs.mkdtempSync(path.join(process.cwd(),'.www-stage-'));
// The staging process must exit before the directory handoff. On Windows a
// handoff inside the process that constructed the bundle can be denied even
// after compiler shutdown. Keep the original bundle until staging succeeds.
try {
 execFileSync(process.execPath,['scripts/stage-mobile.mjs',output,destination],{stdio:'inherit'});
 execFileSync('python3',['scripts/swap-mobile.py',output,destination],{stdio:'inherit'});
 console.log('Mobile web bundle ready:',destination,'(offline reading/search; optional cloud sync)');
} finally {fs.rmSync(output,{recursive:true,force:true});}
