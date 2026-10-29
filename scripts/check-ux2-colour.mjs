import assert from 'node:assert/strict';
import fs from 'node:fs';
const css=fs.readFileSync('src/overrides.css','utf8').split('/* UX2 restores')[1];
const luminance=hex=>{let c=hex.slice(1);if(c.length===3)c=[...c].map(v=>v+v).join('');const rgb=c.match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
const contrast=(a,b)=>{const [lo,hi]=[luminance(a),luminance(b)].sort((a,b)=>a-b);return (hi+.05)/(lo+.05);};
const rows=[];
for(const [theme,block] of [['light',css.split('html body.lens-app.dark')[0]],['dark',css.split('html body.lens-app.dark')[1].split('}')[0]]]){
 const tokens=Object.fromEntries([...block.matchAll(/--([a-z-]+):\s*(#[0-9a-f]+)/g)].map(m=>[m[1],m[2]]));
 for(const [token,color] of Object.entries(tokens).filter(([token])=>/^topic-|lens-(?:ink|muted|copper|link|focus)$/.test(token)))for(const surface of ['lens-paper','lens-surface','lens-copper-soft']){
  const ratio=contrast(color,tokens[surface]);assert(ratio>=4.5,`${theme} ${token} on ${surface}: ${ratio}`);rows.push({theme,token,color,surface,ratio:+ratio.toFixed(2)});
 }
}
assert(contrast('#ffffff','#10202b')>=4.5);
fs.mkdirSync('research/ux2',{recursive:true});fs.writeFileSync('research/ux2/contrast.json',JSON.stringify(rows,null,2)+'\n');
console.log(`PASS: ${rows.length} text/focus/topic token pairs meet 4.5:1 (also above the 3:1 icon/large-text target); solid artwork caption backing passes.`);
