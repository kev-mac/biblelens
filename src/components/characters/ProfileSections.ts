import {element, StoryAnchor} from './CharacterCard';
import {characterVerseRoute} from './directory';
import {loadCharacterGraph} from '../../character-connections.js';
import {FamilyConnections, referenceId} from './Connections';
import {loadPlaces,createPlaceMatcher} from '../../places-core.js';
import books from '../../../data/books.json';
import type {CharacterProfile} from '../../types/character';

type Graph = Awaited<ReturnType<typeof loadCharacterGraph>>;
let nextProfileSections = 0;
const icons = {
 verses:'<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
 stories:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18M12 3v9M8 16h8m-8 2h5"/>',
 places:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
 family:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/>'
};
const knownPlace=(value: string|undefined): boolean => !!value?.trim()&&!/^(not (specified|recorded|stated|known|available).*|unknown|unspecified|none|n\/a|-|\?)$/i.test(value.trim());
export function profileSectionAvailability(profile: CharacterProfile, graph?: Graph): Record<'verses'|'stories'|'places'|'family',boolean> {
 return {
  verses:profile.narrative_anchors.key_verses.some(ref=>!!characterVerseRoute(ref)),
  stories:profile.narrative_anchors.linked_stories.length>0,
  places:knownPlace(profile.geography.origin)||profile.geography.residence.some(knownPlace)||knownPlace(profile.lineage?.tribe),
  family:!!graph&&Object.values(graph.getCharacterConnections(referenceId(profile.id))).some(relatives=>relatives.length>0)
 };
}
// Keep surrounding prose intact and link complete verse lists/ranges in place citations.
const placeCitationPattern = new RegExp(`\\b(${books.map(book=>book.name).join('|')}) (\\d+):(\\d+(?:[–-]\\d+)?(?:,\\s*\\d+(?:[–-]\\d+)?)*)`, 'g');
type PlaceMatcher=ReturnType<typeof createPlaceMatcher>;
let pendingPlaceMatcher:Promise<PlaceMatcher>|undefined;
export function createProfilePlaceMatcher(places:Awaited<ReturnType<typeof loadPlaces>>):PlaceMatcher{
 // These fields already identify geography; a shared person's name is not ambiguous here.
 const geographical=new Map([...places].map(([id,place])=>[id,{...place,personNames:[],featureType:place.featureType||(place.coordinates?'Region':null)}]));
 const match=createPlaceMatcher(geographical);
 return (text:string)=>match(text).filter(hit=>!!places.get(hit.id)?.coordinates);
}
function loadMappedPlaceMatcher():Promise<PlaceMatcher>{
 return pendingPlaceMatcher ||= Promise.resolve().then(loadPlaces).then(createProfilePlaceMatcher).catch(error=>{pendingPlaceMatcher=undefined;throw error;});
}
export function placeText(tag: 'p'|'li', text: string, matchPlaces?:PlaceMatcher): HTMLElement {
 const node=element(tag);let offset=0;
 function appendPlain(segment:string):void{
  let cursor=0;
  for(const hit of matchPlaces?.(segment)||[]){
   node.append(document.createTextNode(segment.slice(cursor,hit.start)));
   const link=element('button','character-place-link',hit.label);link.type='button';link.dataset.placeId=hit.id;
   link.setAttribute('aria-haspopup','dialog');link.setAttribute('aria-controls','atlas-sheet');link.setAttribute('aria-label',`Map ${hit.label}`);
   node.append(link);cursor=hit.end;
  }
  node.append(document.createTextNode(segment.slice(cursor)));
 }
 for(const match of text.matchAll(placeCitationPattern)){
  appendPlain(text.slice(offset,match.index));
  const book=books.find(book=>book.name===match[1])!;
  const link=element('a','character-place-citation',match[0]);
  link.href=`#read/${book.id}/${match[2]}/${match[3].replace(/–/g,'-').replace(/\s/g,'')}`;
  node.append(link);offset=match.index!+match[0].length;
 }
 appendPlain(text.slice(offset));return node;
}
export function ProfileSections(profile: CharacterProfile, graph?: Graph): HTMLElement {
 const root=element('div','person-sections'), row=element('div','person-section-controls');
 row.setAttribute('role','group');row.setAttribute('aria-label',`${profile.name} profile sections`);
 const prefix=`person-sections-${++nextProfileSections}`;
 const availability=profileSectionAvailability(profile,graph);
 let familyGraph=graph;
 const sections: {button: HTMLButtonElement; panel: HTMLElement}[]=[];
 root.append(row);
 const emptyNote=element('p','person-empty-sections');emptyNote.setAttribute('role','status');root.append(emptyNote);
 const explainEmpty=()=>{emptyNote.hidden=true;};
 root.addEventListener('click',event=>{const relative=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-relative-id]');if(relative&&!root.closest('dialog')){event.stopPropagation();root.dispatchEvent(new CustomEvent('open-person',{bubbles:true,detail:{id:relative.dataset.relativeId,opener:relative}}));}});
 for(const [key,label] of [['verses','Verses'],['stories','Stories'],['places','Places'],['family','Family']] as const){
  const button=element('button','person-section-toggle');button.type='button';button.dataset.personSection=key;
  button.disabled=!availability[key];button.setAttribute('aria-disabled',String(button.disabled));
  button.title=button.disabled?`No ${label.toLowerCase()} information available`:label;
  button.id=`${prefix}-${key}-toggle`;button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',`${prefix}-${key}`);
  const icon=element('span','person-section-icon');icon.setAttribute('aria-hidden','true');
  icon.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[key]}</svg>`;
  button.append(icon,element('span','person-section-label',label));row.append(button);
  const panel=element('section','person-section-panel');panel.id=`${prefix}-${key}`;panel.hidden=true;
  panel.setAttribute('aria-labelledby',button.id);root.append(panel);sections.push({button,panel});
  let loaded=false;
  if(key==='family'&&!familyGraph){
   button.setAttribute('aria-busy','true');button.title='Loading family information';
   loadCharacterGraph().then(data=>{familyGraph=data;button.disabled=!profileSectionAvailability(profile,data).family;button.setAttribute('aria-disabled',String(button.disabled));button.setAttribute('aria-busy','false');button.title=button.disabled?'No family information available':label;explainEmpty();}).catch(()=>{button.setAttribute('aria-busy','false');button.title='Family information could not be loaded';});
  }
  async function fillFamily(): Promise<void>{
   panel.replaceChildren(element('p','','Loading family…'));
   try{const data=familyGraph||await loadCharacterGraph();panel.replaceChildren(FamilyConnections(data.getCharacterConnections(referenceId(profile.id)),prefix));loaded=true;}
   catch{const retry=element('button','','Retry family');retry.type='button';retry.addEventListener('click',()=>{void fillFamily();});panel.replaceChildren(element('p','','Family connections could not be loaded.'),retry);}
  }
  button.addEventListener('click',()=>{
   if(button.disabled)return;
   const open=panel.hidden;
   for(const section of sections){const selected=open&&section.panel===panel;section.panel.hidden=!selected;section.button.setAttribute('aria-expanded',String(selected));}
   if(!open||loaded)return;
   if(key==='family'){void fillFamily();return;}
   loaded=true;panel.append(element('h3','',label));
   if(key==='verses'){
    if(profile.narrative_anchors.books.length)panel.append(element('p','person-section-caption',profile.narrative_anchors.books.join(' · ')));
    const refs=element('div','character-verses');
    for(const ref of profile.narrative_anchors.key_verses){const route=characterVerseRoute(ref);if(!route)continue;const book=books.find(book=>ref.startsWith(book.name+' '));const link=element('a','',book?book.code+ref.slice(book.name.length):ref);link.href=route;link.title=ref;link.setAttribute('aria-label',ref);refs.append(link);}
    panel.append(refs.childElementCount?refs:element('p','','No scripture references are recorded for this person.'));
   }else if(key==='stories'){
    const stories=element('div','character-stories');for(const anchor of profile.narrative_anchors.linked_stories)stories.append(StoryAnchor(anchor));
    panel.append(stories.childElementCount?stories:element('p','','No linked stories are recorded for this person.'));
   }else{
    const placeNodes:{node:HTMLElement;tag:'p'|'li';text:string}[]=[];
    function addPlace(parent:HTMLElement,tag:'p'|'li',text:string):void{const node=placeText(tag,text);parent.append(node);placeNodes.push({node,tag,text});}
    if(knownPlace(profile.geography.origin))addPlace(panel,'p',`Origin · ${profile.geography.origin}`);
    if(profile.lineage?.tribe)addPlace(panel,'p',`Tribe · ${profile.lineage.tribe}`);
    const recordedPlaces=profile.geography.residence.filter(knownPlace);
    if(recordedPlaces.length){panel.append(element('h4','','Residences & Sojourns'));const residences=element('ul');for(const place of recordedPlaces)addPlace(residences,'li',place);panel.append(residences);}
    void loadMappedPlaceMatcher().then(match=>{for(const entry of placeNodes)if(entry.node.isConnected)entry.node.replaceWith(placeText(entry.tag,entry.text,match));}).catch(()=>{/* Preserve readable prose when the atlas is offline. */});
   }
  });
 }
 explainEmpty();return root;
}
