import {directorySaveButton} from './directory-save.js';
import {loadPlaces,atlasDescription} from './places-core.js';
import {regionCoverage,inWindow,usableRegionPoint} from './place-regions.js';

const normalize=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
export function searchPlaces(places,query=''){
 const terms=normalize(query.trim()).split(/\s+/).filter(Boolean);
 const queryName=normalize(query.trim());
 const rank=place=>{const name=normalize(place.name);return !queryName?0:name===queryName?4:name.startsWith(queryName)?3:terms.every(term=>name.split(/[^\p{L}\p{N}]+/u).some(word=>word.startsWith(term)))?2:1;};
 return [...places.values()].filter(place=>terms.every(term=>normalize([place.name,...place.aliases,place.modern_name].filter(Boolean).join(' ')).split(/[^\p{L}\p{N}]+/u).some(word=>word.startsWith(term))))
  .sort((a,b)=>rank(b)-rank(a)||a.name.localeCompare(b.name)||a.id.localeCompare(b.id));
}

const node=(tag,className,text)=>{const el=document.createElement(tag);el.className=className||'';if(text)el.textContent=text;return el;};
function placeCard(place, duplicate){
 const card=node('article','character-card place-profile-card');
 const heading=node('h2','character-name',place.name+(duplicate&&place.featureType?' ('+place.featureType+')':''));card.append(heading);
 const open=node('button','ux-place-open','→');open.type='button';open.dataset.placeId=place.id;open.setAttribute('aria-label','Open '+place.name);card.append(open,directorySaveButton('place',place.id,place.name));
 if(place.linkedPassageCount!==null)card.append(node('p','ux-place-count',place.linkedPassageCount+' linked '+(place.linkedPassageCount===1?'verse':'verses')));
 const description=place.shortDescription;
 if(description&&description.split(/\s+/).length<=15)card.append(node('p','character-summary',description));
 const meta=node('div','ux-place-meta');
 if(place.featureType)meta.append(node('span','',place.featureType));
 if(place.coordinates)meta.append(node('span','',place.coordinates.latitude.toFixed(5)+', '+place.coordinates.longitude.toFixed(5)));
 card.append(meta);
 const figure=node('div','place-map-actions');
 const map=node('button','place-map-action','Map');map.type='button';map.dataset.placeId=place.id;map.disabled=!place.coordinates;map.setAttribute('aria-label','Map: '+place.name+' in the atlas');
 const source=node('button','place-map-action place-map-source','Sources');source.type='button';source.setAttribute('aria-label','Sources and location details for '+place.name);
 figure.append(map,source);card.append(figure);
 const panel=node('section','place-location-details');panel.setAttribute('aria-label',place.name+' location details');
 panel.append(node('h3','','Location details'));
 const fullDescription=atlasDescription(place);
 if(fullDescription&&fullDescription!=='No description is available in this reference dataset.'){const details=node('details');details.append(node('summary','','Source description'),node('p','',fullDescription));panel.append(details);}
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
 const regions=node('div','directory-categories');regions.setAttribute('aria-label','Place regions');regions.setAttribute('role','group');host.querySelector('.characters-search-box').after(regions);
 const search=host.querySelector('input'),count=host.querySelector('#places-count'),list=host.querySelector('ul'),pagination=host.querySelector('nav');
 const previous=host.querySelector('[data-places-previous]'),next=host.querySelector('[data-places-next]'),retry=host.querySelector('[data-places-retry]');
 let region=null,places=new Map(),page=0,loaded=false,loading=false,failed=false;
 function render(){
  const matches=searchPlaces(places,search.value).filter(place=>!region||usableRegionPoint(place)&&inWindow(place,region)),pages=Math.ceil(matches.length/15);page=Math.min(page,Math.max(0,pages-1));
  count.className=loading?'loading-state':failed?'':'sr-only';
  count.textContent=loading?'Loading places…':failed?'Places could not be loaded.':`${matches.length?page*15+1:0}–${Math.min((page+1)*15,matches.length)} of ${matches.length} ${matches.length===1?'place':'places'}`;
  list.replaceChildren();list.setAttribute('aria-busy',String(loading));
  for(const place of matches.slice(page*15,(page+1)*15)){
   const row=document.createElement('li');row.append(placeCard(place,[...places.values()].filter(other=>normalize(other.name)===normalize(place.name)).length>1));list.append(row);
  }
  if(loaded&&!matches.length){const empty=document.createElement('li');empty.textContent='No places match. Try another name or alias.';list.append(empty);}
  previous.disabled=page===0;next.disabled=page+1>=pages;pagination.hidden=!loaded||pages<=1;retry.hidden=!failed;
  pagination.querySelector('span').textContent=`Page ${page+1} of ${Math.max(1,pages)}`;
 }
 async function load(){
  if(loaded||loading)return;loading=true;failed=false;render();
  try{places=await loadPlaces();loaded=true;
   const shown=regionCoverage([...places.values()]).filter(row=>row.shown);
   for(const row of [null,...shown]){const button=node('button','',row?row.name+' ('+row.usable.toLocaleString()+')':'All ('+places.size.toLocaleString()+')');button.type='button';button.setAttribute('aria-label',row?.name||'All');button.setAttribute('aria-pressed',String(row===region));button.onclick=()=>{region=row;page=0;for(const other of regions.children)other.setAttribute('aria-pressed',String(other===button));render();};regions.append(button);}
  }catch{failed=true;}
  loading=false;render();
 }
 search.addEventListener('input',()=>{page=0;render();});retry.addEventListener('click',()=>{void load();});
 function move(offset){page+=offset;render();count.scrollIntoView({block:'start'});}
 previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 window.addEventListener('viewchange',event=>{if(event.detail==='places')void load();});
 render();if(!host.hidden)void load();
}
