'use strict';
// This entire file and its data are packaged only by BIBLELENS_DRAFTS=1.
(() => {
 const data=/*__DRAFT_DEBATES__*/{};
 if(data.draft_only!==true||data.review_status!=='draft')throw Error('Expected draft Big Question data');
 const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const el=id=>document.getElementById(id),go=hash=>window.BibleLensWorkspace.navigate(hash);
 const all=data.candidates,byId=new Map(all.map(row=>[row.id,row])),saved=new Set();
 const modes={'text-vs-text':'Text vs. Text','text-vs-science':'Text vs. Science','text-vs-history':'Text vs. History'};
 const href=row=>'#debate/'+encodeURIComponent(row.id)+'?draft=1';
 const paragraphs=values=>values.map(text=>`<p>${escape(text)}</p>`).join('');
 const verdicts=row=>[...new Set(row.sourceRecords.map(record=>record.proposal.proposed_verdict))];
 const tone=verdict=>({'Wording Differs':'conflict','Evidence Points Elsewhere':'conflict','Readings can fit together':'agrees','Evidence Matches the Text':'agrees','Details differ':'detail'}[evidenceLabel(verdict)]||'open');
 const evidenceLabel=value=>({'Real conflict':'Wording Differs','Can be reconciled':'Readings can fit together','Different detail':'Details differ','Open question':'Interpretation Remains Open','not a debate':'Instruction in Context','Evidence agrees':'Evidence Matches the Text','Evidence disagrees':'Evidence Points Elsewhere'}[value]||value);
 const badge=verdict=>`<span class="phase3-verdict" data-tone="${tone(verdict)}">${escape(evidenceLabel(verdict))}</span>`;
 const tier=row=>`<span class="phase3-tier">Evidence strength: ${escape(row.evidence_tier||'Not assessed')}</span>`;
 const entry=()=>'<a class="lens-button phase3-preview-link" href="#questions?draft=1">Preview draft Big Questions</a>';
 const draftNotice='<p class="phase3-draft-notice"><strong>Draft preview</strong> · B01–B30 are selected. Wording proposals await review. Evidence labels follow the accepted names.</p>';
 let current=null,lastList='#questions?draft=1',sheet=null,opener=null;
 function sourceLink(source){
  let url;try{url=new URL(source.url);}catch{return '';}
  if(url.protocol!=='https:'||url.username||url.password)return '';
  return `<a class="phase2-source" href="${escape(url.href)}" target="_blank" rel="noopener noreferrer">${escape(source.label)} <span aria-hidden="true">↗</span></a>`;
 }
 function sourceSheet(row,trigger){
  if(!sheet){sheet=document.createElement('dialog');sheet.className='phase2-sheet phase3-sheet';sheet.setAttribute('aria-labelledby','draft-sources-title');document.body.append(sheet);sheet.addEventListener('click',event=>{if(event.target.closest('[data-draft-close]'))sheet.close();});sheet.addEventListener('close',()=>opener?.isConnected&&opener.focus({preventScroll:true}));}
  opener=trigger;
  sheet.innerHTML=`<div class="phase2-sheet-head"><h2 id="draft-sources-title">Sources</h2><button type="button" class="lens-button" data-draft-close aria-label="Close sources">×</button></div>${draftNotice}<p>These links come from the research records. A source supports only the claim it addresses.</p>${row.sources.map(sourceLink).join('')}${row.sourceRecords.map(record=>`<h3>${escape(record.ref)} · Source limits</h3><p>${escape(record.scope)}</p>`).join('')}`;
  sheet.showModal();sheet.querySelector('button').focus();
 }
 function card(row){
  const refs=[...new Set([...row.side_a.kjv_refs,...row.side_b.kjv_refs])];
  return `<a class="phase2-debate-card phase3-card" href="${href(row)}"><span class="phase2-eyebrow">Draft · ${row.recommended?'Selected':'Reserve'}</span>${window.BibleLensMedia.render({kind:'placeholder',ratio:'landscape',context:'discovery'})}<h2>${escape(row.question)}</h2><p class="phase2-meta">${refs.map(escape).join(' · ')}</p><div class="phase3-card-verdicts">${verdicts(row).map(badge).join('')}</div>${tier(row)}<span class="phase3-card-link">See both sides <span aria-hidden="true">↗</span></span></a>`;
 }
 function filterButtons(values,selected,attribute){return values.map(([value,label])=>`<button type="button" class="lens-button" ${attribute}="${escape(value)}" aria-pressed="${selected===value}">${escape(label)}</button>`).join('');}
 function showList(hash){
  current=null;lastList=hash;setView('debates',false);const host=el('debates-view');
  const params=new URLSearchParams(hash.split('?')[1]||'');
  const mode=Object.hasOwn(modes,params.get('mode'))?params.get('mode'):'text-vs-text';
  const selection=['recommended','all','reserves','saved'].includes(params.get('selection'))?params.get('selection'):'recommended';
  const status=params.get('verdict')||'all';
  const candidates=all.filter(row=>row.comparison===mode);
  const filtered=candidates.filter(row=>(selection==='all'||selection==='recommended'&&row.recommended||selection==='reserves'&&!row.recommended||selection==='saved'&&saved.has(row.id))&&(status==='all'||verdicts(row).includes(status)));
  const statuses=[...new Set(candidates.flatMap(verdicts))];
  host.innerHTML=`<a class="phase2-back" href="#questions">← Current Big Questions</a>${draftNotice}<h1 tabindex="-1">Big Questions</h1><p>Compare the claims and check their limits before reaching your own conclusion.</p><div class="phase2-modes" role="group" aria-label="Draft comparison type">${filterButtons(Object.entries(modes),mode,'data-draft-mode')}</div><div class="phase2-chips" role="group" aria-label="What the Evidence Shows">${filterButtons([['all','All evidence labels'],...statuses.map(value=>[value,evidenceLabel(value)])],status,'data-draft-verdict')}</div><details class="phase3-selection"><summary>Choose Draft Set</summary><div class="phase2-chips" role="group" aria-label="Draft selection">${filterButtons([['recommended','Selected 30'],['all','All 40'],['reserves','10 reserves'],['saved','Saved this session']],selection,'data-draft-selection')}</div><p>Kevin selected B01–B30. Ten reserve questions remain available for review.</p></details><p class="phase2-meta" role="status">${filtered.length} draft ${filtered.length===1?'Big Question':'Big Questions'} · Evidence tiers await review.</p><div class="phase2-debate-grid">${filtered.map(card).join('')||'<p>No drafts match these filters. Choose another set or evidence label.</p>'}</div>`;
  restoreNavigation();
 }
 const passage=entry=>`<h3><a href="${escape(entry.href)}">${escape(entry.ref)}</a></h3><blockquote>${entry.verses.map(verse=>`<span class="phase3-verse-number">${verse.number}</span> ${escape(verse.text)}`).join(' ')}</blockquote>`;
 function side(row,letter){const side=letter==='A'?row.side_a:row.side_b;return `<section class="phase2-side phase3-side"><span class="phase2-eyebrow">Side ${letter}${side.passages.length?' · KJV':' · Source claim'}</span><h2>${escape(side.label)}</h2>${side.reference_note?`<p class="phase3-reference-note">${escape(side.reference_note)}</p>`:''}${side.passages.map(passage).join('')}${!side.passages.length?'<p>The source claim appears below. Check the linked sources and their limits.</p>':''}</section>`;}
 function caseSection(row,letter){const side=letter==='A'?row.side_a:row.side_b;return `<section class="phase3-case"><h2><span class="phase3-letter" aria-hidden="true">${letter}</span>Strongest case for ${letter}</h2>${paragraphs(side.case)}</section>`;}
 function deeper(row){return `<details class="phase2-deeper"><summary>Go Deeper <span>Full draft summary and research limits</span></summary><h2>The 60-Second Draft</h2><p>${escape(row.summary_60_seconds)}</p>${row.context.length?'<h2>Context Passages</h2>'+row.context.map(passage).join(''):''}${row.sourceRecords.map(record=>`<section><h2>${escape(record.title||record.ref)}</h2><h3>Source Limits · Wording Proposal</h3><p>${escape(record.scope)}</p>${record.text?'<h3>Recorded Text</h3><p>'+escape(record.text)+'</p>':''}${record.reasoning?'<h3>Record Reasoning</h3><p>'+escape(record.reasoning)+'</p>':''}${record.fields.map(field=>`<h3>${escape(field.branch)}</h3><p>${escape(field.text)}</p>`).join('')}<h3>Evidence Label Reasoning</h3><p>${escape(record.proposal.reason)}</p>${paragraphs(record.proposal.notes||[])}<a class="lens-button" href="#debate/${encodeURIComponent(record.id)}">Open current research record</a></section>`).join('')}</details>`;}
 function controls(){
  if(!current)return;
  const host=el('debate-view');
  const button=host.querySelector('[data-draft-save]');if(button){button.setAttribute('aria-pressed',String(saved.has(current.id)));button.textContent=saved.has(current.id)?'Saved for this session':'Save for this session';}
 }
 function showDetail(id){
  const row=byId.get(id);setView('debate',false);const host=el('debate-view');current=row||null;
  if(!row){host.innerHTML=`${draftNotice}<h1 tabindex="-1">Draft Not Found</h1><a class="lens-button" href="#questions?draft=1">Browse draft Big Questions</a>`;return;}
  const ownerHold=row.sourceRecords.some(record=>record.proposal.needs_owner_ruling);
  host.innerHTML=`<a class="phase2-back" href="${escape(lastList)}">← Draft Big Questions</a>${draftNotice}<span class="phase2-eyebrow">${escape(modes[row.comparison])} · ${row.recommended?'Selected question':'Reserve draft'}</span><h1 tabindex="-1">${escape(row.question)}</h1><div class="phase2-sides">${side(row,'A')}${side(row,'B')}</div><section class="phase3-verdict-box" aria-label="What the Evidence Shows"><div class="phase3-card-verdicts">${verdicts(row).map(badge).join('')}</div><p class="phase3-mock-label">What the Evidence Shows · ${ownerHold?'Owner ruling needed':'Awaiting acceptance'}</p>${tier(row)}<p>Source strength still needs review. Read the sources and limits beside each proposed label.</p></section><p class="phase3-case-note">These cases quote the headline draft. The two sides may have different levels of support.</p>${caseSection(row,'A')}${caseSection(row,'B')}${row.reading_review?`<section class="phase3-readings"><h2>Main Readings · Wording Proposal</h2>${row.reading_review.readings.map(reading=>`<h3>${escape(reading.label)}</h3><p>${escape(reading.summary)}</p>`).join('')}<p>${escape(row.reading_review.limits)}</p><details><summary>Reading Sources and Attribution</summary><p>${escape(row.reading_review.attributionReview)}</p>${row.reading_review.sources.map(sourceLink).join('')}</details></section>`:''}<section class="phase3-scope-test"><h2>What Would Settle It?</h2><p>${escape(row.what_would_settle_it)}</p><p class="phase2-meta">This is the draft’s test. It does not promise that the available sources can settle the question.</p></section>${deeper(row)}<button type="button" class="phase2-source-button" data-draft-sources>Sources (${row.sources.length}) <span aria-hidden="true">↗</span></button><section class="question-save"><button type="button" class="phase2-save" data-draft-save aria-pressed="false">Save for This Session</button><a class="lens-button" href="#questions?draft=1&selection=saved&mode=${escape(row.comparison)}">View saved drafts</a></section>`;
  controls();if(!navigationRestore)host.querySelector('h1').focus({preventScroll:true});restoreNavigation();
 }
 function route(hash){
  const params=new URLSearchParams(hash.split('?')[1]||''),path=hash.split('?')[0];
  if(params.get('draft')!=='1'){current=null;return false;}
  if(path==='#questions'){showList(hash);return true;}
  if(path.startsWith('#debate/')){let id;try{id=decodeURIComponent(path.slice(8));}catch{id='';}showDetail(id);return true;}
  current=null;return false;
 }
 document.addEventListener('click',event=>{
  const filter=event.target.closest('[data-draft-mode],[data-draft-verdict],[data-draft-selection]');
  if(filter){const params=new URLSearchParams(location.hash.split('?')[1]||'');params.set('draft','1');for(const [attr,key] of [['data-draft-mode','mode'],['data-draft-verdict','verdict'],['data-draft-selection','selection']])if(filter.hasAttribute(attr))params.set(key,filter.getAttribute(attr));if(filter.hasAttribute('data-draft-mode'))params.delete('verdict');go('#questions?'+params);return;}
  if(!current||view!=='debate')return;
  if(event.target.closest('[data-draft-save]')){if(saved.has(current.id))saved.delete(current.id);else saved.add(current.id);controls();}
  const source=event.target.closest('[data-draft-sources]');if(source)sourceSheet(current,source);
 });
 window.addEventListener('viewchange',()=>{if(sheet?.open)sheet.close();});
 window.BibleLensDraftDebates={route,entry,card};
})();
