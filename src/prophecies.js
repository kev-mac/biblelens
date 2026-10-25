import samples from './data/prophecies.json';
import schema from './data/prophecies.schema.json';

export const PROPHECY_FACETS = Object.fromEntries(Object.entries(schema.properties.taxonomy.properties).map(([key, value]) => [key, value.enum]));
// Carousel and sheet edit the same selections: OR within a facet, AND across facets.
export function filterProphecies(records, filters) {
 return records.filter(item => Object.keys(PROPHECY_FACETS).every(facet =>
  !filters[facet]?.length || filters[facet].includes(item.taxonomy[facet])));
}
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const tones = {Historical:'amber', 'New Testament':'emerald', Unfulfilled:'slate', Disputed:'rose', Messianic:'purple', Israel:'blue', 'The Nations':'orange', Direct:'blue', Typological:'purple', Conditional:'amber'};
const tone = value => `theme-${tones[value] || 'slate'}`;
// Presentation only: keep the source titles and research records unchanged.
const titleMinorWords = new Set(['a','an','and','as','at','but','by','for','from','in','nor','of','on','or','the','to','via']);
const displayTitle = title => String(title ?? '').split(/(\s+)/).map((word, index, words) =>
 index > 0 && index < words.length - 1 && titleMinorWords.has(word.toLowerCase()) ? word.toLowerCase() : word.replace(/^\p{Ll}/u, letter => letter.toUpperCase())).join('');
