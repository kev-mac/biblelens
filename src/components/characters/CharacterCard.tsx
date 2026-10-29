import {directorySaveButton} from '../../directory-save.js';
import {ProfileSections} from './ProfileSections';
export {profileSectionAvailability} from './ProfileSections';
import { lineageCharacter, isFemaleLineage, characterVerseRoute } from './directory';
import type { CharacterProfile, LinkedStoryAnchor } from '../../types/character';

// Typed DOM components fit the existing reader without adding a second UI runtime.
export function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function StoryAnchor(anchor: LinkedStoryAnchor): HTMLAnchorElement {
  const link = element('a', 'character-story-chip');
  link.href = anchor.route;
  link.dataset.characterStory = anchor.story_id;
  link.append(element('span', '', anchor.title), element('small', '', anchor.passage));
  return link;
}

export function LineageBadges(profile: CharacterProfile): HTMLElement {
  const group = element('dl', 'character-lineage');
  for (const [label, names] of [
    ['Parents', profile.lineage?.parents],
    [profile.lineage?.spouses?.length === 1 ? 'Spouse' : 'Spouses', profile.lineage?.spouses],
    ['Children', profile.lineage?.children],
    ['Siblings', profile.lineage?.siblings],
    ['Tribe', profile.lineage?.tribe ? [profile.lineage.tribe] : undefined],
  ] as const) {
    if (!names?.length) continue;
    const row = element('div');
    const values = element('dd');
    for (const name of names) {
      const relative = label === 'Tribe' ? undefined : lineageCharacter(name, profile);
      const badge = element(relative ? 'a' : 'span', `character-badge ${isFemaleLineage(name) ? 'character-female' : 'character-neutral'}`, name);
      if (relative) {
        badge.setAttribute('href', `#characters/card/${relative.id}`);
        badge.setAttribute('aria-label', `Go to ${relative.name}’s card`);
      }
      values.append(badge);
    }
    row.append(element('dt', '', label), values);
    group.append(row);
  }
  return group;
}

export function CharacterNameCard(profile: CharacterProfile): HTMLElement {
  const card=element('article',`character-card ${profile.sex==='female'?'character-female':'character-neutral'}`);
  card.id=`character-card-${profile.id}`;card.tabIndex=-1;
  const heading=element('h2','character-name',profile.name + (profile.identity_context ? ' (' + profile.identity_context + ')' : ''));
  const header=element('div','character-card-header');header.append(heading);
  const open=element('a','ux-person-open','→');open.href='#characters/'+encodeURIComponent(profile.id);open.setAttribute('aria-label','Open '+profile.name);header.append(open);
  header.append(directorySaveButton('person', profile.id, profile.name));
  if(profile.aliases?.length)header.append(element('p','character-aliases',profile.aliases.join(' · ')));
  card.append(header);
  return card;
}

export function CharacterCard(profile: CharacterProfile): HTMLElement {
  const card = CharacterNameCard(profile);
  card.append(element('p','character-summary',profile.summary||'A written biography is not yet available for this person.'),ProfileSections(profile));
  const references = element('div', 'directory-references');
  const passages = profile.narrative_anchors?.key_verses || [];
  for (const passage of passages.slice(0, 2)) {
    const route = characterVerseRoute(passage); if (!route) continue;
    const chip = element('a', 'directory-reference', passage); chip.href = route; references.append(chip);
  }
  if (passages.length > 2) references.append(element('span', 'directory-more', '+' + (passages.length - 2) + ' more'));
  card.append(references);
  return card;
}
