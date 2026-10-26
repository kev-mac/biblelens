import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
// These are screening terms, not a complete language or scholarly accuracy check.
const jargon = [
  ['Brenton', /\bBrenton(?:['’]s)?\b/gi, /old Greek translation/i],
  ['Septuagint', /\bSeptuagint\b/gi, /old Greek translation/i],
  ['WLC', /\bWLC\b/g, /Hebrew text/i],
  ['Masoretic', /\bMasoretic\b/gi, /Hebrew text/i],
  ['Tischendorf', /\bTischendorf\b/gi],
  ['Textus Receptus', /\bTextus\s+Receptus\b/gi],
  ['manuscript', /\bmanuscripts?\b/gi, /ancient copies/i],
  ['witness', /\bwitness(?:es)?\b/gi, /ancient copies/i],
  ['harmoniz', /\bharmoniz\w*/gi],
  ['recension', /\brecensions?\b/gi],
  ['ordinal', /\bordinals?\b/gi],
  ['calibration', /\bcalibrations?\b/gi],
];

export function words(text) {
  return text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || [];
}

export function syllables(word) {
  const value = word.toLowerCase().replace(/['’]s$/, '').replace(/[^a-z]/g, '');
  if (!value || value.length <= 3) return 1;
  // Approximate English vowel groups, silent final e, and pronounced consonant-le.
  const stem = value.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  return Math.max(1, (stem.match(/[aeiouy]+/g) || []).length);
}

export function assess(text, { blurb = false } = {}) {
  // Do not read Scripture/source title fields. Within prose, quoted spans are
  // conservatively exempt too: we cannot reliably classify a quotation's source.
  const prose = text.replace(/<[^>]*>/g, ' ').replace(/“[^”]*”|"[^"\n]*"/g, ' ');
  const tokens = words(prose);
  const sentences = [...segmenter.segment(prose)].map(part => words(part.segment)).filter(part => part.length);
  const counts = jargon.map(([term, regex, explanation]) => {
    const matches = [...prose.matchAll(regex)];
    // An explanation must be in the same sentence as the first use. Human review
    // is still needed for other explanations and nontechnical uses of "witness".
    const firstSentence = matches.length && [...segmenter.segment(prose)].find(part =>
      part.index <= matches[0].index && part.index + part.segment.length > matches[0].index);
    const unexplained = matches.length > 0 && !(explanation && explanation.test(firstSentence.segment));
    return { term, count: matches.length, unexplained };
  });
  return {
    grade: tokens.length ? 0.39 * tokens.length / Math.max(1, sentences.length)
      + 11.8 * tokens.reduce((sum, word) => sum + syllables(word), 0) / tokens.length - 15.59 : null,
    tooLong: sentences.some(sentence => sentence.length > 20) || (blurb && tokens.length > 15),
    unexplained: counts.some(item => item.unexplained),
    counts,
  };
}

export function collections(directory = root) {
  const read = name => fs.readFileSync(path.join(directory, name), 'utf8');
  const json = name => JSON.parse(read(name));
  const lines = (records, fields) => records.flatMap(record => fields.flatMap(field =>
    typeof record[field] === 'string' ? record[field].split(/\r?\n/).filter(line => line.trim()) : []));
  // Extract only literal copy properties, never execute browser code. Include
  // deferred cards so their copy is checked before they are made visible again.
  const copy = [...read('src/atlas-explore.js').matchAll(/\bcopy\s*:\s*('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")/g)]
    .map(match => match[1].slice(1, -1).replace(/\\(['"\\])/g, '$1').replace(/\\n/g, '\n'));
  if (!copy.length) throw new Error('No Explore card copy found; update the literal extractor.');
  return [
    { name: 'Evidence', lines: lines(json('data/evidence.json'), ['summary', 'reasoning', 'scope']) },
    { name: 'Stories', lines: lines(json('data/stories.json').flatMap(book => book.stories), ['summary']) },
    { name: 'People', lines: lines(json('src/data/characters.json'), ['summary']) },
    { name: 'Explore cards', lines: copy, blurb: true },
  ];
}

export function report(groups) {
  let failed = false;
  console.log('| Collection | Lines | Average FK grade | Over length limits | Unexplained jargon lines |');
  console.log('| --- | ---: | ---: | ---: | ---: |');
  const details = [];
  for (const group of groups) {
    const results = group.lines.map(line => assess(line, group));
    const grades = results.map(result => result.grade).filter(grade => grade !== null);
    const average = grades.length ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length : 0;
    const long = results.filter(result => result.tooLong).length;
    const unexplained = results.filter(result => result.unexplained).length;
    const counts = jargon.map(([term]) => [term, results.reduce((sum, result) =>
      sum + result.counts.find(item => item.term === term).count, 0)])
      .filter(([, count]) => count).sort((a, b) => b[1] - a[1]).slice(0, 10);
    failed ||= average > 8 || long > 0 || unexplained > 0;
    console.log(`| ${group.name} | ${results.length} | ${average.toFixed(2)} | ${results.length ? (100 * long / results.length).toFixed(1) : '0.0'}% (${long}) | ${unexplained} |`);
    details.push(`${group.name} — top jargon: ${counts.map(([term, count]) => `${term}: ${count}`).join(', ') || 'none'}`);
  }
  console.log('\n' + details.join('\n'));
  console.log('\nEstimated English syllables; each nonempty field line counts once. FK grades are averaged per line.');
  console.log('Length limits: 20 words per sentence; 15 words per card blurb. Quoted spans are excluded.');
  console.log('Jargon screening uses the listed terms and same-sentence plain equivalents; review context manually.');
  return failed;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const failed = report(collections());
  const strict = process.argv.includes('--strict');
  console.log(`\n${strict ? 'Strict' : 'Report-only'} mode: ${failed ? 'items need review' : 'within checked limits'}.`);
  if (strict && failed) process.exitCode = 1;
}
