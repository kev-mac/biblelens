import type { CharacterProfile } from '../../types/character';
import profiles from '../../data/characters.json';
import { CharacterCard, element, LineageBadges, StoryAnchor } from './CharacterCard';

export const characters: CharacterProfile[] = profiles as CharacterProfile[];
export function filterCharacters(query: string, era: string = 'All eras'): CharacterProfile[] {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return characters.filter(profile => (era === 'All eras' || profile.era === era)
    && terms.every(term => JSON.stringify(profile).toLocaleLowerCase().includes(term)));
}

function mountCharacters(): void {
  const host = document.getElementById('characters-view');
  if (!host) return;
  let era = 'All eras';
  let opener: HTMLElement | null = null;
  const heading = element('div', 'page-heading');
  heading.append(element('p', 'eyebrow', 'PEOPLE & CONNECTIONS'), element('h1', '', 'Characters'),
    element('p', '', 'Follow the families, places, and stories of scripture.'));
  const note = element('p', 'characters-note', 'Batch 1 · Primeval & Patriarchs. Named family links follow Genesis; unspecified details are left open. Tribe labels identify later family associations.');
  const label = element('label', 'sr-only', 'Search characters, family, places, or passages');
  label.htmlFor = 'characters-search';
  const search = element('input');
  search.id = 'characters-search'; search.type = 'search';
  search.placeholder = 'Search people, family, places, passages…';
  const filters = element('div', 'characters-filters');
  filters.setAttribute('role', 'group'); filters.setAttribute('aria-label', 'Filter by era');
  const count = element('p', 'characters-count'); count.setAttribute('role', 'status');
  const list = element('div', 'characters-grid'); list.id = 'characters-list';
  const reset = element('button', 'characters-reset', 'Reset filters'); reset.type = 'button';
  const results = element('div', 'characters-results'); results.append(count, reset);
  host.append(heading, note, label, search, filters, results, list);
  const eras = ['All eras', ...new Set(characters.map(profile => profile.era))];
  for (const name of eras) {
    const button = element('button', '', name); button.type = 'button'; button.dataset.era = name;
    button.setAttribute('aria-controls', list.id);
    button.addEventListener('click', () => { era = name; render(); }); filters.append(button);
  }
  function render(): void {
    const matches = filterCharacters(search.value, era);
    list.replaceChildren(...matches.map(CharacterCard));
    count.textContent = `${matches.length} of ${characters.length} characters`;
    reset.hidden = !search.value && era === 'All eras';
    for (const button of filters.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.era === era));
    if (!matches.length) list.append(element('p', 'characters-empty', 'No characters match these filters. Try another name, place, or era, or reset the filters.'));
  }
  search.addEventListener('input', render);
  reset.addEventListener('click', () => { search.value = ''; era = 'All eras'; render(); search.focus(); });
  render();

  const sheet = element('dialog', 'character-sheet'); sheet.id = 'character-sheet';
  sheet.setAttribute('aria-labelledby', 'character-detail-name');
  const header = element('div', 'character-sheet-header');
  header.append(element('span', 'eyebrow', 'CHARACTER PROFILE'));
  const close = element('button', '', '✕'); close.type = 'button'; close.autofocus = true;
  close.setAttribute('aria-label', 'Close character details'); header.append(close);
  const body = element('div', 'character-sheet-body');
  sheet.append(header, body); document.body.append(sheet);
  close.addEventListener('click', () => sheet.close());
  sheet.addEventListener('click', event => {
    if (event.target !== sheet) return;
    const rect = sheet.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) sheet.close();
  });
  sheet.addEventListener('close', () => {
    document.body.classList.remove('character-sheet-open');
    if (location.hash.startsWith('#characters/')) history.replaceState(null, '', '#characters');
    if (opener?.isConnected && !host.hidden) opener.focus();
  });
  host.addEventListener('click', event => {
    const target = (event.target as HTMLElement).closest<HTMLAnchorElement>('a.character-name');
    if (target) opener = target;
  });
  function handleRoute(): void {
    const match = /^#characters\/([a-z0-9-]+)$/.exec(location.hash);
    if (!match) { if (sheet.open) sheet.close(); return; }
    const profile = characters.find(person => person.id === match[1]);
    body.replaceChildren();
    const title = element('h2', '', profile?.name || 'Character not found'); title.id = 'character-detail-name';
    body.append(title);
    if (!profile) body.append(element('p', '', 'This character is not included in Batch 1. Close this sheet to browse the directory.'));
    else {
      body.append(element('span', 'character-era', profile.era), element('p', '', profile.summary), LineageBadges(profile));
      body.append(element('h3', '', 'Places'), element('p', '', `Origin · ${profile.geography.origin}`));
      const residences = element('ul');
      for (const place of profile.geography.residence) residences.append(element('li', '', place));
      body.append(element('h4', '', 'Residences & sojourns'), residences,
        element('h3', '', 'Narrative anchors'), element('p', '', `Books · ${profile.narrative_anchors.books.join(', ')}`));
      const verses = element('div', 'character-verses');
      for (const verse of profile.narrative_anchors.key_verses) {
        const reference = /^Genesis (\d+):(\d+)$/.exec(verse);
        if (!reference) continue;
        const link = element('a', '', verse); link.href = `#read/0/${reference[1]}/${reference[2]}`; verses.append(link);
      }
      const stories = element('div', 'character-stories');
      for (const anchor of profile.narrative_anchors.linked_stories) stories.append(StoryAnchor(anchor));
      body.append(element('h4', '', 'Key verses'), verses, element('h4', '', 'Linked stories'), stories);
    }
    if (!sheet.open) { sheet.showModal(); document.body.classList.add('character-sheet-open'); }
    body.scrollTop = 0;
  }
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('viewchange', ((event: CustomEvent<string>) => { if (event.detail !== 'characters' && sheet.open) sheet.close(); }) as EventListener);
  handleRoute();
}
if (typeof document !== 'undefined') mountCharacters();
