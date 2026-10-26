import {titleCase} from '../../title-case.js';
// Load TimelineEventCard.css alongside the application's shared style.css.
// discrepancy is optional: { academic_consensus, summary }.
const template = document.createElement('template');
template.innerHTML = `
  <div class="timeline-node">
    <article class="timeline-event-card">
      <div class="timeline-event-body">
        <h3 class="timeline-event-title"></h3>
        <p class="timeline-event-date"></p>
      </div>
      <button class="timeline-history glass-pill" type="button" data-tone="history"
        aria-expanded="false">History</button>
      <div class="timeline-discrepancy" aria-hidden="true" inert>
        <div class="timeline-discrepancy-clip">
          <section class="timeline-discrepancy-content" aria-label="Academic Discrepancy">
            <h4>Academic Discrepancy</h4>
            <dl class="timeline-date-comparison">
              <div><dt>Biblical Date</dt><dd data-traditional-date></dd></div>
              <div><dt data-academic-label>Academic Consensus</dt><dd data-academic-consensus></dd></div>
            </dl>
            <p class="timeline-discrepancy-summary"></p>
          </section>
        </div>
      </div>
    </article>
  </div>`;

let nextId = 0;

function paragraph(className, text) {
  const element = document.createElement('p');
  element.className = className;
  element.textContent = text;
  return element;
}

function appendSources(container, sources = []) {
  if (!sources.length) return;
  const list = document.createElement('ul');
  list.className = 'timeline-sources';
  list.setAttribute('aria-label', 'Sources');
  for (const source of sources) {
    // Never turn supplied content into executable markup or javascript: links.
    let url;
    try { url = new URL(source.url); } catch { continue; }
    if (url.protocol !== 'https:') continue;
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = source.label;
    item.append(link);
    list.append(item);
  }
  container.append(list);
}

/** Return a detached timeline node; supplied strings are rendered as text. */
export function createTimelineEventCard(event) {
  const node = template.content.firstElementChild.cloneNode(true);
  const title = node.querySelector('.timeline-event-title');
  title.id = `timeline-title-${++nextId}`;
  title.textContent = titleCase(event.title);
  node.querySelector('article').setAttribute('aria-labelledby', title.id);
  node.querySelector('.timeline-event-date').textContent = event.traditional_date;

  const button = node.querySelector('.timeline-history');
  const drawer = node.querySelector('.timeline-discrepancy');
  const card = node.querySelector('article');
  if (event.id) node.dataset.timelineEvent = event.id;
  if (event.ref) {
    const passage = document.createElement('a');
    passage.className = 'timeline-passage';
    passage.href = /^#read\/\d+\/\d+\/\d+$/.test(event.passage_href || '') ? event.passage_href : '#timeline';
    passage.dataset.timelinePassage = event.ref;
    passage.textContent = event.ref;
    drawer.before(passage);
  }
  if (event.review_status) drawer.before(paragraph('timeline-review-status', event.review_status));
  if (!event.discrepancy) {
    button.remove();
    drawer.remove();
    if (event.summary) card.append(paragraph('timeline-event-summary', event.summary));
    if (event.scope) card.append(paragraph('timeline-scope', event.scope));
    appendSources(card, event.sources);
    return node;
  }

  node.querySelector('.timeline-event-card').classList.add('has-discrepancy');
  drawer.id = `timeline-discrepancy-${nextId}`;
  button.setAttribute('aria-controls', drawer.id);
  button.setAttribute('aria-label', `History: academic discrepancy for ${event.title}`);
  node.querySelector('[data-traditional-date]').textContent = event.traditional_date;
  node.querySelector('[data-academic-consensus]').textContent = event.discrepancy.academic_consensus;
  node.querySelector('[data-academic-label]').textContent = event.discrepancy.academic_label || 'Academic Consensus';
  node.querySelector('.timeline-discrepancy-summary').textContent = event.discrepancy.summary;
  const content = node.querySelector('.timeline-discrepancy-content');
  if (event.discrepancy.kind) content.prepend(paragraph('timeline-discrepancy-kind', event.discrepancy.kind));
  if (event.discrepancy.scope) content.append(paragraph('timeline-scope', event.discrepancy.scope));
  appendSources(content, event.discrepancy.sources);
  if (event.reviewed) content.append(paragraph('timeline-reviewed', `Reviewed ${event.reviewed}`));

  // A native button supplies Enter/Space activation as well as pointer/touch clicks.
  button.addEventListener('click', () => {
    const expanded = drawer.classList.toggle('is-expanded');
    button.setAttribute('aria-expanded', String(expanded));
    drawer.setAttribute('aria-hidden', String(!expanded));
    drawer.inert = !expanded;
  });
  return node;
}
