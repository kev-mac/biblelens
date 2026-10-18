import {createTimelineEventCard} from './components/timeline/TimelineEventCard.js';

const catalog = /*__TIMELINE__*/{};
const root = document.querySelector('#timeline-reviewed');
if (root) {
 root.querySelector('.timeline-view-intro').textContent = catalog.scope;
 const page = document.querySelector('#timeline-view');
 const search = page.querySelector('[type="search"]');
 const history = page.querySelector('[data-timeline-filter]');
 const list = root.querySelector('#timeline-list');
 function render() {
  const term = search.value.trim().toLowerCase();
  const events = catalog.events.filter(event => (history.getAttribute('aria-pressed') !== 'true' || event.discrepancy) && (!term || event.title.toLowerCase().includes(term)));
  root.querySelector('#timeline-count').textContent = `${events.length} of ${catalog.events.length} reviewed events · ${catalog.events.filter(event => event.discrepancy).length} qualified History flags · reviewed ${catalog.reviewed}`;
  list.replaceChildren(...events.map(event => {
   const node = createTimelineEventCard(event);
   node.classList.add(event.discrepancy ? 'theme-amber' : 'theme-blue');
   return node;
  }));
 }
 search.addEventListener('input', render);
 history.addEventListener('click', render);
 render();
 root.addEventListener('click', event => {
  const link = event.target.closest('[data-timeline-passage]');
  if (!link) return;
  event.preventDefault();
  const ref = readRef(link.dataset.timelinePassage);
  if (ref) { setView('explore'); loadChapter(ref.book, ref.chapter, ref.verse); }
 });
}
