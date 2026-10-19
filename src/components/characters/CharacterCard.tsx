import {mountInlineProfile} from './InlineProfile';
import { lineageCharacter, isFemaleLineage, characterVerseRoute } from './directory';
import type { DirectoryPerson } from './people';
import type { CharacterProfile, LinkedStoryAnchor } from '../../types/character';

// Typed DOM components fit the existing reader without adding a second UI runtime.
export function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// A fresh native disclosure resets every full profile opening, including reader links.
export function ProfileDisclosure(): {details: HTMLDetailsElement; content: HTMLDivElement} {
  const details = element('details', 'character-profile-disclosure'); details.open = false;
  const summary = element('summary', 'character-profile-expand', 'Details');
  const content = element('div', 'character-profile-content');
  details.append(summary, content);
  return {details, content};
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
  if ('key_passages' in profile) {
    const person = profile as DirectoryPerson;
    const header = element('div', 'character-card-header');
    header.append(heading);
    if (person.aliases?.length) header.append(element('p', 'character-aliases', person.aliases.join(' · ')));
    card.append(header);
    card.append(element('p','character-summary',person.summary || 'A written biography is not yet available for this person. Open details for the recorded passages and family links.'));
    const details = element('div', 'character-inline-profile'); details.id = `character-inline-${person.id}`; details.hidden = true;
    const expand=element('button','character-detail-toggle'); expand.type='button'; expand.setAttribute('aria-controls', details.id); expand.setAttribute('aria-expanded', 'false'); expand.setAttribute('aria-label',`Expand ${person.name} profile`);
    let mounted = false;
    expand.addEventListener('click', () => {
      details.hidden = !details.hidden; expand.setAttribute('aria-expanded', String(!details.hidden));
      expand.setAttribute('aria-label', `${details.hidden ? 'Expand' : 'Collapse'} ${person.name} profile`);
      if (!details.hidden && !mounted) { mounted = true; mountInlineProfile(details, person.id); }
    });
    const arrow=element('span');arrow.setAttribute('aria-hidden','true');arrow.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>';expand.append(element('span','','Details'),arrow);
    const passages = element('div', 'character-passages');
    passages.setAttribute('aria-label', `Key passages for ${person.name}`);
    for (const reference of person.key_passages.slice(0, 3)) {
      const route = characterVerseRoute(reference);
      if (!route) continue;
      const chip = element('button', 'character-passage', reference); chip.type = 'button';
      chip.setAttribute('aria-label', `Read ${reference}`);
      // Reuse the app's delegated citation handler, which calls loadChapter.
      chip.dataset.cite = route.slice('#read/'.length);
      passages.append(chip);
    }
    card.append(passages);
    card.append(expand, details);return card;
  }
  const details = element('div', 'character-card-details');
  const summary = element('p', 'character-summary', profile.summary);
  details.id = `character-details-${profile.id}`; details.hidden = true;
  const toggle = element('button', 'character-summary-toggle'); toggle.type = 'button';
  toggle.setAttribute('aria-controls', details.id); toggle.setAttribute('aria-expanded', 'false');
  const chevron = element('span', 'character-summary-chevron', '⌄'); chevron.setAttribute('aria-hidden', 'true');
  toggle.append(element('span', '', 'Details'), chevron);
  function toggleSummary(): void {
    details.hidden = !details.hidden;
    toggle.setAttribute('aria-expanded', String(!details.hidden));
    toggle.setAttribute('aria-label', `${details.hidden ? 'Expand' : 'Collapse'} ${profile.name} details`);
  }
  toggle.setAttribute('aria-label', `Expand ${profile.name} details`);
  toggle.addEventListener('click', toggleSummary);
  card.addEventListener('dblclick', event => {
    if (!(event.target as HTMLElement).closest('a,button,input,select,textarea')) { event.preventDefault(); toggleSummary(); }
  });
  card.append(element('span', 'character-era', profile.era), heading, summary, toggle, details);
  details.append(LineageBadges(profile));
  details.append(element('p', 'character-origin', `Origin · ${profile.geography.origin}`));
  details.append(element('p', 'character-books', `In ${profile.narrative_anchors.books.join(', ')}`));
  const stories = element('div', 'character-stories');
  stories.setAttribute('aria-label', `Stories featuring ${profile.name}`);
  for (const anchor of profile.narrative_anchors.linked_stories) stories.append(StoryAnchor(anchor));
  if (profile.narrative_anchors.linked_stories.length) details.append(stories);
  else {
    const verses = element('div', 'character-verses');
    for (const reference of profile.narrative_anchors.key_verses.slice(0, 3)) {
      const route = characterVerseRoute(reference); if (!route) continue;
      const link = element('a', 'character-story-chip', reference); link.href = route; verses.append(link);
    }
    details.append(verses);
  }
  return card;
}
