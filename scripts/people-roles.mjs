import assert from 'node:assert/strict';
import zlib from 'node:zlib';
export const PEOPLE_ROLES = ['king','queen','judge','prophet','priest','apostle'];
export function validatePeopleRoles(people, books, chapters) {
 const ids = new Set(), decoded = new Map();
 let tags = 0;
 for (const person of people) {
  assert(person.id && !ids.has(person.id), `Unknown or duplicate person ID: ${person.id}`); ids.add(person.id);
  assert(Array.isArray(person.roles), `Missing roles: ${person.id}`);
  const roles = new Set();
  for (const tag of person.roles) {
   const at = `${person.id}/${tag.role}`;
   assert(PEOPLE_ROLES.includes(tag.role), `Invalid role: ${at}`);
   assert(!roles.has(tag.role), `Duplicate role: ${at}`); roles.add(tag.role);
   assert(['title','list'].includes(tag.basis), `Missing/invalid basis: ${at}`);
   assert(['live','draft'].includes(tag.status), `Missing/invalid status: ${at}`);
   // ROLES2 accepted the reviewed titles; Jesus's two framing decisions remain held.
   assert(person.sourceRecord !== 'jesus_905' || !['prophet','priest'].includes(tag.role) || tag.status === 'draft', `Role awaits owner decision: ${at}`);
   assert(tag.basis !== 'list' || ['king','queen','judge','apostle'].includes(tag.role), `Unsupported list: ${at}`);
   const match = /^(.*) (\d+):(\d+)$/.exec(tag.ref || '');
   const book = match && books.find(book => book.name === match[1]);
   assert(book, `Invalid ref: ${at}`);
   if (tag.basis === 'list') {
    const allowedBooks = tag.role === 'judge' ? [6,8] : tag.role === 'apostle' ? [39,40,41,43] : [10,11,12,13];
    assert(allowedBooks.includes(book.id), `Unsupported canonical list book: ${at}`);
   }
   const key = `${book.id}:${Number(match[2])}`;
   if (!decoded.has(key)) decoded.set(key, chapters[key] && JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key], 'base64'))));
   const verse = decoded.get(key)?.verses.find(verse => verse.n === Number(match[3]));
   assert(verse, `Unresolved ref: ${at}/${tag.ref}`);
   assert(typeof tag.phrase === 'string' && tag.phrase.trim() && verse.kjv.includes(tag.phrase), `Quote mismatch: ${at}/${tag.ref}`);
   if (tag.basis === 'title') {
    const title = tag.role === 'prophet' ? /\bprophet(?:ess|s)?\b/i : new RegExp('\\b' + tag.role + 's?\\b', 'i');
    assert(title.test(tag.phrase), `Missing role title in phrase: ${at}`);
   }
   tags++;
  }
 }
 return {people: ids.size, tags};
}
export function releasePeopleRoles(people, drafts = false) {
 return people.map(person => ({...person, roles: (person.roles || []).filter(tag => tag.status === 'live' || drafts)}));
}
