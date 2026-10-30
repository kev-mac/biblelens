import { fetchPeople, createPeopleSearch, characterPage, CHARACTER_PAGE_SIZE } from './people';
import type { DirectoryPerson } from './people';
import type { CharacterProfile } from '../../types/character';
import { characters, characterVerseRoute } from './directory';
export { characters } from './directory';
import { CharacterCard, CharacterNameCard, PersonContact, element } from './CharacterCard';
import {ProfileSections} from './ProfileSections';
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
  let category = 'All', letter = '';
  let loading = true;
  let failed = false;
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
  search.placeholder = `Search ${people.length.toLocaleString()} people, names, aliases…`;
  const count = element('p', 'characters-count'); count.setAttribute('role', 'status');
  const list = element('div', 'characters-grid'); list.id = 'characters-list';
  const searchBox = element('div', 'characters-search-box');
  const categories = element('div', 'directory-categories');
  categories.setAttribute('role', 'group'); categories.setAttribute('aria-label', 'People categories');
  const categoryRoles: Record<string,string[]> = {'Kings & Queens':['king','queen'],Judges:['judge'],Prophets:['prophet'],Priests:['priest'],Apostles:['apostle']};
  const inCategory = (person: DirectoryPerson, name: string): boolean => name === 'All' || (name === 'Women' ? person.sex === 'female' : person.roles.some(tag => categoryRoles[name]?.includes(tag.role)));
  function renderCategories(): void {
    const names = ['All','Women',...Object.keys(categoryRoles).filter(name => people.some(person => inCategory(person,name)))];
    if (categories.childElementCount !== names.length) {
      categories.replaceChildren(...names.map(name => {
        const button = element('button'); button.type = 'button'; button.dataset.category = name;
        button.addEventListener('click', () => { category = name; letter=''; page = 0; render(); });
        return button;
      }));
    }
    for (const button of categories.querySelectorAll('button')) {
      const name = button.dataset.category!;
      button.textContent = `${name} (${people.filter(person => inCategory(person,name)).length.toLocaleString()})`;
      button.setAttribute('aria-label', name);
      button.setAttribute('aria-pressed', String(name === category));
    }
  }
  const alphabet = element('div', 'ux-alphabet-grid');
  alphabet.setAttribute('role', 'group'); alphabet.setAttribute('aria-label', 'Jump to people by first letter');
  for (const name of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    const button = element('button', '', name); button.type = 'button';
    button.setAttribute('aria-label', 'Jump to ' + name);
    button.addEventListener('click', () => { alphabetJump=name;alphabetSheet.close(); });
    alphabet.append(button);
  }
  function jump(name:string):void {
    const candidates=findPeople(search.value).filter(person=>inCategory(person,category));
    const index=candidates.findIndex(person=>person.name.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').charAt(0).toUpperCase()===name);
    if(index<0)return;
    letter=name;page=Math.floor(index/CHARACTER_PAGE_SIZE);render();
    list.querySelector<HTMLElement>('[data-letter="'+name+'"]')?.focus({preventScroll:true});
    list.querySelector<HTMLElement>('[data-letter="'+name+'"]')?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  searchBox.classList.add('directory-filters');
  searchBox.append(label, search, categories);
  let alphabetJump:string|null=null;
  const alphabetSheet=element('dialog','ux-alphabet-sheet stories-filter-sheet');alphabetSheet.id='ux-alphabet-sheet';alphabetSheet.setAttribute('aria-labelledby','ux-alphabet-title');
  const alphabetTitle=element('h2','','People A–Z');alphabetTitle.id='ux-alphabet-title';
  const alphabetHelp=element('p','','Letters without matching names are disabled.');alphabetHelp.id='ux-alphabet-help';alphabet.setAttribute('aria-describedby',alphabetHelp.id);
  const alphabetClose=element('button','','×');alphabetClose.setAttribute('aria-label','Close People A–Z');alphabetClose.type='button';alphabetClose.onclick=()=>alphabetSheet.close();
  const alphabetHandle=element('div','sheet-handle');alphabetHandle.setAttribute('aria-hidden','true');const alphabetHeader=element('div','stories-sheet-heading');alphabetHeader.append(alphabetTitle,alphabetClose);alphabetSheet.append(alphabetHandle,alphabetHeader,alphabetHelp,alphabet);document.body.append(alphabetSheet);
  const alphabetOpen=element('button','ux-alphabet-open','A–Z');alphabetOpen.type='button';alphabetOpen.id='ux-alphabet-open';alphabetOpen.setAttribute('aria-haspopup','dialog');alphabetOpen.setAttribute('aria-controls',alphabetSheet.id);alphabetOpen.setAttribute('aria-label','Jump to a Letter');
  alphabetOpen.onclick=()=>{alphabetSheet.showModal();alphabet.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();};
  alphabetSheet.addEventListener('close',()=>{const target=alphabetJump;alphabetJump=null;if(target){requestAnimationFrame(()=>requestAnimationFrame(()=>{if(!host.hidden)jump(target);}));}else alphabetOpen.focus({preventScroll:true});});
  alphabetSheet.addEventListener('click',event=>{if(event.target===alphabetSheet){const r=alphabetSheet.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)alphabetSheet.close();}});
  window.addEventListener('viewchange',()=>{if(alphabetSheet.open)alphabetSheet.close();});
  host.append(heading, searchBox, count, list, alphabetOpen);
  // Keep letter dividers below the sticky search/filter controls at every font size.
  new ResizeObserver(() => {
    const top = parseFloat(getComputedStyle(searchBox).top) || 64;
    host.style.setProperty('--ux-letter-sticky-top', `${top + searchBox.getBoundingClientRect().height}px`);
  }).observe(searchBox);
  const pagination = element('div', 'characters-pagination');
  const previous = element('button', '', 'Previous'); previous.type = 'button';
  const next = element('button', '', 'Next'); next.type = 'button';
  const retry = element('button', '', 'Retry Loading Characters'); retry.type = 'button';
  previous.setAttribute('aria-controls', list.id); next.setAttribute('aria-controls', list.id);
  const pageLabel = element('span'); pageLabel.setAttribute('role', 'status');
  pagination.append(previous, pageLabel, next); host.append(pagination, retry);
  list.tabIndex = -1;
  function render(): void {
    renderCategories();
    const candidates = findPeople(search.value).filter(person => inCategory(person,category));
    const initial = (name: string) => name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').charAt(0).toUpperCase();
    const matches = candidates;
    for (const button of alphabet.querySelectorAll('button')) {
      button.disabled = !candidates.some(person => initial(person.name) === button.textContent);
      button.hidden=false;button.title=button.disabled?'No matching people':button.getAttribute('aria-label')!;
      button.setAttribute('aria-pressed', String(button.textContent === letter));
    }
    search.placeholder = `Search ${people.length.toLocaleString()} people, names, aliases…`;
    page = Math.min(page, Math.max(0, Math.ceil(matches.length / CHARACTER_PAGE_SIZE) - 1));
    list.replaceChildren();
    let section='';
    for(const person of characterPage(matches,page)){
      const first=initial(person.name);
      if(first!==section){const heading=element('h3','ux-letter-heading',first);heading.dataset.letter=first;heading.tabIndex=-1;list.append(heading);section=first;}
      list.append(PersonContact(person));
    }
    if(search.value.trim())for(const person of characterPage(matches,page)){
      const primary=person.name.toLocaleLowerCase().split(/[^\p{L}\p{N}]+/u);
      const terms=search.value.trim().toLocaleLowerCase().split(/\s+/);
      if(!terms.every(term=>primary.some(word=>word.startsWith(term)))){
        const aliases=(person.aliases||[]).filter(alias=>terms.some(term=>alias.toLocaleLowerCase().split(/[^\p{L}\p{N}]+/u).some(word=>word.startsWith(term))));
        document.getElementById(`character-card-${person.id}`)?.querySelector('.character-card-header')?.append(element('p','character-matched-alias','Matched alias: '+aliases.join(', ')));
      }
    }
    count.classList.toggle('loading-state', loading);
    count.textContent = loading ? 'Loading people…' : failed ? 'People could not be loaded. Please retry.'
      : `${(matches.length ? (page * CHARACTER_PAGE_SIZE + 1) : 0).toLocaleString()}–${Math.min((page + 1) * CHARACTER_PAGE_SIZE, matches.length).toLocaleString()} of ${matches.length.toLocaleString()} people`;
    list.setAttribute('aria-busy', String(loading));
    previous.disabled = page === 0; next.disabled = (page + 1) * CHARACTER_PAGE_SIZE >= matches.length;
    pagination.hidden = loading || failed || matches.length <= CHARACTER_PAGE_SIZE;
    pageLabel.textContent = `Page ${page + 1} of ${Math.max(1, Math.ceil(matches.length / CHARACTER_PAGE_SIZE))}`;
    retry.hidden = !failed;
    if (!loading && !failed && !matches.length) list.append(element('p', 'characters-empty', 'No people match. Try another name or alias.'));
  }
  // Family navigation replaces only the card that owns the clicked chip.
  const cardRequests=new WeakMap<HTMLElement,number>();
  list.addEventListener('replace-person-card',event=>{
    event.stopPropagation();
    const detail=(event as CustomEvent<{id:string;keyboard:boolean}>).detail;
    const card=(event.target as HTMLElement).closest<HTMLElement>('.character-card');
    if(!card)return;
    const request=(cardRequests.get(card)||0)+1;cardRequests.set(card,request);
    void (async()=>{
      try{
        const graph=await loadCharacterGraph();
        if(!card.isConnected||cardRequests.get(card)!==request)return;
        const person=people.find(person=>person.id===referenceId(detail.id))
          ||characters.find(person=>person.id===detail.id)
          ||(graph.getPerson(referenceId(detail.id))?connectionProfile(graph.getPerson(referenceId(detail.id))!):undefined);
        if(!person)return;
        const replacement=PersonContact(person);card.replaceWith(replacement);
        if(detail.keyboard)replacement.focus({preventScroll:true});
        replacement.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
      }catch{
        if(card.isConnected&&cardRequests.get(card)===request){
          let error=card.querySelector<HTMLElement>('.character-navigation-error');
          if(!error){error=element('p','character-navigation-error');error.setAttribute('role','status');card.append(error);}
          error.textContent='This profile could not be loaded. Select the name to try again.';
        }
      }
    })();
  });
  let searchTimer: ReturnType<typeof setTimeout>;
  search.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { letter=''; page = 0; render(); }, 100); });
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
  const back = element('button', 'character-family-back', '← Back'); back.type = 'button'; back.hidden = true;
  back.setAttribute('aria-label', 'Back to previous character');
  const title = element('h2', '', 'Character Profile'); title.id = 'character-detail-name';title.tabIndex = -1;
  header.append(back, title);
  back.addEventListener('click', () => {
    const previous = familyHistory.pop();
    if (!previous) return;
    activeTab = previous.tab;
    if(inlinePerson)inlinePerson=previous.id;else history.replaceState(null, '', `#characters/${previous.id}`);
    void handleRoute();
  });
  const close = element('button', '', 'Close'); close.type = 'button'; close.autofocus = true;
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
          count.textContent = `${target.name} · Curated Profile`; pagination.hidden = true;
        }
        const card = document.getElementById(`character-card-${target.id}`);
        // The four section controls remain collapsed after a family-card jump.
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
    let profile: CharacterProfile | undefined = people.find(person=>person.id===referenceId(currentId)) || characters.find(person => person.id === currentId);
    title.textContent=profile?profile.name+(profile.identity_context?' ('+profile.identity_context+')':''):'Character Profile';
    body.replaceChildren(element('p', 'loading-state', 'Loading character connections…'));
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
    title.textContent=profile?profile.name+(profile.identity_context?' ('+profile.identity_context+')':''):'Character Not Found';
    if (!profile) body.append(element('p', '', graph
      ? 'This character does not have a profile in this growing directory. Close this sheet to browse the available characters.'
      : 'The reference profile could not be loaded. Try again when the reference data is available.'));
    else {
      const context = element('div', 'character-profile-context');
      context.append(element('span', 'character-era', profile.era), element('span', 'character-profile-kind', characters.some(person => person.id === profile!.id) ? 'Curated Profile' : 'Reference Profile'));
      body.append(context, element('p', 'character-profile-biography', profile.summary), ProfileSections(profile, graph));
    }
    if (!profile && !graph) {
      const retry = element('button', 'character-connections-retry', 'Retry Profile'); retry.type = 'button';
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
