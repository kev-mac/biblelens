import {referenceJson} from '../../reference-cache.js';
import books from '../../../data/books.json';
import {characters} from './directory';
import referenceIds from '../../data/character-reference-ids.json';
const writtenByReference=new Map(characters.map(profile=>[(referenceIds as Record<string,string>)[profile.id],profile]));
import type { CharacterProfile } from '../../types/character';

export interface DirectoryPerson extends CharacterProfile {
  roles: {role: string; ref: string; phrase: string; basis: string; status: string}[];
  key_passages: string[];
  testaments: ('old'|'new')[];
}
const normalize = (value: string): string => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// The site's adapted Theographic records use zero-based book IDs, like the reader.
export function mapPeople(raw: unknown): DirectoryPerson[] {
  if (!Array.isArray(raw)) throw new Error('Invalid people directory');
  const seen = new Set<string>();
  const records = new Map(raw.filter(row => row && typeof row.id === 'string').map(row => [row.id, row]));
  const mapped: DirectoryPerson[] = raw.flatMap(record => {
    if (!record || typeof record.id !== 'string' || !record.id || typeof record.name !== 'string' || !record.name.trim() || seen.has(record.id)) return [];
    seen.add(record.id);
    const aliases = [...new Set<string>((Array.isArray(record.aliases) ? record.aliases : []).filter((name: unknown): name is string => typeof name === 'string' && !!name.trim()))].filter(name => normalize(name) !== normalize(record.name));
    const passages = new Set<string>(),referenceBooks=new Set<number>();
    for (const ref of Array.isArray(record.refs) ? record.refs : []) {
      if (!Array.isArray(ref) || ref.length !== 3 || !ref.every(Number.isInteger)) continue;
      const [bookId, chapter, verse] = ref;
      const book = books.find(book => book.id === bookId);
      if (book && chapter > 0 && chapter <= book.chapters && verse > 0) {passages.add(`${book.name} ${chapter}:${verse}`);referenceBooks.add(bookId);}
    }
    const written=writtenByReference.get(record.id);
    const summary = [record.summary, record.description, record.title].find(value => typeof value === 'string' && value.trim()) || written?.summary || '';
    const key_passages = [...passages];
    let label=typeof record.label==='string'&&record.label!==record.name?record.label:'';
    if(label.startsWith(record.name+' (')&&label.endsWith(')'))label=label.slice(record.name.length+2,-1);
    const roles = Array.isArray(record.roles) ? record.roles : [];
    const role = roles[0];
    const kingdom = role?.role === 'king' && /king of ([A-Z][a-z]+)/.exec(role.phrase);
    const roleLabel = role ? (kingdom ? 'King of ' + kingdom[1] : role.role[0].toUpperCase() + role.role.slice(1)) : '';
    if (roleLabel) {
      const sameRole = raw.some(other => other.id !== record.id && other.name === record.name && other.roles?.some(tag => tag.role === role.role && (!kingdom || tag.phrase.includes('king of ' + kingdom[1]))));
      const parent = [...(record.relations?.father || []), ...(record.relations?.mother || [])].map(relation => records.get(relation.id)?.name).find(Boolean);
      label = roleLabel + (sameRole && parent ? ', child of ' + parent : '');
    }
    return [{roles, id: record.id, name: record.name.trim(), identity_context: label || (() => {
      const parent = [...(record.relations?.father || []), ...(record.relations?.mother || [])].map((relation: {id: string}) => records.get(relation.id)?.name).find(Boolean);
      return parent ? 'child of ' + parent : `${key_passages.length} ${key_passages.length === 1 ? 'linked verse' : 'linked verses'}`;
    })(), aliases, summary, key_passages,
      sex: record.gender === 'Female' ? 'female' : record.gender === 'Male' ? 'male' : 'unspecified',
      era: written?.era || 'Across scripture', geography: written?.geography || {origin: '', residence: []},
      testaments: [...new Set([...referenceBooks].map(book=>book<39?'old':'new'))],
      narrative_anchors: {books: written?.narrative_anchors.books || [], key_verses: key_passages, linked_stories: written?.narrative_anchors.linked_stories || []}} as DirectoryPerson];
  }).sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
  const counts=new Map<string,number>();
  for(const person of mapped)counts.set(normalize(person.name),(counts.get(normalize(person.name))||0)+1);
  for(const person of mapped)if(counts.get(normalize(person.name))===1)delete person.identity_context;
  return mapped;
}

let pending: Promise<DirectoryPerson[]> | undefined;
export function fetchPeople(): Promise<DirectoryPerson[]> {
  // Share in-flight requests; allow a fresh request after a failed load.
  return pending ||= referenceJson('/reference/people.json').then(raw => {
    const people = mapPeople(raw);
    if (!people.length) throw new Error('The people directory is empty');
    return people;
  }).catch(error => { pending = undefined; throw error; });
}

export function createPeopleSearch(people: DirectoryPerson[]) {
  const index = people.map(person => ({person, names: [person.name, ...(person.aliases || [])].map(normalize)}));
  return (query: string, womenOnly = false): DirectoryPerson[] => {
    const normalized = normalize(query.trim());
    const terms = normalized.split(/\s+/).filter(Boolean);
    return index.filter(({person, names}) => (!womenOnly || person.sex === 'female') && terms.every(term => names.some(name => name.split(/[^\p{L}\p{N}]+/u).some(word => word.startsWith(term)))))
      .map(entry => ({...entry, rank: !normalized ? 0 : entry.names[0] === normalized ? 5 : entry.names[0].startsWith(normalized) ? 4 : terms.every(term => entry.names[0].split(/[^\p{L}\p{N}]+/u).some(word => word.startsWith(term))) ? 3 : entry.names.includes(normalized) ? 2 : 1}))
      .sort((a, b) => b.rank - a.rank).map(entry => entry.person);
  };
}

export const CHARACTER_PAGE_SIZE = 15;
export function characterPage<T>(matches: T[], page: number): T[] {
  return matches.slice(page * CHARACTER_PAGE_SIZE, (page + 1) * CHARACTER_PAGE_SIZE);
}
