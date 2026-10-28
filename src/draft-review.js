'use strict';
(() => {
 try{const saved=JSON.parse(localStorage.getItem('scripture-lens-v1')||'{}'),fonts={inter:'"Inter",system-ui,sans-serif',lora:'"Lora",Georgia,serif',georgia:'Georgia,serif',system:'system-ui,sans-serif',mono:'ui-monospace,monospace'};const choice=saved.readerPreferences?.appFont;if(Object.hasOwn(fonts,choice))document.documentElement.style.setProperty('--ui-font',fonts[choice]);}catch{}
 const el = id => document.getElementById(id);
 const node = (tag, text) => { const value = document.createElement(tag); value.textContent = text; return value; };
 let data, limit = 20;
 function render() {
  const collection = el('collection').value, query = el('query').value.toLowerCase().trim();
  const rows = data.collections[collection] || data[collection] || [];
  const selected = rows.filter(row => JSON.stringify(row).toLowerCase().includes(query));
  const fragment = document.createDocumentFragment();
  for (const row of selected.slice(0, limit)) {
   const record = row.record || row, card = node('article', '');
   card.append(node('p', 'Draft · needs review'), node('h2', record.display_title || record.title || record.name || record.unit || row.id));
   if (record.summary) card.append(node('p', record.summary));
   if (row.original) { card.append(node('h3', 'Original'), node('p', row.original), node('h3', 'Meaning checks')); for (const check of row.meaningChecks || []) card.append(node('p', check)); }
   const notes=node('details','');notes.append(node('summary','Notes and limits'));for(const text of [record.context,record.reasoning,record.scope,row.limits,row.disposition,row.reason,row.recommendedDefault])if(text)notes.append(node('p',text));if(row.readings)for(const reading of row.readings){notes.append(node('h3',reading.label),node('p',reading.summary||reading.status));if(reading.reason)notes.append(node('p',reading.reason));}card.append(notes);
   const sources = [...(record.sources || []), ...(row.sourceReview?.sources || [])];
   if (sources.length) {
    const sourceDetails=node('details','');sourceDetails.append(node('summary','Sources'));card.append(sourceDetails);
    for (const source of sources) {
     let url; try { url = new URL(source.url); } catch { continue; }
     if (url.protocol !== 'https:' || url.username || url.password) continue;
     const link = node('a', source.label || 'Source'); link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; sourceDetails.append(link);
    }
   }
   const details = node('details', ''); details.append(node('summary', 'Full proposal and limits'), node('pre', JSON.stringify(row, null, 2))); card.append(details); fragment.append(card);
  }
  el('results').replaceChildren(fragment); el('count').textContent = `${selected.length} drafts · Showing ${Math.min(limit, selected.length)}`;
  el('more').hidden = limit >= selected.length;
 }
 el('filters').addEventListener('submit', event => event.preventDefault());
 for (const id of ['collection', 'query']) el(id).addEventListener(id === 'query' ? 'input' : 'change', () => { limit = 20; if (data) render(); });
 el('more').addEventListener('click', () => { limit += 20; render(); });
 fetch('/draft-review.json').then(response => { if (!response.ok) throw Error(); return response.json(); }).then(payload => {
  if (!payload.draft_only || payload.reviewStatus !== 'draft' || payload.ownerAccepted !== false) throw Error();
  data = payload; render();
 }).catch(() => { el('count').textContent = 'Drafts could not load. Reload this local preview to retry.'; });
})();
