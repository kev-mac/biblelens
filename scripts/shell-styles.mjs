import fs from 'node:fs';
import {PurgeCSS} from 'purgecss';
import {transformSync} from 'esbuild';
import {applicationStylesheets} from './stylesheets.mjs';
import {assetDigest} from './startup-assets.mjs';
// Filter only declared shell/study markup. Directories retain the full cascade.
// Each sheet keeps the original layer and rule order.
export async function shellStyles(assets){
 const full=applicationStylesheets.map(name=>assets['/'+name].body).join('\n');
 const html=assets['/'].body.replace(/<main\b[\s\S]*<\/main>/,'<main id="main" tabindex="-1"></main>').replace(/<dialog\b[\s\S]*?<\/dialog>/g,'');
 const content=[{raw:html,extension:'html'},...['workspace-shell.js','dialog-scroll.js','atlas-explore.js','lost-books.js','debate-ui.js','app.js','reader-state.js','mobile.js','retry.js'].map(name=>({raw:fs.readFileSync('src/'+name,'utf8'),extension:'js'}))];
 const [{css}]=await new PurgeCSS().purge({content,css:[{raw:full}],safelist:{standard:[/^(?:dark|lens-app|native-ios|mobile-editing|keyboard-navigation|merge-picker-inputs)$/],greedy:[/data-status/,/data-tone/,/data-surface/]} });
 const body=transformSync(full,{loader:'css',minify:true,target:['safari17','chrome119']}).code;
 const path='/assets/views.'+assetDigest(body).slice(0,16)+'.css';assets[path]={type:'text/css; charset=utf-8',body};
 // workspace.section() composes these IDs at runtime, beyond token extraction.
 const studyHTML='<section id="search-view" class="lens-workspace"></section><section id="notebook-view" class="lens-workspace"></section>'+element(assets['/'].body,'read-view')+element(assets['/'].body,'chat-view')+[...assets['/'].body.matchAll(/<dialog\b[\s\S]*?<\/dialog>/g)].map(match=>match[0]).join('');
 const studyContent=[...content,{raw:studyHTML,extension:'html'},...['reader','passage','workspace','atlas-reader','stories','citations','navigation','sync','release','device-local-ai','people-links'].map(name=>({raw:fs.readFileSync('src/'+name+'.js','utf8'),extension:'js'}))];
 const [{css:studyCSS}]=await new PurgeCSS().purge({content:studyContent,css:[{raw:full}],safelist:{standard:[/^(?:dark|lens-app|native-ios|mobile-editing|keyboard-navigation|merge-picker-inputs)$/],greedy:[/data-/]}});
 const studyBody=transformSync(studyCSS,{loader:'css',minify:true,target:['safari17','chrome119']}).code;
 const studyPath='/assets/study.'+assetDigest(studyBody).slice(0,16)+'.css';assets[studyPath]={type:'text/css; charset=utf-8',body:studyBody};
 return {css,path,studyPath};
}

function element(html,id){
 const start=new RegExp('<([a-z]+)\\b[^>]*\\bid="'+id+'"[^>]*>','i').exec(html);if(!start)throw Error('Missing style scope: '+id);
 const tags=new RegExp('<(/?)'+start[1]+'\\b[^>]*>','gi');tags.lastIndex=start.index;let depth=0,match;
 while((match=tags.exec(html))){depth+=match[1]?-1:1;if(!depth)return html.slice(start.index,tags.lastIndex);}
 throw Error('Unclosed style scope: '+id);
}
