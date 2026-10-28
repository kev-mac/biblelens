'use strict';
(async()=>{
 try{const saved=JSON.parse(localStorage.getItem('scripture-lens-v1')||'{}'),fonts={inter:'"Inter",system-ui,sans-serif',lora:'"Lora",Georgia,serif',georgia:'Georgia,serif',system:'system-ui,sans-serif',mono:'ui-monospace,monospace'};const choice=saved.readerPreferences?.appFont;if(Object.hasOwn(fonts,choice))document.documentElement.style.setProperty('--ui-font',fonts[choice]);}catch{}
 const node=(tag,text)=>{const el=document.createElement(tag);el.textContent=text;return el;};
 try{
 const response=await fetch('/teachings.json');if(!response.ok)throw Error();const payload=await response.json();
 if(!payload.draft_only||payload.ownerAccepted!==false)throw Error();
 const rows=payload.records;
 const bookOf=row=>row.passage.match(/^(.*?) \d/)[1];
 for(const [id,values]of [['form',[...new Set(rows.map(r=>r.form))]],['book',[...new Set(rows.map(bookOf))]]])for(const value of values){const option=node('option',value);option.value=value;document.getElementById(id).append(option);}
 function render(){
 const form=document.getElementById('form').value,book=document.getElementById('book').value;
 const selected=rows.filter(r=>(!form||r.form===form)&&(!book||bookOf(r)===book));
 const fragment=document.createDocumentFragment();
 for(const row of selected){const article=node('article','');article.id=row.id;article.append(node('p','Draft · '+row.form),node('h2',row.title),node('p',row.passage),node('p',row.summary));
 if(/^\/#read\/\d+\/\d+\/\d+$/.test(row.passageLink)){const link=node('a','Read passage');link.href=row.passageLink;article.append(link);}
 for(const [label,text]of [['Context',row.context+' '+row.limits],['Sources',row.sources.map(s=>s.label).join('; ')]]){const details=node('details','');details.append(node('summary',label),node('p',text));article.append(details);}fragment.append(article);}
 document.getElementById('results').replaceChildren(fragment);document.getElementById(location.hash.slice(1))?.scrollIntoView();document.getElementById('count').textContent=`${selected.length} drafts`;
 }
 const params=new URLSearchParams(location.search);for(const id of ['form','book']){const input=document.getElementById(id),value=params.get(id)||'';if([...input.options].some(o=>o.value===value))input.value=value;input.onchange=()=>{const query=new URLSearchParams();for(const name of ['form','book'])if(document.getElementById(name).value)query.set(name,document.getElementById(name).value);history.replaceState(null,'',location.pathname+(query.size?'?'+query:'')+location.hash);render();};}document.getElementById('filters').onsubmit=e=>e.preventDefault();render();
 }catch{document.getElementById('count').textContent='Drafts could not load. Reload to retry.';}
})();
