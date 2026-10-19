import {gunzipSync} from 'node:zlib';
import {passageReference} from './story-topics.mjs';

const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function validateStories(catalog, {books, chapters, topics}) {
 const seenBooks = new Set(), titles = new Set(), slugs = new Set(), decoded = new Map();
 const vocabulary = new Set(topics.map(topic => topic.label));
 const nonempty = value => typeof value === 'string' && value.trim().length > 0;
 let previous = -1, total = 0;
 for (const entry of catalog) {
  const index = books.findIndex(book => book.name === entry.book);
  if (index < 0 || seenBooks.has(entry.book) || index <= previous) throw Error(`Invalid story book order: ${entry.book}`);
  if (Object.keys(entry).sort().join(',') !== 'book,stories' || !Array.isArray(entry.stories) || !entry.stories.length) throw Error(`Invalid story book: ${entry.book}`);
  seenBooks.add(entry.book); previous = index;
  for (const story of entry.stories) {
   if (Object.keys(story).sort().join(',') !== 'cross_references,passage,summary,title,topics' || !['title','passage','summary'].every(key => nonempty(story[key]))) throw Error('Invalid story metadata');
   const title = story.title.trim().toLowerCase(), id = slug(story.title);
   if (!id || titles.has(title) || slugs.has(id)) throw Error(`Duplicate story title or slug: ${story.title}`);
   titles.add(title); slugs.add(id);
   if (!Array.isArray(story.topics) || story.topics.length > 5 || new Set(story.topics).size !== story.topics.length || story.topics.some(topic => !vocabulary.has(topic))) throw Error(`Invalid story topics: ${story.title}`);
   if (!Array.isArray(story.cross_references)) throw Error(`Invalid story cross-references: ${story.title}`);
   for (const label of [story.passage, ...story.cross_references]) {
    if (!nonempty(label)) throw Error('Invalid story reference');
    const [book, chapter, verse, endChapter, endVerse] = passageReference(label, books);
    if (label === story.passage && book !== books[index].id) throw Error(`Wrong story book: ${label}`);
    for (let n = chapter; n <= endChapter; n++) {
     const key = `${book}:${n}`;
     if (!chapters[key]) throw Error(`Missing story chapter: ${label}`);
     if (!decoded.has(key)) decoded.set(key, new Set(JSON.parse(gunzipSync(Buffer.from(chapters[key],'base64'))).verses.map(v => v.n)));
     const verses = decoded.get(key);
     if (n === chapter && !verses.has(verse) || n === endChapter && !verses.has(endVerse)) throw Error(`Missing story verse: ${label}`);
    }
   }
   total++;
  }
 }
 return total;
}