export function prophecyCard(item) {
 const passage = (reference, label) => `<div class="prophecy-node"><span class="prophecy-node-label">${label}</span><button type="button" class="prophecy-passage" data-prophecy-passage="${escape(reference)}" aria-label="Read ${escape(reference)}">${escape(reference)} <span aria-hidden="true">↗</span></button></div>`;
 return `<article class="prophecy-card ${tone(item.taxonomy.target)}" aria-labelledby="prophecy-${escape(item.id)}">
  <h2 id="prophecy-${escape(item.id)}">${escape(displayTitle(item.title))}</h2>
  <div class="prophecy-bridge">${passage(item.prediction_passage, 'Prediction · Origin')}<span class="prophecy-connector" aria-hidden="true">→</span>${item.fulfillment_passage ? passage(item.fulfillment_passage, item.taxonomy.status === 'Disputed' ? 'Proposed fulfillment' : 'Fulfillment · Linked account') : '<div class="prophecy-node"><span class="prophecy-node-label">Fulfillment</span><span class="prophecy-pending">No fulfillment linked</span></div>'}</div>
  <p>${escape(item.summary)}</p>
  <footer class="prophecy-taxonomy" aria-label="Interpretive classification">${Object.entries(item.taxonomy).map(([facet, value]) => `<span class="prophecy-micro ${tone(value)}"><span class="prophecy-facet-label">${escape(facet)}: </span>${escape(value)}</span>`).join('')}</footer>
 </article>`;
}
export function mountProphecies() {
 const root = document.querySelector('#prophecies-view');
 if (!root) return;
 const sheet = document.querySelector('#prophecy-filters');
 const matrix = sheet.querySelector('.prophecy-matrix');
 const more = root.querySelector('#prophecy-filter-button');
 const quick = root.querySelector('.prophecy-quick');
 const filters = Object.fromEntries(Object.keys(PROPHECY_FACETS).map(key => [key, []]));
 quick.innerHTML = Object.entries(PROPHECY_FACETS).map(([facet, values]) => `<fieldset class="prophecy-quick-group"><legend>${facet[0].toUpperCase() + facet.slice(1)}</legend><div>${values.map(value => `<button type="button" class="prophecy-toggle ${tone(value)}" data-prophecy-facet="${facet}" data-value="${escape(value)}" aria-pressed="false" aria-controls="prophecies-list">${escape(value)}</button>`).join('')}</div></fieldset>`).join('');
 matrix.innerHTML = Object.entries(PROPHECY_FACETS).map(([facet, values]) => `<fieldset><legend>${facet[0].toUpperCase() + facet.slice(1)}</legend><div class="prophecy-options">${values.map(value => `<button type="button" class="prophecy-facet ${tone(value)}" data-prophecy-facet="${facet}" data-value="${escape(value)}" aria-pressed="false" aria-controls="prophecies-list">${escape(value)}</button>`).join('')}</div></fieldset>`).join('');
 function render() {
  const items = filterProphecies(samples, filters);
  root.querySelector('#prophecies-list').innerHTML = items.length ? items.map(prophecyCard).join('') : '<div class="empty"><h2>No matching prophecies</h2><p>Try fewer filters or reset filters to see all three samples.</p></div>';
  root.querySelector('#prophecies-count').textContent = `${items.length} of ${samples.length} sample prophecies`;
  for (const button of [...quick.querySelectorAll('[data-prophecy-facet]'), ...matrix.querySelectorAll('[data-prophecy-facet]')]) button.setAttribute('aria-pressed', String(filters[button.dataset.prophecyFacet].includes(button.dataset.value)));
  const count = Object.values(filters).reduce((sum, values) => sum + values.length, 0);
  const filterLabel = count ? `Filter prophecies, ${count} active ${count === 1 ? 'filter' : 'filters'}` : 'Filter prophecies';
  more.setAttribute('aria-label', filterLabel);
  more.title = filterLabel;
  const badge = more.querySelector('.prophecy-filter-count');
  badge.hidden = count === 0;
  badge.textContent = String(count);
  sheet.querySelector('#prophecy-done').textContent = `Show ${items.length} ${items.length === 1 ? 'result' : 'results'}`;
 }
 function toggle(facet, value, enabled) {
  filters[facet] = enabled ? [...new Set([...filters[facet], value])] : filters[facet].filter(entry => entry !== value);
  render();
 }
 function handleFacetClick(event) {
  const button = event.target.closest('[data-prophecy-facet]');
  if (button) toggle(button.dataset.prophecyFacet, button.dataset.value, !filters[button.dataset.prophecyFacet].includes(button.dataset.value));
 }
 quick.addEventListener('click', handleFacetClick);
 matrix.addEventListener('click', handleFacetClick);
 const reset = () => { Object.keys(filters).forEach(key => { filters[key] = []; }); render(); };
 root.querySelector('#prophecy-reset').addEventListener('click', reset);
 sheet.querySelector('#prophecy-clear').addEventListener('click', reset);
 more.addEventListener('click', () => { sheet.showModal(); more.setAttribute('aria-expanded', 'true'); document.body.classList.add('prophecy-filter-open'); });
 for (const id of ['#prophecy-close', '#prophecy-done']) sheet.querySelector(id).addEventListener('click', () => sheet.close());
 sheet.addEventListener('close', () => { document.body.classList.remove('prophecy-filter-open'); more.setAttribute('aria-expanded', 'false'); if (!root.hidden) more.focus(); });
 const outside = event => { const r = sheet.getBoundingClientRect(); return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom; };
 let backdropStart = false;
 sheet.addEventListener('pointerdown', event => { backdropStart = event.target === sheet && outside(event); });
 sheet.addEventListener('click', event => { if (backdropStart && event.target === sheet && outside(event)) sheet.close(); backdropStart = false; });
 window.addEventListener('viewchange', event => { if (event.detail !== 'prophecies' && sheet.open) sheet.close(); });
 root.addEventListener('click', event => {
  const button = event.target.closest('[data-prophecy-passage]');
  if (!button) return;
  const ref = readRef(button.dataset.prophecyPassage);
  if (!ref) { toast('Passage reader is still loading. Please try again.'); return; }
  storiesActive = false; renderStoriesView(); setView('explore', false); loadChapter(ref.book, ref.chapter, ref.verse);
 });
 render();
}
if (typeof document !== 'undefined') mountProphecies();
