import profiles from '../../data/characters.json';
import books from '../../../data/books.json';
import type { CharacterProfile } from '../../types/character';

export const characters = profiles as CharacterProfile[];
// Explicit aliases retain family qualifiers and never confuse Cain’s Enoch with Jared’s son.
const aliases: Record<string, string> = {
  'Abram (Abraham)': 'abraham',
  'Sarai (Sarah; inferred from Genesis 20:12)': 'sarah',
  'Terah (inferred from Genesis 20:12)': 'terah',
};
export function lineageCharacter(name: string, profile?: CharacterProfile): CharacterProfile | undefined {
  if(profile?.lineage_bindings){const link=profile.lineage_bindings.links.find(link=>link.label===name);return link?characters.find(row=>row.id===link.profile_id):undefined;}
  // Genesis 46:13 names Issachar’s son Job; do not identify him with Job of Uz.
  if (name === 'Job') return undefined;
  const baseName = name.replace(/ \((?:paternal )?half-(?:brother|sister)\)$/, '');
  return characters.find(person => person.name === baseName || person.id === aliases[name]);
}
const womenWithoutProfiles = new Set([
  'Jochebed', 'Zipporah', 'Elisheba',
  'Keturah', 'Milcah', 'Iscah', 'Wife (unnamed)', 'Sister (unnamed)', 'Asenath',
  'Shuah’s daughter (unnamed)', 'Judith (Genesis 26:34)', 'Bashemath (Genesis 26:34)', 'Mahalath (Genesis 28:9)',
  'Mother unnamed; different from Abraham’s',
  'Two daughters (unnamed; survived Sodom)',
  'Mahalath (Genesis 28:9); Basemath (Genesis 36:3)',
  'Serah',
]);
export function isFemaleLineage(name: string): boolean {
  return lineageCharacter(name)?.sex === 'female' || womenWithoutProfiles.has(name);
}

export function characterVerseRoute(reference: string): string | undefined {
  const match = /^(.*?) (\d+):(\d+)$/.exec(reference);
  const book = match && books.find(book => book.name === match[1]);
  return book && match ? `#read/${book.id}/${match[2]}/${match[3]}` : undefined;
}
