import {loadPlaces,atlasDescription} from './places-core.js';

const normalize=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
export function searchPlaces(places,query=''){
 const terms=normalize(query.trim()).split(/\s+/).filter(Boolean);
 return [...places.values()].filter(place=>terms.every(term=>normalize([place.name,...place.aliases,place.modern_name].filter(Boolean).join(' ')).includes(term)))
  .sort((a,b)=>Number(normalize(b.name)===normalize(query.trim()))-Number(normalize(a.name)===normalize(query.trim()))||a.name.localeCompare(b.name)||a.id.localeCompare(b.id));
}

const node=(tag,className,text)=>{const el=document.createElement(tag);el.className=className||'';if(text)el.textContent=text;return el;};
function placeCard(place){
 const card=node('article','character-card place-profile-card');
 const heading=node('h2','character-name',place.name);card.append(heading);
 const aliases=place.aliases.filter(alias=>normalize(alias.trim())!==normalize(place.name.trim()));
 if(aliases.length)card.append(node('p','character-aliases',aliases.join(' · ')));
 const description=atlasDescription(place);
 if(description)card.append(node('p','character-summary',description));
 const controls=node('div','person-section-controls');controls.setAttribute('role','group');controls.setAttribute('aria-label',place.name+' place sections');
 const map=node('button','person-section-toggle');map.type='button';map.dataset.placeId=place.id;map.disabled=!place.coordinates;
 map.setAttribute('aria-haspopup','dialog');map.setAttribute('aria-controls','atlas-sheet');map.setAttribute('aria-label','Explore '+place.name+' in the atlas');
 map.innerHTML='<span class="person-section-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span><span class="person-section-label">Map</span>';
 const details=node('button','person-section-toggle');details.type='button';details.setAttribute('aria-expanded','false');details.setAttribute('aria-controls','place-details-'+place.id);
 details.innerHTML='<span class="person-section-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/></svg></span><span class="person-section-label">Details</span>';
 const panel=node('section','person-section-panel');panel.id='place-details-'+place.id;panel.hidden=true;panel.setAttribute('aria-label',place.name+' details');
 panel.append(node('h3','','Location details'));
 for(const [label,value] of [['Type',place.featureType],['Modern name',place.modern_name],['Location precision',place.precision]])if(value)panel.append(node('p','',label+': '+value));
 if(place.coordinates)panel.append(node('p','',place.coordinates.latitude.toFixed(5)+', '+place.coordinates.longitude.toFixed(5)));
 panel.append(node('p','characters-note',place.coordinates?'Dataset location; historical identifications and precision vary. Modern map labels do not establish ancient boundaries.':'Coordinates are unavailable for this location.'));
 details.addEventListener('click',()=>{panel.hidden=!panel.hidden;details.setAttribute('aria-expanded',String(!panel.hidden));});
 controls.append(map,details);card.append(controls,panel);
 const source=node('button','character-source-toggle','Source');source.type='button';
 const popover=node('div','character-source-popover');popover.id='place-source-'+place.id;popover.setAttribute('popover','auto');popover.setAttribute('role','dialog');popover.setAttribute('aria-labelledby',popover.id+'-title');source.setAttribute('popovertarget',popover.id);
 const header=node('div','character-source-header'),title=node('h3','','Place Data Source');title.id=popover.id+'-title';
 const close=node('button','','×');close.type='button';close.setAttribute('aria-label','Close place source');close.setAttribute('popovertarget',popover.id);close.setAttribute('popovertargetaction','hide');header.append(title,close);popover.append(header);
 const credit=document.querySelector('#atlas-sources .atlas-attribution');if(credit)popover.append(credit.cloneNode(true));
 card.append(source,popover);return card;
}

export function mountPlacesDirectory(){
 const host=document.querySelector('#places-view');if(!host)return;
 host.innerHTML='<div class="page-heading"><h1 id="places-heading">Places</h1><p>Find biblical locations and explore their maps and sources.</p></div><label class="sr-only" for="places-search">Search places by name or alias</label><div class="characters-search-box"><input id="places-search" type="search" placeholder="Search places or aliases…"></div><p id="places-count" class="sr-only" role="status"></p><ul class="places-directory-list"></ul><nav class="places-directory-pagination" aria-label="Places results"><button type="button" data-places-previous>Previous</button><span role="status"></span><button type="button" data-places-next>Next</button></nav><button type="button" data-places-retry hidden>Retry loading places</button>';
 const search=host.querySelector('input'),count=host.querySelector('#places-count'),list=host.querySelector('ul'),pagination=host.querySelector('nav');
 const previous=host.querySelector('[data-places-previous]'),next=host.querySelector('[data-places-next]'),retry=host.querySelector('[data-places-retry]');
 let places=new Map(),page=0,loaded=false,loading=false,failed=false;
 function render(){
  const matches=searchPlaces(places,search.value),pages=Math.ceil(matches.length/24);page=Math.min(page,Math.max(0,pages-1));
  count.textContent=loading?'Loading places…':failed?'Places could not be loaded.':`${matches.length?page*24+1:0}–${Math.min((page+1)*24,matches.length)} of ${matches.length} ${matches.length===1?'place':'places'}`;
  list.replaceChildren();list.setAttribute('aria-busy',String(loading));
  for(const place of matches.slice(page*24,(page+1)*24)){
   const row=document.createElement('li');row.append(placeCard(place));list.append(row);
  }
  if(loaded&&!matches.length){const empty=document.createElement('li');empty.textContent='No places match. Try another name or alias.';list.append(empty);}
  previous.disabled=page===0;next.disabled=page+1>=pages;pagination.hidden=!loaded||pages<=1;retry.hidden=!failed;
  pagination.querySelector('span').textContent=`${page+1} / ${pages}`;
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
