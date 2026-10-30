import {element, StoryAnchor} from './CharacterCard';
import {characters, characterVerseRoute} from './directory';
import {loadCharacterGraph} from '../../character-connections.js';
import {FamilyConnections, connectionProfile, referenceId} from './Connections';

// Each expanded card owns its navigation and loading state independently.
export function mountInlineProfile(host: HTMLElement, initialId: string): void {
  let generation = 0;
  const history: string[] = [];
  async function show(id: string): Promise<void> {
    const request = ++generation;
    host.replaceChildren(element('p', '', 'Loading profile…'));
    host.setAttribute('aria-busy', 'true');
    let graph: Awaited<ReturnType<typeof loadCharacterGraph>> | undefined;
    try { graph = await loadCharacterGraph(); } catch {}
    if (request !== generation || !host.isConnected) return;
    host.removeAttribute('aria-busy');
    const person = graph?.getPerson(referenceId(id));
    const profile = characters.find(profile => profile.id === id) || (person ? connectionProfile(person) : undefined);
    host.replaceChildren();
    if (history.length) {
      const back = element('button', 'character-inline-back', '← Back'); back.type = 'button';
      back.addEventListener('click', () => { void show(history.pop()!); }); host.append(back);
    }
    if (id !== initialId && profile) host.append(element('h3', '', profile.name), element('p', '', profile.summary));
    if (!profile) host.append(element('p', '', 'The profile could not be loaded.'));
    else {
      host.append(element('span', 'character-era', profile.era));
      const tabs = element('div', 'character-profile-tabs'); tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Profile sections');
      const overview = element('section'), connections = element('section');
      const panels = {overview, connections};
      const buttons: HTMLButtonElement[] = [];
      for (const [name, label] of [['overview', 'Overview'], ['connections', 'Connections']] as const) {
        const button = element('button', '', label); button.type = 'button'; button.id = `${host.id}-${name}-tab`;
        panels[name].id = `${host.id}-${name}`;
        panels[name].setAttribute('role', 'tabpanel'); panels[name].setAttribute('aria-labelledby', button.id);
        button.setAttribute('role', 'tab'); button.setAttribute('aria-controls', panels[name].id);
        function select(): void {
          for (const tab of buttons) { const selected = tab === button; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; }
          overview.hidden = name !== 'overview'; connections.hidden = name !== 'connections';
        }
        button.addEventListener('click', select);
        button.addEventListener('keydown', event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault(); const target = event.key === 'Home' ? buttons[0] : event.key === 'End' ? buttons[1] : buttons.find(tab => tab !== button)!;
          target.click(); target.focus();
        });
        buttons.push(button); tabs.append(button);
      }
      host.append(tabs, overview, connections); buttons[0].click();
      overview.append(element('h3', '', 'Places'), element('p', '', `Origin · ${profile.geography.origin}`));
      if (profile.lineage?.tribe) overview.append(element('p', '', `Tribe · ${profile.lineage.tribe}`));
      const residences = element('ul');
      for (const place of profile.geography.residence) residences.append(element('li', '', place));
      overview.append(element('h4', '', 'Residences & Sojourns'), residences, element('h3', '', 'Scripture Anchors'), element('p', '', `Books · ${profile.narrative_anchors.books.join(', ')}`));
      const verses = element('div', 'character-verses');
      for (const reference of profile.narrative_anchors.key_verses) {
        const route = characterVerseRoute(reference); if (!route) continue;
        const link = element('a', '', reference); link.href = route; verses.append(link);
      }
      overview.append(element('h4', '', 'Key Verses'), verses);
      const stories = element('div', 'character-stories');
      for (const anchor of profile.narrative_anchors.linked_stories) stories.append(StoryAnchor(anchor));
      if (stories.childElementCount) overview.append(element('h4', '', 'Linked Events'), stories);
      if (graph) connections.append(FamilyConnections(graph.getCharacterConnections(referenceId(profile.id)), host.id));
    }
    if (!graph) {
      const retry = element('button', '', 'Retry Profile'); retry.type = 'button';
      retry.addEventListener('click', () => { void show(id); }); host.append(retry);
    }
    host.onclick = event => {
      const chip = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-relative-id]');
      if (!chip?.dataset.relativeId || chip.dataset.relativeId === id) return;
      history.push(id); void show(chip.dataset.relativeId);
    };
  }
  void show(initialId);
}
