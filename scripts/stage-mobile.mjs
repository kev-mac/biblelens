import fs from 'node:fs';
import path from 'node:path';
import {build,stop} from 'esbuild';
import {insertDeviceBootstrap,insertNativeContentSecurityPolicy} from './startup-assets.mjs';

const args=process.argv.slice(2),root=process.cwd();
if(args.length!==2)throw Error('Expected staging and destination directories.');
const [output,destination]=args.map(value=>path.resolve(value));
if(path.dirname(output)!==root||!path.basename(output).startsWith('.www-stage-')||destination!==path.join(root,'www'))throw Error('Mobile staging paths must stay in the current checkout.');
const {mobileBundle}=await import('./build.mjs');
try {
for(const [url,asset]of Object.entries(mobileBundle.assets)){
 const file=path.join(output,url==='/'?'index.html':url.slice(1));
 fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,asset.encoding==='base64'?Buffer.from(asset.body,'base64'):asset.body);
}
fs.writeFileSync(path.join(output,'device-engine.js'),mobileBundle.engine);
fs.copyFileSync('src/device-api-worker.js',path.join(output,'device-api-worker.js'));
await build({entryPoints:['src/device-bootstrap.js'],outfile:path.join(output,'device-bootstrap.js'),bundle:true,format:'iife',platform:'browser',target:['safari17','chrome119']});
await build({entryPoints:['src/device-local-ai.js'],outfile:path.join(output,'device-ai.js'),bundle:true,format:'esm',platform:'browser',target:['safari17','chrome119']});
let html=fs.readFileSync(path.join(output,'index.html'),'utf8');
html=insertNativeContentSecurityPolicy(html,mobileBundle.assets['/'].csp);
html=insertDeviceBootstrap(html);
html=html.replace('Questions and recent conversation context are sent only to this site’s search endpoint, with no external AI service.','Questions and recent conversation context are processed on this device. Optional on-device AI runs locally; no external AI service receives your questions.');
html=html.replace('Hosted access follows the site’s sharing settings. Chat requires no separate login.','Reading and search work offline. External source links require internet. Chat requires no login.');
html=html.replace('run against packaged content on this site.','run against content bundled in this app.');
// Exported reference links must remain usable without an API interceptor.
// Keep the reviewed people asset from the shared build; topics are a static export.
fs.copyFileSync('data/reference/topics.json',path.join(output,'reference','topics.json'));
const nativeNotices=['@capacitor/core','@capacitor/android','@capacitor/ios','@capacitor/local-llm'].map(name=>name+'\n'+fs.readFileSync('node_modules/'+name+'/LICENSE','utf8')).join('\n\n');
fs.writeFileSync(path.join(output,'native-licenses.txt'),nativeNotices);
html=html.replace('No language model download is needed for Chat.','<a href="/native-licenses.txt" target="_blank" rel="noopener">Native component licenses</a>. No language model download is needed for reading and search.');
fs.writeFileSync(path.join(output,'index.html'),html);
// Keep owner previews outside the generated bundle, and retain the preceding
// fingerprinted assets for requests that began before the directory exchange.
for(const name of ['gemini','mock'])if(fs.existsSync(path.join(destination,name)))fs.cpSync(path.join(destination,name),path.join(output,name),{recursive:true});
const previousManifest=['index.html','feature-loader.js'].filter(name=>fs.existsSync(path.join(destination,name))).map(name=>fs.readFileSync(path.join(destination,name),'utf8')).join('\n');
for(const match of previousManifest.matchAll(/\/assets\/[^"'\s<>]+\.[a-f0-9]{16}\.(?:js|css)/g)){
 const name=path.basename(match[0]),previous=path.join(destination,'assets',name),next=path.join(output,'assets',name);
 if(fs.existsSync(previous)&&!fs.existsSync(next))fs.copyFileSync(previous,next);
}

} finally {await stop();}
console.log('Mobile staging complete:',output);
