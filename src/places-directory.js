import books from '../data/books.json' with {type:'json'};
import {directorySaveButton} from './directory-save.js';
import {loadPlaces,directoryPlaces} from './places-core.js';
import {regionCoverage,inWindow,usableRegionPoint} from './place-regions.js';

const normalize=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().replace(/['’]s\b/g,'');
export function searchPlaces(places,query=''){
 const terms=normalize(query.trim()).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
 const queryName=normalize(query.trim());
 const rank=place=>{const name=normalize(place.name);return !queryName?0:name===queryName?4:name.startsWith(queryName)?3:terms.every(term=>name.split(/[^\p{L}\p{N}]+/u).some(word=>word.startsWith(term)))?2:1;};
 return directoryPlaces(places).filter(place=>terms.every(term=>normalize([place.name,...place.aliases,place.modern_name].filter(Boolean).join(' ')).split(/[^\p{L}\p{N}]+/u).some(word=>word.startsWith(term))))
  .sort((a,b)=>rank(b)-rank(a)||a.name.localeCompare(b.name)||a.id.localeCompare(b.id));
}

const node=(tag,className,text)=>{const el=document.createElement(tag);el.className=className||'';if(text)el.textContent=text;return el;};
function placeCard(place, duplicate){
 const card=node('article','character-card place-profile-card');
 const heading=node('h2','character-name',place.name+(duplicate&&(place.region||place.refs?.[0])?' ('+(place.region||(books[place.refs[0][0]].code+' '+place.refs[0][1]+':'+place.refs[0][2]))+')':''));card.append(heading);
 const open=node('button','ux-place-open place-map-action','View place →');open.type='button';open.dataset.placeId=place.id;open.setAttribute('aria-label','Open '+place.name);card.append(directorySaveButton('place',place.id,place.name));

 if(place.refs?.length){const [book,chapter,verse]=place.refs[0],pill=node('span','passage-badge',books[book].name+' '+chapter+':'+verse+(place.refs.length>1?' +'+(place.refs.length-1).toLocaleString():''));card.prepend(pill);}
 const description=place.shortDescription;
 if(description&&description.split(/\s+/).length<=15)card.append(node('p','character-summary',description));
 const meta=node('div','ux-place-meta');
 if(place.featureType)meta.append(node('span','',place.featureType));
 if(place.modern_name)meta.append(node('span','','Now '+place.modern_name));
 if(!place.coordinates)meta.append(node('span','','Location unknown'));
 card.append(meta);
 const figure=node('div','story-footer');
 figure.append(node('span','',place.linkedPassageCount===null?'':place.linkedPassageCount.toLocaleString()+' linked '+(place.linkedPassageCount===1?'verse':'verses')));open.classList.add('action-link');
 figure.append(open);card.append(figure);
 return card;
}

export function mountPlacesDirectory(){
 const host=document.querySelector('#places-view');if(!host)return;
 host.innerHTML='<div class="page-heading"><h1 id="places-heading">Places</h1><p>Find biblical locations and explore their maps and sources.</p></div><label class="sr-only" for="places-search">Search Places by Name or Alias</label><div class="characters-search-box"><input id="places-search" type="search" placeholder="Search places or aliases…"></div><p id="places-count" class="sr-only" role="status"></p><ul class="places-directory-list"></ul><nav class="places-directory-pagination" aria-label="Places results"><button type="button" data-places-previous>Previous</button><span role="status"></span><button type="button" data-places-next>Next</button></nav><button type="button" data-places-retry hidden>Retry Loading Places</button>';
 const regions=node('div','directory-categories');regions.setAttribute('aria-label','Place regions');regions.setAttribute('role','group');host.querySelector('.characters-search-box').after(regions);
 const search=host.querySelector('input'),count=host.querySelector('#places-count'),list=host.querySelector('ul'),pagination=host.querySelector('nav');
 const previous=host.querySelector('[data-places-previous]'),next=host.querySelector('[data-places-next]'),retry=host.querySelector('[data-places-retry]');
 let region=null,places=new Map(),page=0,loaded=false,loading=false,failed=false;
 function render(){
  const matches=searchPlaces(places,search.value).filter(place=>!region||usableRegionPoint(place)&&inWindow(place,region)),pages=Math.ceil(matches.length/24);page=Math.min(page,Math.max(0,pages-1));
  count.className=loading?'loading-state':'directory-results';
  search.placeholder=`Search ${searchPlaces(places).length.toLocaleString()} places, names, aliases…`;
  count.textContent=loading?'Loading places…':failed?'Places could not be loaded.':`${(matches.length?page*24+1:0).toLocaleString()}–${Math.min((page+1)*24,matches.length).toLocaleString()} of ${matches.length.toLocaleString()} ${matches.length===1?'place':'places'}`;
  list.replaceChildren();list.setAttribute('aria-busy',String(loading));
  for(const place of matches.slice(page*24,(page+1)*24)){
   const row=document.createElement('li');row.append(placeCard(place,[...places.values()].filter(other=>normalize(other.name)===normalize(place.name)).length>1));list.append(row);
  }
  if(loaded&&!matches.length){const empty=document.createElement('li');empty.textContent='No places match. Try another name or alias.';list.append(empty);}
  previous.disabled=page===0;next.disabled=page+1>=pages;pagination.hidden=!loaded||pages<=1;retry.hidden=!failed;
  pagination.querySelector('span').textContent=`Page ${page+1} of ${Math.max(1,pages)}`;
 }
 async function load(){
  if(loaded||loading)return;loading=true;failed=false;render();
  try{places=await loadPlaces();loaded=true;
   const shown=regionCoverage(searchPlaces(places)).filter(row=>row.shown);
   for(const row of [null,...shown]){const button=node('button','',row?row.name+' ('+row.usable.toLocaleString()+')':'All ('+searchPlaces(places).length.toLocaleString()+')');button.type='button';button.setAttribute('aria-label',row?.name||'All');button.setAttribute('aria-pressed',String(row===region));button.onclick=()=>{region=row;page=0;for(const other of regions.children)other.setAttribute('aria-pressed',String(other===button));render();};regions.append(button);}
  }catch{failed=true;}
  loading=false;render();
 }
 search.addEventListener('input',()=>{page=0;render();});retry.addEventListener('click',()=>{void load();});
 function move(offset){page+=offset;render();count.scrollIntoView({block:'start'});}
 previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 window.addEventListener('viewchange',event=>{if(event.detail==='places')void load();});
 render();if(!host.hidden)void load();
}
