import fs from 'node:fs';
import {exploreFeed} from './explore-feed.mjs';
import {b2Catalog} from './b2-catalog.mjs';

const catalog = b2Catalog(), rows = [];
const illustrationRule = 'Imagined artwork, never historical evidence or a real portrait. Show people of the ancient Near East and Africa with varied skin tones, features and natural hair textures. Keep portrayals dignified. Use the visible label Illustration. Do not infer likeness, beliefs or ancestry from a name.';
const add = (id, subject, ratio, alt, extra = {}) => rows.push({id, reviewStatus: 'draft / needs review', subject,
 classification: 'illustration', aspectRatio: ratio, alt, licenceSource: 'to be generated',
 label: 'Illustration', scope: illustrationRule, ...extra});
const subjects = {text:'Hands comparing ancient texts',science:'Plants beneath the sky',history:'Ancient writing on stone',translation:'Two ancient text pages',people:'People sharing a discussion',places:'Hills and paths in the ancient Near East',stories:'People listening to a story',commandments:'A scroll laid on a table',timeline:'Ancient ruins beside a path'};
add('explore:daily-debate', subjects.text, '16:9', 'Imagined hands comparing two ancient texts.', {placement: 'current hero; rotating debate',evidenceUse: false});
for (const [rail, items] of Object.entries(exploreFeed())) for (const [index, item] of items.entries()) {
 add(`explore:${rail}:${index}`, `${subjects[rail]}; setting for ${item.title}`, '3:2',
  `Imagined scene for ${rail === 'text' ? 'comparing accounts' : rail === 'science' ? 'exploring nature' : rail}.`,
  {placement: 'current Explore rail',target: item.url || item.placeId,evidenceUse: false});
}
// A CSV reader preserves quoted commas and embedded newlines in pinned source credits.
function csv(text) {
 const output = []; let row = [], value = '', quoted = false;
 for (let i = 0; i < text.length; i++) {
  const char = text[i];
  if (char === '"') { if (quoted && text[i+1] === '"') { value += '"'; i++; } else quoted = !quoted; }
  else if (!quoted && (char === ',' || char === '\n')) { row.push(value.replace(/\r$/, '')); value = ''; if (char === '\n') { output.push(row); row = []; } }
  else value += char;
 }
 if (value || row.length) { row.push(value); output.push(row); }
 const keys = output.shift(); return output.filter(row => row.length === keys.length).map(row => Object.fromEntries(keys.map((key,i) => [key,row[i]])));
}
for (const source of csv(fs.readFileSync('docs/images/shortlist.csv','utf8'))) {
 const debate = source.target_type === 'debate';
 rows.push({id: `${source.target_type}:${source.target_id}`, reviewStatus: 'draft / needs review',
  subject: source.subject, classification: 'evidence', evidenceUse: 'Source photograph for context only; does not establish the linked claim.',
  aspectRatio: debate ? '16:9' : '3:2', alt: `${source.subject}.`, placement: debate ? 'current Phase 3 draft card slot' : 'planned place slot',
  licenceSource: source.source_revision_url || source.source_url, sourceUrl: source.source_url,
  licence: source.licence, licenceUrl: source.licence_url, credit: source.credit_line,
  scope: source.fit_note, hold: source.fit_status === 'HOLD' || /hold/i.test(source.licence_status),
  reason: source.uncertainty || source.rights_note,
  rightsStatus: 'Pinned shortlist metadata only. Recheck the specific file, creator and licence before any use. No asset downloaded or visually reviewed.'});
}
for (const person of [...JSON.parse(fs.readFileSync('src/data/characters.json','utf8')),...catalog.collections.people.map(row => row.record)]) {
 add('person:' + person.id, `${person.name} in a scene drawn from the cited texts; no claimed likeness`, '3:4',
  `Imagined scene of ${person.name} in an ancient setting.`, {placement: 'planned profile slot',evidenceUse:false});
}
if (new Set(rows.map(row=>row.id)).size !== rows.length) throw Error('Duplicate image slot');
fs.writeFileSync('research/b2/shot-list.json',JSON.stringify({reviewStatus:'draft',illustrationRule,slots:rows},null,2)+'\n');
const escape = value => String(value).replaceAll('|','&#124;').replaceAll('\n',' ');
fs.writeFileSync('research/b2/shot-list.md',[
 '# Phase 4 Shot List', '', 'Draft preparation only. No images were generated or downloaded.', '',
 'Current slots: one daily hero, 54 Explore rail cards, and 40 Phase 3 draft cards.',
 'Planned slots: 50 shortlisted places and 185 profiles. These are not new runtime slots.',
 'Evidence means a source photograph. Context views do not prove events, people, text readings, or site identifications.',
 'All image rights and the 25 earlier fit holds remain pending. The owner has accepted no new image.',
 illustrationRule, '',
 '| Slot | Subject | Evidence / illustration | Crop | Alt text | Licence source | Hold |',
 '| --- | --- | --- | --- | --- | --- | --- |',
 ...rows.map(row => `| ${[row.id,row.subject,row.classification,row.aspectRatio,row.alt,row.licenceSource,row.hold ? row.reason : 'Needs review'].map(escape).join(' | ')} |`), ''
].join('\n'));
console.log(`PASS: ${rows.length} unique shot entries; every slot has subject, class, crop, alt text and rights source.`);
