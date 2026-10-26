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
const file='src/base.css',styles=fs.readFileSync(file,'utf8');
const start='/* Bundled reader fonts: start */',end='/* Bundled reader fonts: end */';
const from=styles.indexOf(start),to=styles.indexOf(end,from);
if(from<0||to<from)throw Error('Missing bundled-font markers in the base layer');
fs.writeFileSync(file,styles.slice(0,from)+start+'\n'+output.join('\n')+'\n'+styles.slice(to));
console.log('Bundled Lora and Inter:',faces.length,'font faces,',binaries.size,'unique font files.');
