import referenceIds from '../../data/character-reference-ids.json';
import books from '../../../data/books.json';
import {characters} from './directory';
import {element} from './CharacterCard';
import type {CharacterProfile} from '../../types/character';

export interface ReferencePerson {
  id: string;
  name: string;
  gender: string;
  status?: string;
  ambiguous?: boolean;
  sourceRecord: string;
  refs: number[][];
}
export type Connections = Record<'parents' | 'spouses' | 'siblings' | 'children', ReferencePerson[]>;
const ids: Record<string, string> = referenceIds;
const profileIds = new Map(Object.entries(ids).map(([profile, reference]) => [reference, profile]));
export const referenceId = (id: string): string => ids[id] || id;
export const connectionProfileId = (id: string): string => profileIds.get(id) || id;

// Every known relative can open a profile, even without a curated biography.
export function connectionProfile(person: ReferencePerson): CharacterProfile {
  const written = characters.find(profile => profile.id === connectionProfileId(person.id));
  if (written) return written;
  const references = person.refs.filter(([book, chapter, verse]) => books[book] && chapter > 0 && verse > 0);
  return {
    id: person.id, name: person.name,
    sex: person.gender === 'Female' ? 'female' : person.gender === 'Male' ? 'male' : 'unspecified',
    era: 'Across scripture',
    summary: `Reference profile from Theographic Bible Metadata${person.status === 'wip' ? ' (work in progress)' : ''}. A written biography is not yet available. Family links are dataset assertions; passage tags provide context rather than proof of each relationship.`,
    geography: {origin: 'Not recorded in this reference profile', residence: []},
    narrative_anchors: {
      books: [...new Set(references.map(([book]) => books[book].name))],
      key_verses: references.map(([book, chapter, verse]) => `${books[book].name} ${chapter}:${verse}`),
      linked_stories: [],
    },
  };
}

export function FamilyConnections(connections: Connections, prefix = 'character'): HTMLElement {
  const section = element('section', 'character-connections');
  section.setAttribute('aria-labelledby', `${prefix}-family-heading`);
  const heading = element('h3', '', 'Family & Connections'); heading.id = `${prefix}-family-heading`;
  section.append(heading);
  let count = 0;
  for (const [category, label] of [['parents', 'Parents'], ['spouses', 'Spouses'], ['siblings', 'Siblings'], ['children', 'Children']] as const) {
    const relatives = connections[category];
    if (!relatives.length) continue;
    count += relatives.length;
    const row = element('div', 'character-connection-row');
    const labelNode = element('h4', '', `${label}:`); labelNode.id = `${prefix}-${category}-label`;
    const chips = element('div', 'character-relative-chips');
    chips.setAttribute('role', 'group'); chips.setAttribute('aria-labelledby', labelNode.id);
    for (const relative of relatives) {
      const chip = element('button', `character-relative-chip${relative.gender === 'Female' ? ' character-relative-female' : ''}`); chip.type = 'button';
      chip.dataset.relativeId = connectionProfileId(relative.id);
      const [book, chapter, verse] = relative.refs[0] || [];
      const context = books[book] ? `${books[book].name} ${chapter}:${verse}` : '';
      const identity = relative.ambiguous && context ? ` (${context})` : '';
      chip.setAttribute('aria-label', `Open ${relative.name}${identity}’s profile`);
      chip.title = `${relative.name}${identity}`;
      // Decorative silhouette is fixed SVG; all dataset strings use textContent.
      const icon = element('span', 'character-person-icon'); icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>';
      chip.append(icon, element('span', '', relative.name));
      if (relative.ambiguous && context) chip.append(element('small', '', context));
      chips.append(chip);
    }
    row.append(labelNode, chips); section.append(row);
  }
  if (!count) section.append(element('p', 'characters-note', 'No family connections are recorded for this person in the included data.'));
  const attribution = element('p', 'characters-note');
  attribution.append(document.createTextNode('Family data adapted from '));
  const source = element('a', '', 'Theographic Bible Metadata · CC BY-SA 4.0');
  source.href = 'reference/README.md'; source.target = '_blank'; source.rel = 'noopener';
  attribution.append(source, document.createTextNode('. Siblings include half-siblings. Spouse links come from the existing cited profiles. Coverage is incomplete; genealogy links do not distinguish biological and legal parentage.'));
  const sourceToggle=element('button','character-source-toggle','Source');sourceToggle.type='button';
  const popover=element('div','character-source-popover');popover.id=`${prefix}-family-source`;
  popover.setAttribute('popover','auto');popover.setAttribute('role','dialog');popover.setAttribute('aria-labelledby',`${prefix}-family-source-title`);
  sourceToggle.setAttribute('popovertarget',popover.id);
  const popoverHeader=element('div','character-source-header');
  const sourceTitle=element('h3','','Family Data Source');sourceTitle.id=`${prefix}-family-source-title`;
  const close=element('button','','×');close.type='button';close.autofocus=true;
  close.setAttribute('aria-label','Close family source');close.setAttribute('popovertarget',popover.id);close.setAttribute('popovertargetaction','hide');
  popoverHeader.append(sourceTitle,close);
  const license=element('a','character-source-license','Read the CC BY-SA 4.0 license');
  license.href='reference/THEOGRAPHIC-LICENSE.txt';license.target='_blank';license.rel='noopener';
  popover.append(popoverHeader,attribution,license);section.append(sourceToggle,popover);
  return section;
}
