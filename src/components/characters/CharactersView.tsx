import { fetchPeople, createPeopleSearch, characterPage, CHARACTER_PAGE_SIZE } from './people';
import type { DirectoryPerson } from './people';
import type { CharacterProfile } from '../../types/character';
import { characters, characterVerseRoute } from './directory';
export { characters } from './directory';
import { CharacterCard, element, StoryAnchor } from './CharacterCard';
import {loadCharacterGraph} from '../../character-connections.js';
import {FamilyConnections, connectionProfile, referenceId} from './Connections';

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
  let example: DirectoryPerson | undefined;
  let profileRoute = '';
  let inlinePerson='';
  let opener: HTMLElement | null = null;
  let activeTab: 'overview' | 'connections' = 'overview';
  let currentId = '';
  let routeVersion = 0;
  const familyHistory: {id: string; tab: typeof activeTab}[] = [];
  const heading = element('div', 'page-heading');
  heading.append(element('h1', '', 'People'),
    element('p', '', 'Find people by name and follow their scripture passages.'));
  const label = element('label', 'sr-only', 'Search people by name or alias');
  label.htmlFor = 'characters-search';
  const search = element('input');
  search.id = 'characters-search'; search.type = 'search';
  search.placeholder = 'Search names or aliases…';
  const count = element('p', 'characters-count'); count.setAttribute('role', 'status');
  const list = element('div', 'characters-grid'); list.id = 'characters-list';
  const reset = element('button', 'characters-reset', 'Clear search'); reset.type = 'button';
  const results = element('div', 'characters-results'); results.append(count, reset);
  const searchBox = element('div', 'characters-search-box');
  searchBox.append(label, search);
  host.append(heading, searchBox, results, list);
  const pagination = element('div', 'characters-pagination');
  const previous = element('button', '', 'Previous'); previous.type = 'button';
  const next = element('button', '', 'Next'); next.type = 'button';
  const retry = element('button', '', 'Retry loading characters'); retry.type = 'button';
  previous.setAttribute('aria-controls', list.id); next.setAttribute('aria-controls', list.id);
  pagination.append(previous, next); host.append(pagination, retry);
  list.tabIndex = -1;
  function render(): void {
    const filtered = !!search.value.trim();
    const matches = !filtered && example ? [example] : findPeople(search.value);
    search.placeholder = example ? `Ex. ${example.name}` : 'Search names or aliases…';
    results.hidden = !loading && !failed && !filtered;
    page = Math.min(page, Math.max(0, Math.ceil(matches.length / CHARACTER_PAGE_SIZE) - 1));
    list.replaceChildren(...characterPage(matches, page).map(CharacterCard));
    count.textContent = loading ? 'Loading people…' : failed ? 'People could not be loaded. Please retry.'
      : `${matches.length ? page * CHARACTER_PAGE_SIZE + 1 : 0}–${Math.min((page + 1) * CHARACTER_PAGE_SIZE, matches.length)} of ${matches.length} people`;
    list.setAttribute('aria-busy', String(loading));
    reset.hidden = !filtered;
    previous.disabled = page === 0; next.disabled = (page + 1) * CHARACTER_PAGE_SIZE >= matches.length;
    pagination.hidden = loading || failed || matches.length <= CHARACTER_PAGE_SIZE;
    retry.hidden = !failed;
    if (!loading && !failed && !matches.length) list.append(element('p', 'characters-empty', 'No people match. Try another name or alias.'));
  }
  let searchTimer: ReturnType<typeof setTimeout>;
  search.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { page = 0; render(); }, 100); });
  reset.addEventListener('click', () => { clearTimeout(searchTimer); search.value = ''; page = 0; render(); search.focus(); });
  function movePage(offset: number): void {
    clearTimeout(searchTimer); page += offset; render(); list.focus({preventScroll:true}); list.scrollIntoView({block:'start'});
  }
  previous.addEventListener('click', () => movePage(-1)); next.addEventListener('click', () => movePage(1));
  async function load(): Promise<void> {
    loading = true; failed = false; render();
    try { people = await fetchPeople(); findPeople = createPeopleSearch(people);const examples=people.filter(person=>!!person.summary);example=examples[Math.floor(Math.random()*examples.length)]||people[0]; }
    catch { failed = true; }
    loading = false; render(); handleRoute();
  }
  retry.addEventListener('click', () => { void load(); });
  render();

  const sheet = element('dialog', 'character-sheet'); sheet.id = 'character-sheet';
  sheet.setAttribute('aria-labelledby', 'character-detail-name');
  const header = element('div', 'character-sheet-header');
  const back = element('button', 'character-family-back', '← Back'); back.type = 'button'; back.hidden = true;
  back.setAttribute('aria-label', 'Back to previous character');
  header.append(back, element('span', 'eyebrow', 'CHARACTER PROFILE'));
  back.addEventListener('click', () => {
    const previous = familyHistory.pop();
    if (!previous) return;
    activeTab = previous.tab;
    if(inlinePerson)inlinePerson=previous.id;else history.replaceState(null, '', `#characters/${previous.id}`);
    void handleRoute();
  });
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
    familyHistory.length = 0; currentId = ''; activeTab = 'overview'; routeVersion++;
    back.hidden = true;
    const wasInline=!!inlinePerson;inlinePerson='';
    if (!wasInline&&location.hash === profileRoute) history.replaceState(null, '', '#characters');
    if(wasInline&&opener?.isConnected)opener.focus({preventScroll:true});
    if (location.hash === '#characters' && opener?.isConnected && !host.hidden) opener.focus();
  });
  host.addEventListener('click', event => {
    const target = (event.target as HTMLElement).closest<HTMLAnchorElement>('a.character-name,a.character-more-passages,a.character-detail-toggle');
    if (target) opener = target;
  });
  function repeatFamilyNavigation(event: MouseEvent): void {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a.character-badge[href]');
    if (link && link.hash === location.hash) { event.preventDefault(); handleRoute(); }
  }
  host.addEventListener('click', repeatFamilyNavigation);
  sheet.addEventListener('click', repeatFamilyNavigation);
  sheet.addEventListener('click', event => {
    const chip = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-relative-id]');
    if (!chip || !currentId || chip.dataset.relativeId === currentId) return;
    familyHistory.push({id: currentId, tab: activeTab});
    if(inlinePerson)inlinePerson=chip.dataset.relativeId!;else history.replaceState(null, '', `#characters/${chip.dataset.relativeId}`);
    void handleRoute();
  });
  async function handleRoute(): Promise<void> {
    const version = ++routeVersion;
    const cardRoute = !inlinePerson && /^#characters\/card\/([a-zA-Z0-9_-]+)$/.exec(location.hash);
    if (cardRoute) {
      if (sheet.open) sheet.close();
      const target = people.find(person => person.id === cardRoute[1]) || characters.find(person => person.id === cardRoute[1]);
      if (target) {
        search.value = target.name;
        page = Math.max(0, Math.floor(people.indexOf(target as DirectoryPerson) / CHARACTER_PAGE_SIZE)); render();
        if (!people.includes(target as DirectoryPerson)) {
          list.replaceChildren(CharacterCard(target));
          count.textContent = `${target.name} · Curated profile`; pagination.hidden = true;
        }
        const card = document.getElementById(`character-card-${target.id}`);
        card?.querySelector<HTMLButtonElement>('.character-summary-toggle[aria-expanded="false"],.character-detail-toggle[aria-expanded="false"]')?.click();
        card?.focus({preventScroll:true}); card?.scrollIntoView({behavior:'smooth', block:'start'});
      }
      return;
    }
    const match = inlinePerson?['',inlinePerson]:/^#characters\/([a-zA-Z0-9_-]+)$/.exec(location.hash);
    if (!match) { if (sheet.open) sheet.close(); return; }
    profileRoute = location.hash;
    const wasOpen = sheet.open;
    currentId = match[1];
    back.hidden = !familyHistory.length;
    let profile = characters.find(person => person.id === currentId);
    const loadingTitle = element('h2', '', profile?.name || 'Character profile');
    loadingTitle.id = 'character-detail-name';
    body.replaceChildren(loadingTitle, element('p', '', 'Loading character connections…'));
    body.setAttribute('aria-busy', 'true');
    if (!sheet.open) { sheet.showModal(); document.body.classList.add('character-sheet-open'); }
    let graph: Awaited<ReturnType<typeof loadCharacterGraph>> | undefined;
    try {
      graph = await loadCharacterGraph();
      if (version !== routeVersion) return;
      const person = graph.getPerson(referenceId(currentId));
      if (!profile && person) profile = connectionProfile(person);
    } catch {
      if (version !== routeVersion) return;
    }
    body.removeAttribute('aria-busy');
    sheet.classList.toggle('character-female', profile?.sex === 'female');
    sheet.classList.toggle('character-neutral', profile?.sex !== 'female');
    body.replaceChildren();
    const title = element('h2', '', profile?.name || 'Character not found'); title.id = 'character-detail-name';
    title.tabIndex = -1;
    body.append(title);
    if (!profile) body.append(element('p', '', graph
      ? 'This character does not have a profile in this growing directory. Close this sheet to browse the available characters.'
      : 'The reference profile could not be loaded. Try again when the reference data is available.'));
    else {
      body.append(element('span', 'character-era', profile.era), element('p', '', profile.summary));
      const tabs = element('div', 'character-profile-tabs'); tabs.setAttribute('role', 'tablist');
      tabs.setAttribute('aria-label', 'Character profile sections');
      const overview = element('section'); overview.id = 'character-overview-panel';
      const connections = element('section'); connections.id = 'character-connections-panel';
      const panels = {overview, connections};
      const tabButtons = new Map<string, HTMLButtonElement>();
      function selectTab(name: typeof activeTab): void {
        activeTab = name;
        for (const key of ['overview', 'connections'] as const) {
          panels[key].hidden = key !== name;
          tabButtons.get(key)?.setAttribute('aria-selected', String(key === name));
          if (tabButtons.get(key)) tabButtons.get(key)!.tabIndex = key === name ? 0 : -1;
        }
      }
      for (const [name, label] of [['overview', 'Overview'], ['connections', 'Connections']] as const) {
        const button = element('button', '', label); button.type = 'button'; button.id = `character-${name}-tab`;
        button.setAttribute('role', 'tab'); button.setAttribute('aria-controls', panels[name].id);
        panels[name].setAttribute('role', 'tabpanel'); panels[name].setAttribute('aria-labelledby', button.id);
        button.addEventListener('click', () => selectTab(name));
        button.addEventListener('keydown', event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const target = event.key === 'Home' ? 'overview' : event.key === 'End' ? 'connections' : activeTab === 'overview' ? 'connections' : 'overview';
          selectTab(target); tabButtons.get(target)?.focus();
        });
        tabButtons.set(name, button); tabs.append(button);
      }
      body.append(tabs, overview, connections);
      selectTab(activeTab);
      overview.append(element('h3', '', 'Places'), element('p', '', `Origin · ${profile.geography.origin}`));
      if (profile.lineage?.tribe) overview.append(element('p', '', `Tribe · ${profile.lineage.tribe}`));
      const residences = element('ul');
      for (const place of profile.geography.residence) residences.append(element('li', '', place));
      overview.append(element('h4', '', 'Residences & sojourns'), residences,
        element('h3', '', 'Scripture anchors'), element('p', '', `Books · ${profile.narrative_anchors.books.join(', ')}`));
      const verses = element('div', 'character-verses');
      for (const verse of profile.narrative_anchors.key_verses) {
        const route = characterVerseRoute(verse);
        if (!route) continue;
        const link = element('a', '', verse); link.href = route; verses.append(link);
      }
      const stories = element('div', 'character-stories');
      for (const anchor of profile.narrative_anchors.linked_stories) stories.append(StoryAnchor(anchor));
      overview.append(element('h4', '', 'Key verses'), verses);
      connections.append(element('h3', '', 'Key passages'), verses.cloneNode(true));
      if (graph) connections.append(FamilyConnections(graph.getCharacterConnections(referenceId(profile.id))));
      else {
        const message = element('p', '', 'Family connections could not be loaded. Try again when the reference data is available.');
        const retry = element('button', 'character-connections-retry', 'Retry connections'); retry.type = 'button';
        retry.addEventListener('click', () => { activeTab = 'connections'; void handleRoute(); });
        connections.append(message, retry);
      }
      if (profile.narrative_anchors.linked_stories.length) overview.append(element('h4', '', 'Linked stories'), stories);
    }
    if (!profile && !graph) {
      const retry = element('button', 'character-connections-retry', 'Retry profile'); retry.type = 'button';
      retry.addEventListener('click', () => { void handleRoute(); }); body.append(retry);
    }
    body.scrollTop = 0;
    if (wasOpen) {
      title.focus({preventScroll: true});
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) body.animate([{opacity: .3, transform: 'translateY(6px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 160, easing: 'ease-out'});
    }
  }
  window.addEventListener('open-person',((event:CustomEvent<{id:string;opener:HTMLElement}>)=>{inlinePerson=event.detail.id;opener=event.detail.opener;familyHistory.length=0;activeTab='overview';void handleRoute();}) as EventListener);
  window.addEventListener('hashchange',()=>{inlinePerson='';void handleRoute();});
  window.addEventListener('viewchange', ((event: CustomEvent<string>) => { if (event.detail !== 'characters' && sheet.open) sheet.close(); }) as EventListener);
  void load();
}
if (typeof document !== 'undefined') mountCharacters();
