import fs from 'node:fs';
import path from 'node:path';
import {build} from 'esbuild';
import {mobileBundle} from './build.mjs';
import {insertDeviceBootstrap} from './startup-assets.mjs';

const output=path.resolve('www');
// Remove only this build's fixed output directory, never a supplied path.
if(output!==path.join(process.cwd(),'www'))throw Error('Unexpected mobile output directory');
fs.mkdirSync(output,{recursive:true});
for(const [url,asset]of Object.entries(mobileBundle.assets)){
 const file=path.join(output,url==='/'?'index.html':url.slice(1));
 fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,asset.encoding==='base64'?Buffer.from(asset.body,'base64'):asset.body);
}
fs.writeFileSync(path.join(output,'device-engine.js'),mobileBundle.engine);
fs.copyFileSync('src/device-api-worker.js',path.join(output,'device-api-worker.js'));
await build({entryPoints:['src/device-bootstrap.js'],outfile:path.join(output,'device-bootstrap.js'),bundle:true,format:'iife',platform:'browser',target:['safari17','chrome119']});
await build({entryPoints:['src/device-local-ai.js'],outfile:path.join(output,'device-ai.js'),bundle:true,format:'esm',platform:'browser',target:['safari17','chrome119']});
let html=fs.readFileSync(path.join(output,'index.html'),'utf8');
html=insertDeviceBootstrap(html);
html=html.replace('Questions and recent conversation context are sent only to this site’s search endpoint, with no external AI service.','Questions and recent conversation context are processed on this device. Optional on-device AI runs locally; no external AI service receives your questions.');
html=html.replace('Hosted access follows the site’s sharing settings. Chat requires no separate login.','Reading and search work offline. External source links require internet. Chat requires no login.');
html=html.replace('run against packaged content on this site.','run against content bundled in this app.');
// Exported reference links must remain usable without an API interceptor.
for(const file of ['people','topics'])fs.copyFileSync('data/reference/'+file+'.json',path.join(output,'reference',file+'.json'));
const nativeNotices=['@capacitor/core','@capacitor/android','@capacitor/ios','@capacitor/local-llm'].map(name=>name+'\n'+fs.readFileSync('node_modules/'+name+'/LICENSE','utf8')).join('\n\n');
fs.writeFileSync(path.join(output,'native-licenses.txt'),nativeNotices);
html=html.replace('No language model download is needed for Chat.','<a href="/native-licenses.txt" target="_blank" rel="noopener">Native component licenses</a>. No language model download is needed for reading and search.');
fs.writeFileSync(path.join(output,'index.html'),html);
console.log('Mobile web bundle ready:',output,'(offline reading/search; optional cloud sync)');
