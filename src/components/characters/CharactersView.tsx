import type { CharacterProfile } from '../../types/character';
import { characters, characterVerseRoute } from './directory';
export { characters } from './directory';
import { CharacterCard, element, LineageBadges, StoryAnchor } from './CharacterCard';

export function filterCharacters(query: string, era: string = 'All Eras', womenOnly = false): CharacterProfile[] {
  const normalized = query.trim().toLocaleLowerCase();
  const terms = normalized.split(/\s+/).filter(Boolean);
  const rank = (profile: CharacterProfile): number => {
    const names = [profile.name, ...(profile.aliases || [])].map(name => name.toLocaleLowerCase());
    return !normalized ? 0 : names.includes(normalized) ? 2 : names.some(name => name.startsWith(normalized)) ? 1 : 0;
  };
  return characters.filter(profile => ((era === 'All Eras' || era === 'All eras') || profile.era === era)
    && (!womenOnly || profile.sex === 'female')
    && terms.every(term => JSON.stringify(profile).toLocaleLowerCase().includes(term)))
    .sort((a, b) => rank(b) - rank(a));
}

function mountCharacters(): void {
  const host = document.getElementById('characters-view');
  if (!host) return;
  let era = 'All Eras';
  let womenOnly = false;
  let profileRoute = '';
  let opener: HTMLElement | null = null;
  const heading = element('div', 'page-heading');
  heading.append(element('p', 'eyebrow', 'PEOPLE & CONNECTIONS'), element('h1', '', 'Characters'),
    element('p', '', 'Follow the families, places, and stories of scripture.'));
  const note = element('p', 'characters-note', 'Growing directory · Profiles across the Old and New Testaments; coverage is not yet complete. Family links follow the cited passages; missing relationships are left open. Tribe labels identify family associations.');
  const label = element('label', 'sr-only', 'Search characters, family, places, or passages');
  label.htmlFor = 'characters-search';
  const search = element('input');
  search.id = 'characters-search'; search.type = 'search';
  search.placeholder = 'Search people, family, places, passages…';
  const filters = element('div', 'characters-filters');
  filters.setAttribute('role', 'group'); filters.setAttribute('aria-label', 'Filter characters');
  const count = element('p', 'characters-count'); count.setAttribute('role', 'status');
  const list = element('div', 'characters-grid'); list.id = 'characters-list';
  const reset = element('button', 'characters-reset', 'Reset filters'); reset.type = 'button';
  const results = element('div', 'characters-results'); results.append(count, reset);
  const searchBox = element('div', 'characters-search-box');
  searchBox.append(label, search);
  host.append(heading, note, searchBox, filters, results, list);
  const eraOrder = ['Primeval','Patriarchal','Exodus','Conquest','Judges','Monarchy','Wisdom','Prophets','Gospels','Apostolic','Across scripture'];
  const eras = ['All Eras', ...eraOrder.filter(era => characters.some(profile => profile.era === era))];
  for (const name of eras) {
    const button = element('button', '', name); button.type = 'button'; button.dataset.era = name;
    button.setAttribute('aria-controls', list.id);
    button.addEventListener('click', () => { era = name; render(); }); filters.append(button);
  }
  const women = element('button', 'characters-women character-female', 'Women'); women.type = 'button';
  women.setAttribute('aria-controls', list.id);
  women.addEventListener('click', () => { womenOnly = !womenOnly; render(); }); filters.append(women);
  function render(): void {
    const matches = filterCharacters(search.value, era, womenOnly);
    list.replaceChildren(...matches.map(CharacterCard));
    count.textContent = `${matches.length} of ${characters.length} characters`;
    reset.hidden = !search.value && era === 'All Eras' && !womenOnly;
    women.setAttribute('aria-pressed', String(womenOnly));
    for (const button of filters.querySelectorAll('[data-era]')) button.setAttribute('aria-pressed', String(button.dataset.era === era));
    if (!matches.length) list.append(element('p', 'characters-empty', 'No characters match these filters. Try another name, place, or era, or reset the filters. This directory is still growing; a missing name may not have a profile yet.'));
  }
  search.addEventListener('input', render);
  reset.addEventListener('click', () => { search.value = ''; era = 'All Eras'; womenOnly = false; render(); search.focus(); });
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
    if (location.hash === profileRoute) history.replaceState(null, '', '#characters');
    if (location.hash === '#characters' && opener?.isConnected && !host.hidden) opener.focus();
  });
  host.addEventListener('click', event => {
    const target = (event.target as HTMLElement).closest<HTMLAnchorElement>('a.character-name');
    if (target) opener = target;
  });
  function repeatFamilyNavigation(event: MouseEvent): void {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a.character-badge[href]');
    if (link && link.hash === location.hash) { event.preventDefault(); handleRoute(); }
  }
  host.addEventListener('click', repeatFamilyNavigation);
  sheet.addEventListener('click', repeatFamilyNavigation);
  function handleRoute(): void {
    const cardRoute = /^#characters\/card\/([a-z0-9-]+)$/.exec(location.hash);
    if (cardRoute) {
      if (sheet.open) sheet.close();
      const target = characters.find(person => person.id === cardRoute[1]);
      if (target) {
        search.value = ''; era = 'All Eras'; womenOnly = false; render();
        const card = document.getElementById(`character-card-${target.id}`);
        card?.querySelector<HTMLButtonElement>('.character-summary-toggle[aria-expanded="false"]')?.click();
        card?.focus({preventScroll:true}); card?.scrollIntoView({behavior:'smooth', block:'start'});
      }
      return;
    }
    const match = /^#characters\/([a-z0-9-]+)$/.exec(location.hash);
    if (!match) { if (sheet.open) sheet.close(); return; }
    profileRoute = location.hash;
    const profile = characters.find(person => person.id === match[1]);
    sheet.classList.toggle('character-female', profile?.sex === 'female');
    sheet.classList.toggle('character-neutral', profile?.sex !== 'female');
    body.replaceChildren();
    const title = element('h2', '', profile?.name || 'Character not found'); title.id = 'character-detail-name';
    body.append(title);
    if (!profile) body.append(element('p', '', 'This character does not have a profile in this growing directory. Close this sheet to browse the available characters.'));
    else {
      body.append(element('span', 'character-era', profile.era), element('p', '', profile.summary), LineageBadges(profile));
      body.append(element('h3', '', 'Places'), element('p', '', `Origin · ${profile.geography.origin}`));
      const residences = element('ul');
      for (const place of profile.geography.residence) residences.append(element('li', '', place));
      body.append(element('h4', '', 'Residences & sojourns'), residences,
        element('h3', '', 'Scripture anchors'), element('p', '', `Books · ${profile.narrative_anchors.books.join(', ')}`));
      const verses = element('div', 'character-verses');
      for (const verse of profile.narrative_anchors.key_verses) {
        const route = characterVerseRoute(verse);
        if (!route) continue;
        const link = element('a', '', verse); link.href = route; verses.append(link);
      }
      const stories = element('div', 'character-stories');
      for (const anchor of profile.narrative_anchors.linked_stories) stories.append(StoryAnchor(anchor));
      body.append(element('h4', '', 'Key verses'), verses);
      if (profile.narrative_anchors.linked_stories.length) body.append(element('h4', '', 'Linked stories'), stories);
    }
    if (!sheet.open) { sheet.showModal(); document.body.classList.add('character-sheet-open'); }
    body.scrollTop = 0;
  }
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('viewchange', ((event: CustomEvent<string>) => { if (event.detail !== 'characters' && sheet.open) sheet.close(); }) as EventListener);
  handleRoute();
}
if (typeof document !== 'undefined') mountCharacters();
