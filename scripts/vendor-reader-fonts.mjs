import fs from 'node:fs';
const url='https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Lora:wght@400;500&display=swap';
const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36'}});
if(!response.ok)throw Error('Font stylesheet download failed: '+response.status);
const css=await response.text();
const faces=[...css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g)].map(m=>m[1]);
if(!faces.some(f=>f.includes("font-family: 'Inter'"))||!faces.some(f=>f.includes("font-family: 'Lora'")))throw Error('Expected Latin font faces missing');
const binaries=new Map(),output=[];
for(let face of faces){
 const fontUrl=/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/.exec(face)?.[1];
 if(!fontUrl)throw Error('Unsupported font source');
 if(!binaries.has(fontUrl)){const res=await fetch(fontUrl);if(!res.ok)throw Error('Font download failed');binaries.set(fontUrl,Buffer.from(await res.arrayBuffer()).toString('base64'));}
 face=face.replace(fontUrl,'data:font/woff2;base64,'+binaries.get(fontUrl));output.push(face);
}
fs.mkdirSync('assets/font-licenses',{recursive:true});
for(const family of ['inter','lora']){
 const license=await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/'+family+'/OFL.txt');
 if(!license.ok)throw Error('Font license download failed');
 fs.writeFileSync('assets/font-licenses/'+family+'-OFL.txt',await license.text());
}
fs.writeFileSync('src/fonts.css','/* Bundled Latin Lora and Inter, weights 400 and 500. SIL Open Font License: assets/font-licenses/. */\n'+output.join('\n'));
let html=fs.readFileSync('src/index.html','utf8');
html=html.replace('<link rel="stylesheet" href="style.css?v=round-gradients-v1">','<link rel="stylesheet" href="fonts.css?v=lora-inter-v1"><link rel="stylesheet" href="style.css?v=vertical-gradients-v1">');
fs.writeFileSync('src/index.html',html);
let styles=fs.readFileSync('src/style.css','utf8').replaceAll('system-ui','"Inter",system-ui').replaceAll('Georgia','"Lora",Georgia');
fs.writeFileSync('src/style.css',styles);
let build=fs.readFileSync('scripts/build.mjs','utf8').replace("'style.css':'text/css; charset=utf-8'","'fonts.css':'text/css; charset=utf-8','style.css':'text/css; charset=utf-8'");
fs.writeFileSync('scripts/build.mjs',build);
console.log('Bundled Lora and Inter:',faces.length,'font faces,',binaries.size,'unique font files.');
