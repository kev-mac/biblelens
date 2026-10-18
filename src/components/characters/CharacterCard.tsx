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
  link.append(element('span', '', anchor.title), element('small', '', `${anchor.passage} →`));
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
      const relative = label === 'Tribe' ? undefined : lineageCharacter(name);
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

export function CharacterCard(profile: CharacterProfile): HTMLElement {
  const card = element('article', `character-card ${profile.sex === 'female' ? 'character-female' : 'character-neutral'}`);
  card.id = `character-card-${profile.id}`; card.tabIndex = -1;
  const heading = element('h2');
  const open = element('a', 'character-name', profile.name);
  open.href = `#characters/${profile.id}`;
  open.setAttribute('aria-haspopup', 'dialog');
  heading.append(open);
  card.append(element('span', 'character-era', profile.era), heading,
    element('p', 'character-summary', profile.summary), LineageBadges(profile));
  card.append(element('p', 'character-origin', `Origin · ${profile.geography.origin}`));
  card.append(element('p', 'character-books', `In ${profile.narrative_anchors.books.join(', ')}`));
  const stories = element('div', 'character-stories');
  stories.setAttribute('aria-label', `Stories featuring ${profile.name}`);
  for (const anchor of profile.narrative_anchors.linked_stories) stories.append(StoryAnchor(anchor));
  if (profile.narrative_anchors.linked_stories.length) card.append(stories);
  else {
    const verses = element('div', 'character-verses');
    for (const reference of profile.narrative_anchors.key_verses.slice(0, 3)) {
      const route = characterVerseRoute(reference); if (!route) continue;
      const link = element('a', 'character-story-chip', reference); link.href = route; verses.append(link);
    }
    card.append(verses);
  }
  return card;
}
