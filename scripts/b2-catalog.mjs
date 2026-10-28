import {b6Catalog} from './b6-drafts.mjs';
import {neutralTree,b4Proposals} from './b4-neutral.mjs';
import fs from 'node:fs';
import {createHash} from 'node:crypto';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export function b2Catalog() {
  const audit = read('research/codex-reviews/2026-10-26/audit.json');
  const returned = new Set(audit.decisions.filter(row => row.verdict === 'return to research').map(row => row.id));
  const collections = {evidence: [], people: [], timeline: [], stories: [], prophecies: [], rewrites: []};
  const add = (collection, record, provenance, extra = {}) => {
    collections[collection].push({id: record.id, reviewStatus: 'draft', record, provenance, ...extra});
  };
  for (const file of Object.keys(audit.input_sha256).filter(file => file.endsWith('records.json'))) {
    const source = 'research/claude-drafts/' + file, input = read(source);
    for (const record of Array.isArray(input) ? input : input.events) {
      if (returned.has(record.id)) continue;
      add(file.includes('characters') ? 'people' : file === 'academic-cards-records.json' ? 'timeline' : 'evidence',
        record, {commit: 'ed9e7768ce1d780c40c7b6b63a9d82b9719a8900', source, digest: digest(record)});
    }
    for (const record of input.history_records || []) add('evidence', record, {commit: 'ed9e7768ce1d780c40c7b6b63a9d82b9719a8900', source, digest: digest(record)});
  }
  for (const name of ['evidence', 'prophecies', 'timeline']) {
    const source = `research/codex-drafts/content-gaps/${name}.json`;
    for (const row of read(source).records) add(name, row.record,
      {commit: '2559fee1fe7d82e9da042357df10f85afbf6c1d6', source, digest: digest(row.record)}, {limits: row.scope || '', sourceReview: row});
  }
  const source = 'research/codex-drafts/content-gaps/stories.json';
  const storyDrafts = read(source);
  for (const group of storyDrafts.catalog) for (const story of group.stories) {
    const record = {id: slug(group.book) + '-' + slug(story.title), book: group.book, ...story};
    const review = storyDrafts.reviews.find(row => row.book === group.book && row.title === story.title);
    if (!review) throw Error('Missing story source review: ' + story.title);
    add('stories', record, {commit: '2559fee1fe7d82e9da042357df10f85afbf6c1d6', source, digest: digest(record)},
      {limits: 'Draft category placement. Teaching, letters and visions still need the owner’s scope decision.', sourceReview: review});
  }
  for (const name of ['people', 'stories']) for (const row of read(`docs/plain-language/${name}.json`).filter(row => row.flags.length)) {
    add('rewrites', {id: name + ':' + row.id, title: row.name || row.title, summary: row.draft},
      {commit: '11ebeca349d2a00d37adcb9f6847d28f07c129b5', source: `docs/plain-language/${name}.json`},
      {targetCollection: name, targetId: row.id, original: row.original, meaningChecks: row.flags});
  }
  const cards = fs.readFileSync('docs/plain-language/explore-cards.md', 'utf8');
  for (const [, id, title, original, draft, meaning] of cards.matchAll(/^## (\S+) — ([^\n]+)\n\n\*\*Original:\*\* ([^\n]+)\n\n\*\*Draft:\*\* ([^\n]+)\n\n\*\*Meaning flag:\*\* ([^\n]+)/gm)) {
    if (meaning === 'None.') continue;
    add('rewrites', {id: 'explore:' + id, title, summary: draft},
      {commit: '11ebeca349d2a00d37adcb9f6847d28f07c129b5', source: 'docs/plain-language/explore-cards.md'},
      {targetCollection: 'explore', targetId: id, original, meaningChecks: [meaning],
        limits: 'The earlier card layout has been replaced. Review this wording before mapping it to a current rail or footer.'});
  }
  for (const row of read('research/b2/academic-context.json')) {
    add('evidence', row.record, row.provenance, {limits: row.limits});
    add('timeline', row.event, row.provenance, {limits: row.limits});
  }
  // Every extension remains an independent proposal. Never silently overwrite accepted records or competing drafts.
  for (const [name, rows] of Object.entries(collections)) {
    if (new Set(rows.map(row => row.id)).size !== rows.length) throw Error('Duplicate B2 proposal in ' + name);
    const accepted = name === 'evidence' ? read('data/evidence.json') : name === 'people' ? read('src/data/characters.json') : [];
    for (const row of rows) {
      const original = accepted.find(record => record.id === row.id);
      if (original) { row.operation = 'proposed revision'; row.acceptedDigest = digest(original); }
      else row.operation = name === 'rewrites' ? 'proposed wording' : 'proposed addition';
    }
  }
  return {draft_only: true, reviewStatus: 'draft', ownerAccepted: false, collections,
    holds: read('research/b2/holds.json'), researchReturns: read('research/b2/research-returns.json')};
}

export function packageB2Review(assets) {
  const payload = neutralTree(b6Catalog(neutralTree(b2Catalog())));
  payload.b4Wording = Object.entries(b4Proposals().collections).flatMap(([source,rows])=>rows.map(row=>({id:source+':'+row.path.join('.'),record:{title:source,summary:row.draft},reviewStatus:'draft',source,path:row.path})));
  payload.b4Readings = JSON.parse(fs.readFileSync('research/b4/reading-proposals.json','utf8')).records.map(row=>({...row,record:{id:row.id,title:row.question,summary:row.readings.map(reading=>reading.summary).join(' '),sources:row.sources}}));
  for (const [file,type] of [['teachings.html','text/html'],['teachings.js','application/javascript']]) assets['/'+file]={type:type+'; charset=utf-8',body:fs.readFileSync('src/'+file,'utf8')};
  assets['/teachings.json']={type:'application/json; charset=utf-8',body:fs.readFileSync('research/b6/teachings.json','utf8')};
  const feed=JSON.parse(assets['/explore-feed.json'].body);feed.teachings=payload.collections.teachings.map(({record})=>({id:record.id,title:record.title,meta:'Draft · '+record.form+' · '+record.passage,url:'/teachings.html#'+record.id}));
  assets['/explore-feed.json'].body=JSON.stringify(feed);
  assets['/atlas-explore.js'].body=assets['/atlas-explore.js'].body.replace("const collections=[", "const collections=[{key:'teachings',image:'commandments',title:'Teachings & Laws',copy:'Explore teachings, laws, instructions, and lists in their written setting.',url:'/teachings.html'},");
  assets['/draft-review.json'] = {type: 'application/json; charset=utf-8', body: JSON.stringify(payload)};
  for (const [file, type] of [['draft-review.html', 'text/html'], ['draft-review.js', 'application/javascript'], ['draft-review.css', 'text/css']]) {
    assets['/' + file] = {type: type + '; charset=utf-8', body: fs.readFileSync('src/' + file, 'utf8')};
  }
}

if (process.argv.includes('--write')) {
  fs.mkdirSync('research/b2', {recursive: true});
  fs.writeFileSync('research/b2/catalog.json', JSON.stringify(b2Catalog(), null, 2) + '\n');
}
