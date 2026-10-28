'use strict';
(() => {
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
   if (row.original) { card.append(node('h3', 'Original'), node('p', row.original), node('h3', 'Meaning checks')); for (const check of row.meaningChecks) card.append(node('p', check)); }
   for (const text of [row.limits, row.disposition, row.reason, row.recommendedDefault]) if (text) card.append(node('p', text));
   const sources = [...(record.sources || []), ...(row.sourceReview?.sources || [])];
   if (sources.length) {
    card.append(node('h3', 'Sources'));
    for (const source of sources) {
     let url; try { url = new URL(source.url); } catch { continue; }
     if (url.protocol !== 'https:' || url.username || url.password) continue;
     const link = node('a', source.label || 'Source'); link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; card.append(link);
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
