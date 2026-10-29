import {loadPlaces,atlasDescription} from './places-core.js';
import {placePreviewSVG} from './place-map-preview.js';

const normalize=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
export function searchPlaces(places,query=''){
 const terms=normalize(query.trim()).split(/\s+/).filter(Boolean);
 const queryName=normalize(query.trim());
 const rank=place=>{const name=normalize(place.name);return !queryName?0:name===queryName?4:name.startsWith(queryName)?3:terms.every(term=>name.split(/[^\p{L}\p{N}]+/u).some(word=>word.startsWith(term)))?2:1;};
 return [...places.values()].filter(place=>terms.every(term=>normalize([place.name,...place.aliases,place.modern_name].filter(Boolean).join(' ')).split(/[^\p{L}\p{N}]+/u).some(word=>word.startsWith(term))))
  .sort((a,b)=>rank(b)-rank(a)||a.name.localeCompare(b.name)||a.id.localeCompare(b.id));
}

const node=(tag,className,text)=>{const el=document.createElement(tag);el.className=className||'';if(text)el.textContent=text;return el;};
function placeCard(place){
 const card=node('article','character-card place-profile-card');
 const heading=node('h2','character-name',place.name);card.append(heading);
 const aliases=[...place.aliases,place.modern_name].filter(Boolean).filter(alias=>normalize(alias.trim())!==normalize(place.name.trim()));
 if(aliases.length)card.append(node('p','character-aliases',aliases.join(' · ')));
 const description=atlasDescription(place);
 if(description)card.append(node('p','character-summary',description));
 const figure=node('div','place-map-card');
 const map=node('button','place-map-preview');map.type='button';map.dataset.placeId=place.id;map.disabled=!place.coordinates;
 map.setAttribute('aria-haspopup','dialog');map.setAttribute('aria-controls','atlas-sheet');map.setAttribute('aria-label',place.coordinates?'Explore '+place.name+' in the atlas':'Map location unavailable: '+place.name);
 map.innerHTML=place.coordinates?placePreviewSVG(place):'<span class="place-map-unavailable">Map location unavailable</span>';
 const controls=node('div','place-map-actions');controls.setAttribute('role','group');controls.setAttribute('aria-label',place.name+' map and sources');
 const label=node('button','place-map-action');label.type='button';label.dataset.placeId=place.id;label.disabled=!place.coordinates;
 label.setAttribute('aria-haspopup','dialog');label.setAttribute('aria-controls','atlas-sheet');label.setAttribute('aria-label','Map: '+place.name+' in the atlas');
 label.innerHTML='<span>Map</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 18 18 6M6 6h12v12"/></svg>';
 const source=node('button','place-map-action place-map-source');source.type='button';source.setAttribute('aria-label','Sources and location details for '+place.name);
 source.innerHTML='<span>Sources</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8 3h9a2 2 0 0 1 2 2v14H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3ZM8 3v13h11M11 7h5M11 10h5"/></svg>';
 controls.append(label,source);figure.append(map,controls);
 figure.append(node('p','place-map-context',place.coordinates?'Modern geography · Reference point; ancient identification varies.':'The source does not supply coordinates for this place.'));
 card.append(figure);
 const panel=node('section','place-location-details');panel.setAttribute('aria-label',place.name+' location details');
 panel.append(node('h3','','Location details'));
 for(const [label,value] of [['Type',place.featureType],['Modern name',place.modern_name],['Location precision',place.precision]])if(value)panel.append(node('p','',label+': '+value));
 if(place.coordinates)panel.append(node('p','',place.coordinates.latitude.toFixed(5)+', '+place.coordinates.longitude.toFixed(5)));
 panel.append(node('p','characters-note',place.coordinates?'Dataset location; historical identifications and precision vary. Modern map labels do not establish ancient boundaries.':'Coordinates are unavailable for this location.'));
 const popover=node('div','character-source-popover');popover.id='place-source-'+place.id;popover.setAttribute('popover','auto');popover.setAttribute('role','dialog');popover.setAttribute('aria-labelledby',popover.id+'-title');source.setAttribute('popovertarget',popover.id);source.setAttribute('aria-haspopup','dialog');
 const header=node('div','character-source-header'),title=node('h3','','Place Data Source');title.id=popover.id+'-title';
 const close=node('button','','×');close.type='button';close.autofocus=true;close.setAttribute('aria-label','Close place source');close.setAttribute('popovertarget',popover.id);close.setAttribute('popovertargetaction','hide');header.append(title,close);popover.append(header);
 let returnFocus=false;
 popover.addEventListener('beforetoggle',event=>{if(event.newState==='closed')returnFocus=popover.contains(document.activeElement);});
 popover.addEventListener('toggle',event=>{if(event.newState==='closed'&&returnFocus&&source.isConnected)source.focus({preventScroll:true});});
 popover.append(panel,node('p','atlas-attribution','Preview geography: Natural Earth 5.1.2, public domain. Coastlines and lakes are simplified modern context, not a reconstruction of ancient geography.'));
 const credit=document.querySelector('#atlas-sources .atlas-attribution');if(credit)popover.append(credit.cloneNode(true));
 card.append(popover);return card;
}

