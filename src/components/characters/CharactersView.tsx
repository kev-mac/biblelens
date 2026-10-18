import { fetchPeople, createPeopleSearch, characterPage, CHARACTER_PAGE_SIZE } from './people';
import type { DirectoryPerson } from './people';
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
  let people: DirectoryPerson[] = [];
  let findPeople = createPeopleSearch(people);
  let page = 0;
  let loading = true;
  let failed = false;
  let womenOnly = false;
  let profileRoute = '';
  let opener: HTMLElement | null = null;
  const heading = element('div', 'page-heading');
  heading.append(element('p', 'eyebrow', 'PEOPLE & CONNECTIONS'), element('h1', '', 'Characters'),
    element('p', '', 'Find people by name and follow their scripture passages.'));
  const note = element('p', 'characters-note', 'Adapted from Theographic Bible Metadata. Names and passage references come from the reference directory; biographical summaries may be unavailable.');
  const label = element('label', 'sr-only', 'Search characters by name or alias');
  label.htmlFor = 'characters-search';
  const search = element('input');
  search.id = 'characters-search'; search.type = 'search';
  search.placeholder = 'Search names or aliases…';
  const filters = element('div', 'characters-filters');
  filters.setAttribute('role', 'group'); filters.setAttribute('aria-label', 'Filter characters');
  const count = element('p', 'characters-count'); count.setAttribute('role', 'status');
  const list = element('div', 'characters-grid'); list.id = 'characters-list';
  const reset = element('button', 'characters-reset', 'Reset filters'); reset.type = 'button';
  const results = element('div', 'characters-results'); results.append(count, reset);
  const searchBox = element('div', 'characters-search-box');
  searchBox.append(label, search);
  host.append(heading, note, searchBox, filters, results, list);
  const women = element('button', 'characters-women character-female', 'Women'); women.type = 'button';
  women.setAttribute('aria-controls', list.id);
  women.addEventListener('click', () => { womenOnly = !womenOnly; page = 0; render(); }); filters.append(women);
  const pagination = element('div', 'characters-pagination');
  const previous = element('button', '', 'Previous'); previous.type = 'button';
  const next = element('button', '', 'Next'); next.type = 'button';
  const retry = element('button', '', 'Retry loading characters'); retry.type = 'button';
  previous.setAttribute('aria-controls', list.id); next.setAttribute('aria-controls', list.id);
  pagination.append(previous, next); host.append(pagination, retry);
  list.tabIndex = -1;
  function render(): void {
    const matches = findPeople(search.value, womenOnly);
    page = Math.min(page, Math.max(0, Math.ceil(matches.length / CHARACTER_PAGE_SIZE) - 1));
    list.replaceChildren(...characterPage(matches, page).map(CharacterCard));
    count.textContent = loading ? 'Loading characters…' : failed ? 'Characters could not be loaded. Please retry.'
      : `${matches.length ? page * CHARACTER_PAGE_SIZE + 1 : 0}–${Math.min((page + 1) * CHARACTER_PAGE_SIZE, matches.length)} of ${matches.length} characters`;
    list.setAttribute('aria-busy', String(loading));
    reset.hidden = !search.value && !womenOnly;
    women.setAttribute('aria-pressed', String(womenOnly));
    previous.disabled = page === 0; next.disabled = (page + 1) * CHARACTER_PAGE_SIZE >= matches.length;
    pagination.hidden = loading || failed || matches.length <= CHARACTER_PAGE_SIZE;
    retry.hidden = !failed;
    if (!loading && !failed && !matches.length) list.append(element('p', 'characters-empty', 'No characters match. Try another name or alias, or reset the filters.'));
  }
  let searchTimer: ReturnType<typeof setTimeout>;
  search.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { page = 0; render(); }, 100); });
  reset.addEventListener('click', () => { clearTimeout(searchTimer); search.value = ''; womenOnly = false; page = 0; render(); search.focus(); });
  function movePage(offset: number): void {
    clearTimeout(searchTimer); page += offset; render(); list.focus({preventScroll:true}); list.scrollIntoView({block:'start'});
  }
  previous.addEventListener('click', () => movePage(-1)); next.addEventListener('click', () => movePage(1));
  async function load(): Promise<void> {
    loading = true; failed = false; render();
    try { people = await fetchPeople(); findPeople = createPeopleSearch(people); }
    catch { failed = true; }
    loading = false; render(); handleRoute();
  }
  retry.addEventListener('click', () => { void load(); });
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
    const target = (event.target as HTMLElement).closest<HTMLAnchorElement>('a.character-name,a.character-more-passages');
    if (target) opener = target;
  });
  function repeatFamilyNavigation(event: MouseEvent): void {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a.character-badge[href]');
    if (link && link.hash === location.hash) { event.preventDefault(); handleRoute(); }
  }
  host.addEventListener('click', repeatFamilyNavigation);
  sheet.addEventListener('click', repeatFamilyNavigation);
  function handleRoute(): void {
    const cardRoute = /^#characters\/card\/([a-zA-Z0-9_-]+)$/.exec(location.hash);
    if (cardRoute) {
      if (sheet.open) sheet.close();
      const target = people.find(person => person.id === cardRoute[1]) || characters.find(person => person.id === cardRoute[1]);
      if (target) {
        search.value = ''; womenOnly = false;
        page = Math.max(0, Math.floor(people.indexOf(target as DirectoryPerson) / CHARACTER_PAGE_SIZE)); render();
        if (!people.includes(target as DirectoryPerson)) {
          list.replaceChildren(CharacterCard(target));
          count.textContent = `${target.name} · Curated profile`; pagination.hidden = true;
        }
        const card = document.getElementById(`character-card-${target.id}`);
        card?.querySelector<HTMLButtonElement>('.character-summary-toggle[aria-expanded="false"]')?.click();
        card?.focus({preventScroll:true}); card?.scrollIntoView({behavior:'smooth', block:'start'});
      }
      return;
    }
    const match = /^#characters\/([a-zA-Z0-9_-]+)$/.exec(location.hash);
    if (!match) { if (sheet.open) sheet.close(); return; }
    profileRoute = location.hash;
    const profile = people.find(person => person.id === match[1]) || characters.find(person => person.id === match[1]);
    sheet.classList.toggle('character-female', profile?.sex === 'female');
    sheet.classList.toggle('character-neutral', profile?.sex !== 'female');
    body.replaceChildren();
    const title = element('h2', '', profile?.name || (loading ? 'Loading character…' : 'Character not found')); title.id = 'character-detail-name';
    body.append(title);
    if (!profile) body.append(element('p', '', loading ? 'Loading the reference directory…' : 'This character could not be found. Close this sheet to browse or retry loading the directory.'));
    else {
      if (profile.aliases?.length) body.append(element('p', 'character-aliases', profile.aliases.join(' · ')));
      if (!('key_passages' in profile)) body.append(element('span', 'character-era', profile.era));
      if (profile.summary) body.append(element('p', '', profile.summary));
      if (profile.lineage) body.append(LineageBadges(profile));
      if (profile.geography.origin) body.append(element('h3', '', 'Places'), element('p', '', `Origin · ${profile.geography.origin}`));
      const residences = element('ul');
      for (const place of profile.geography.residence) residences.append(element('li', '', place));
      if (profile.geography.residence.length) body.append(element('h4', '', 'Residences & sojourns'), residences);
      body.append(element('h3', '', 'Scripture anchors'));
      if (profile.narrative_anchors.books.length) body.append(element('p', '', `Books · ${profile.narrative_anchors.books.join(', ')}`));
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
  void load();
}
if (typeof document !== 'undefined') mountCharacters();
