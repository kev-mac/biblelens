import academicDiscrepancies from '../data/academic-discrepancies.json';
import academicSources from '../data/academic-discrepancy-sources.json';
import {titleCase} from './title-case.js';
export {academicDiscrepancies};

// Curated identities: never fuzzy-match a bare place name such as Jericho.
const aliases = {
 the_flood: ['the flood', 'the great flood', 'the great flood begins', 'the flood subsides', 'noahs flood', 'noah flood', 'recwQJTWTmTkUMHHp', 'recmLyx1yqtuANkqd', 'rec1P4d8N4XdXzH2l'],
 tower_of_babel: ['the tower of babel', 'tower of babel', 'recy4o2BxavybTuX6'],
 patriarchs: ['the patriarchs', 'patriarchal period', 'age of the patriarchs', 'lifetime of abraham', 'lifetime of isaac', 'lifetime of jacob', 'recfnatCOLEHFYeLB'],
 the_exodus: ['exodus', 'exodus from egypt', 'the exodus from egypt', 'recjkmUO88wihv8Ci'],
 conquest_of_jericho: ['conquest of jericho', 'fall of jericho', 'battle of jericho', 'destruction of jericho', 'jericho falls'],
 conquest_of_canaan: ['conquest of canaan', 'the conquest of canaan', 'israelite conquest of canaan', 'joshua conquers canaan', 'war with canaanites']
};
export const normalizeEventName = value => String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const identities = new Map(Object.entries(aliases).flatMap(([key, names]) => [key, ...names].map(name => [normalizeEventName(name), key])));

// Handles the actual Airtable {id, fields:{title,...}} export and flat consumers.
// Returns new nodes and preserves source dates and all upstream fields.
export function mergeAcademicDiscrepancies(events, dictionary = academicDiscrepancies) {
 if (!Array.isArray(events)) throw new TypeError('Timeline events must be an array');
 return events.map(event => {
  const fields = event.fields || event;
  const candidates = [event.id, fields.id, fields.eventID, event.name, event.title, fields.name, fields.title];
  const key = candidates.map(normalizeEventName).map(name => Object.hasOwn(dictionary, name) ? name : identities.get(name)).find(name => name && Object.hasOwn(dictionary, name));
  return {...event, has_academic_conflict: Boolean(key), academic_discrepancy_key: key || null, academic_discrepancy: key ? {...dictionary[key]} : null};
 });
}
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
export function formatTimelineDate(value) {
 // Theographic uses ISO astronomical years: 0 = 1 BCE; -2347 = 2348 BCE.
 const match = /^(-?\d+)(?:-\d{2}(?:-\d{2})?)?$/.exec(String(value ?? ''));
 if (!match) return value ? String(value) : 'Date not supplied';
 const year = Number(match[1]);
 return year <= 0 ? `${1 - year} BCE` : `${year} CE`;
}
export function formatTimelineDuration(value) {
 const units = {D:'day',W:'week',Y:'year',M:'month'};
 return String(value).replace(/(\d+(?:\.\d+)?)([DYMW])/g, (_, n, unit) => `${n} ${units[unit]}${Number(n) === 1 ? '' : 's'} `).trim();
}
export function renderTimelineCard(event, index) {
 const fields = event.fields || event;
 const title = titleCase(fields.title || fields.name || 'Untitled event');
 const discrepancy = event.has_academic_conflict && event.academic_discrepancy;
 const panelId = `timeline-academic-${index}`;
 const sources = academicSources[event.academic_discrepancy_key] || [];
 const comparison = discrepancy ? `<button type="button" class="timeline-history-chip glass-pill academic" data-tone="academic" data-timeline-history aria-expanded="false" aria-controls="${panelId}" aria-label="Academic (History): ${escape(title)}"><svg class="category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m2 9 10-5 10 5-10 5-10-5Z"/><path d="M6 11v6c4 3 8 3 12 0v-6M22 9v7"/></svg>Academic (History)</button>` : '';
 const panel = discrepancy ? `<section id="${panelId}" class="timeline-academic" aria-label="Academic history comparison" hidden><dl class="timeline-date-comparison"><div><dt>Traditional date</dt><dd>${escape(discrepancy.traditional_date)}</dd></div><div><dt>Academic assessment</dt><dd>${escape(discrepancy.academic_consensus)}</dd></div></dl><p>${escape(discrepancy.summary)}</p><p class="timeline-limits">Traditional chronologies vary; the event’s source date above is retained. These are sourced editorial summaries; a flag can indicate disputed dating or lack of corroboration.</p><ul class="timeline-sources">${sources.map(source => `<li><a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.label)} ↗</a></li>`).join('')}</ul></section>` : '';
 return `<article class="timeline-card"><div class="timeline-card-top"><p class="eyebrow">${fields.rangeFlag ? 'c. ' : ''}${escape(formatTimelineDate(fields.startDate ?? fields.date))}</p>${comparison}</div><h2>${escape(title)}</h2>${fields.description ? `<p>${escape(fields.description)}</p>` : ''}${fields.duration ? `<p class="timeline-duration">Duration: ${escape(formatTimelineDuration(fields.duration))}</p>` : ''}${panel}</article>`;
}