export function mountPlacesDirectory(){
 const host=document.querySelector('#places-view');if(!host)return;
 host.innerHTML='<div class="page-heading"><h1 id="places-heading">Places</h1><p>Find biblical locations and explore their maps and sources.</p></div><label class="sr-only" for="places-search">Search places by name or alias</label><div class="characters-search-box"><input id="places-search" type="search" placeholder="Search places or aliases…"></div><p id="places-count" class="sr-only" role="status"></p><ul class="places-directory-list"></ul><nav class="places-directory-pagination" aria-label="Places results"><button type="button" data-places-previous>Previous</button><span role="status"></span><button type="button" data-places-next>Next</button></nav><button type="button" data-places-retry hidden>Retry loading places</button>';
 const search=host.querySelector('input'),count=host.querySelector('#places-count'),list=host.querySelector('ul'),pagination=host.querySelector('nav');
 const previous=host.querySelector('[data-places-previous]'),next=host.querySelector('[data-places-next]'),retry=host.querySelector('[data-places-retry]');
 let places=new Map(),page=0,loaded=false,loading=false,failed=false;
 function render(){
  const matches=searchPlaces(places,search.value),pages=Math.ceil(matches.length/15);page=Math.min(page,Math.max(0,pages-1));
  count.className=loading?'loading-state':failed?'':'sr-only';
  count.textContent=loading?'Loading places…':failed?'Places could not be loaded.':`${matches.length?page*15+1:0}–${Math.min((page+1)*15,matches.length)} of ${matches.length} ${matches.length===1?'place':'places'}`;
  list.replaceChildren();list.setAttribute('aria-busy',String(loading));
  for(const place of matches.slice(page*15,(page+1)*15)){
   const row=document.createElement('li');row.append(placeCard(place));list.append(row);
  }
  if(loaded&&!matches.length){const empty=document.createElement('li');empty.textContent='No places match. Try another name or alias.';list.append(empty);}
  previous.disabled=page===0;next.disabled=page+1>=pages;pagination.hidden=!loaded||pages<=1;retry.hidden=!failed;
  pagination.querySelector('span').textContent=`Page ${page+1} of ${Math.max(1,pages)}`;
 }
 async function load(){
  if(loaded||loading)return;loading=true;failed=false;render();
  try{places=await loadPlaces();loaded=true;}catch{failed=true;}
  loading=false;render();
 }
 search.addEventListener('input',()=>{page=0;render();});retry.addEventListener('click',()=>{void load();});
 function move(offset){page+=offset;render();count.scrollIntoView({block:'start'});}
 previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 window.addEventListener('viewchange',event=>{if(event.detail==='places')void load();});
 render();if(!host.hidden)void load();
}
