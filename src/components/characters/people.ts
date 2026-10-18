import books from '../../../data/books.json';
import type { CharacterProfile } from '../../types/character';

export interface DirectoryPerson extends CharacterProfile {
  key_passages: string[];
}
const normalize = (value: string): string => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// The site's adapted Theographic records use zero-based book IDs, like the reader.
export function mapPeople(raw: unknown): DirectoryPerson[] {
  if (!Array.isArray(raw)) throw new Error('Invalid people directory');
  const seen = new Set<string>();
  return raw.flatMap(record => {
    if (!record || typeof record.id !== 'string' || !record.id || typeof record.name !== 'string' || !record.name.trim() || seen.has(record.id)) return [];
    seen.add(record.id);
    const aliases = [...new Set<string>((Array.isArray(record.aliases) ? record.aliases : []).filter((name: unknown): name is string => typeof name === 'string' && !!name.trim()))].filter(name => normalize(name) !== normalize(record.name));
    const passages = new Set<string>();
    for (const ref of Array.isArray(record.refs) ? record.refs : []) {
      if (!Array.isArray(ref) || ref.length !== 3 || !ref.every(Number.isInteger)) continue;
      const [bookId, chapter, verse] = ref;
      const book = books.find(book => book.id === bookId);
      if (book && chapter > 0 && chapter <= book.chapters && verse > 0) passages.add(`${book.name} ${chapter}:${verse}`);
    }
    const summary = [record.summary, record.description, record.title].find(value => typeof value === 'string' && value.trim()) || '';
    const key_passages = [...passages];
    return [{id: record.id, name: record.name.trim(), aliases, summary, key_passages,
      sex: record.gender === 'Female' ? 'female' : record.gender === 'Male' ? 'male' : 'unspecified',
      era: 'Across scripture', geography: {origin: '', residence: []},
      narrative_anchors: {books: [], key_verses: key_passages, linked_stories: []}} as DirectoryPerson];
  }).sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
}

let pending: Promise<DirectoryPerson[]> | undefined;
export function fetchPeople(): Promise<DirectoryPerson[]> {
  // Share in-flight requests; allow a fresh request after a failed load.
  return pending ||= fetch('/reference/people.json').then(async response => {
    if (!response.ok) throw new Error(`People request failed (${response.status})`);
    const people = mapPeople(await response.json());
    if (!people.length) throw new Error('The people directory is empty');
    return people;
  }).catch(error => { pending = undefined; throw error; });
}

export function createPeopleSearch(people: DirectoryPerson[]) {
  const index = people.map(person => ({person, names: [person.name, ...(person.aliases || [])].map(normalize)}));
  return (query: string, womenOnly = false): DirectoryPerson[] => {
    const normalized = normalize(query.trim());
    const terms = normalized.split(/\s+/).filter(Boolean);
    return index.filter(({person, names}) => (!womenOnly || person.sex === 'female') && terms.every(term => names.some(name => name.includes(term))))
      .map(entry => ({...entry, rank: !normalized ? 0 : entry.names.includes(normalized) ? 2 : entry.names.some(name => name.startsWith(normalized)) ? 1 : 0}))
      .sort((a, b) => b.rank - a.rank).map(entry => entry.person);
  };
}

export const CHARACTER_PAGE_SIZE = 24;
export function characterPage<T>(matches: T[], page: number): T[] {
  return matches.slice(page * CHARACTER_PAGE_SIZE, (page + 1) * CHARACTER_PAGE_SIZE);
}
