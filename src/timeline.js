import rawEvents from '../data/reference/events.json';
import {mergeAcademicDiscrepancies, renderTimelineCard} from './timeline-core.js';

const events = mergeAcademicDiscrepancies(rawEvents).sort((a, b) => {
 const date = event => Number(event.fields.sortKey ?? event.fields.startDate);
 return date(a) - date(b);
});
const root = document.querySelector('#timeline-view');
const list = root.querySelector('.timeline-list');
const search = root.querySelector('[type="search"]');
const history = root.querySelector('[data-timeline-filter]');
let historyOnly = false;
function render() {
 const term = search.value.trim().toLowerCase();
 const visible = events.filter(event => (!historyOnly || event.has_academic_conflict) && (!term || event.fields.title.toLowerCase().includes(term)));
 list.innerHTML = visible.map(renderTimelineCard).join('') || '<p class="empty">No matching timeline events.</p>';
 root.querySelector('[role="status"]').textContent = `${visible.length} of ${events.length} events`;
}
search.addEventListener('input', render);
history.addEventListener('click', () => {historyOnly = !historyOnly; history.setAttribute('aria-pressed', String(historyOnly)); render();});
list.addEventListener('click', event => {
 const button = event.target.closest('[data-timeline-history]');
 if (!button) return;
 const panel = document.getElementById(button.getAttribute('aria-controls'));
 const expanded = button.getAttribute('aria-expanded') !== 'true';
 button.setAttribute('aria-expanded', String(expanded));
 panel.hidden = !expanded;
});
render();
