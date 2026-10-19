import * as L from 'leaflet';
import land from './data/atlas-land.json';
import {loadPlaces,getLocationDetails,createPlaceMatcher,wrapLocationNames} from './places-core.js';
const sheet=document.querySelector('#atlas-sheet'),mapNode=document.querySelector('#atlas-map'),status=document.querySelector('#atlas-status');
let map,marker,anchor,request=0,atlasPlaceId=null;
const close=()=>sheet.close();
document.querySelector('#atlas-close').addEventListener('click',close);
sheet.addEventListener('click',event=>{if(event.target===sheet){const r=sheet.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
sheet.addEventListener('close',()=>{request++;anchor?.setAttribute('aria-expanded','false');if(anchor?.isConnected)anchor.focus({preventScroll:true});});
const resize=new ResizeObserver(()=>{if(sheet.open)map?.invalidateSize({pan:true,animate:false});});resize.observe(mapNode);
let dragY=null;const handle=sheet.querySelector('.commandments-handle');
handle.addEventListener('pointerdown',e=>{dragY=e.clientY;handle.setPointerCapture(e.pointerId);});
handle.addEventListener('pointerup',e=>{if(dragY!==null&&e.clientY-dragY>72)close();dragY=null;});handle.addEventListener('pointercancel',()=>dragY=null);
async function openAtlas(id,button){
 const token=++request;atlasPlaceId=id;anchor?.setAttribute('aria-expanded','false');anchor=button;button.setAttribute('aria-expanded','true');
 document.querySelector('#atlas-name').textContent='Loading place…';document.querySelector('#atlas-names').textContent='';document.querySelector('#atlas-description').textContent='';status.textContent='';mapNode.hidden=true;document.querySelector('#atlas-external').hidden=true;
 if(!sheet.open)sheet.showModal();document.querySelector('#atlas-close').focus({preventScroll:true});sheet.querySelector('.atlas-scroll').scrollTop=0;
 try{
  const place=await getLocationDetails(id);if(token!==request||!sheet.open)return;if(!place)throw Error('This place is not in the reference dataset.');
  document.querySelector('#atlas-name').textContent=place.name;
  document.querySelector('#atlas-names').textContent=[place.modern_name&&`Modern name: ${place.modern_name}`,place.aliases.length&&`Also called ${place.aliases.join(', ')}`].filter(Boolean).join(' · ');
  document.querySelector('#atlas-description').textContent=place.description;
  if(!place.coordinates){status.textContent='Coordinates are unavailable for this location.';return;}
  const {latitude,longitude}=place.coordinates,point=[latitude,longitude];mapNode.hidden=false;
  status.textContent=`${latitude.toFixed(5)}, ${longitude.toFixed(5)} · Dataset location${place.verification?` (${place.verification.toLowerCase()})`:''}. Historical identifications and precision vary. Generalized modern coastlines and lakes provide context, not reconstructed ancient geography. Zoom out for regional context.`;
  const external=document.querySelector('#atlas-external');external.href=`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=12/${latitude}/${longitude}`;external.hidden=false;
  if(!map){
   map=L.map(mapNode,{scrollWheelZoom:false,maxZoom:16});
   L.geoJSON(land,{interactive:false,style:feature=>({color:'#8a9caa',weight:1,fillColor:feature.properties.water?'#dce9f1':'#f1eee3',fillOpacity:1})}).addTo(map);
   map.attributionControl.addAttribution('<a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth</a> · modern outlines');
   L.control.scale({imperial:false}).addTo(map);
   // Labels are the retained English reference names at their supplied locations.
   const labelLayer=L.layerGroup().addTo(map);
   const places=await loadPlaces();
   map.on('moveend',()=>{
    labelLayer.clearLayers();if(map.getZoom()<7)return;
    const used=[map.latLngToContainerPoint(map.getCenter())];
    for(const nearby of places.values()){
     if(!nearby.coordinates||nearby.ambiguous||nearby.id===atlasPlaceId)continue;
     const position=[nearby.coordinates.latitude,nearby.coordinates.longitude];if(!map.getBounds().contains(position))continue;
     const pixel=map.latLngToContainerPoint(position);if(used.some(p=>Math.abs(p.x-pixel.x)<120&&Math.abs(p.y-pixel.y)<32))continue;
     used.push(pixel);const label=document.createElement('span');label.textContent=nearby.name;
     L.circleMarker(position,{radius:3,color:'#425b70',weight:1,fillOpacity:1,interactive:false}).bindTooltip(label,{permanent:true,direction:'top',className:'atlas-place-label'}).addTo(labelLayer);
    }
   });
  }
  map.invalidateSize({pan:true,animate:false});map.setView(point,13,{animate:false});if(marker)marker.setLatLng(point);else marker=L.marker(point,{icon:L.divIcon({className:'atlas-pin',html:'<svg viewBox="0 0 32 44" width="32" height="44" aria-hidden="true"><path fill="#d83b46" stroke="#fff" stroke-width="2" d="M16 42S2 25 2 16a14 14 0 0 1 28 0c0 9-14 26-14 26Z"/><circle cx="16" cy="16" r="5" fill="#fff"/></svg>',iconSize:[40,48],iconAnchor:[20,44]}),keyboard:false}).addTo(map);
  const tooltip=document.createElement('span');tooltip.textContent=place.name;marker.bindTooltip(tooltip,{permanent:true,direction:'top',offset:[0,-42],className:'atlas-place-label'});mapNode.setAttribute('aria-label',`Map of ${place.name}`);
  requestAnimationFrame(()=>{if(token===request&&sheet.open)map.invalidateSize({pan:true,animate:false});});
 }catch(error){if(token!==request)return;document.querySelector('#atlas-name').textContent='Place unavailable';status.textContent=error.message;}
}
// Capture prevents reader verse gestures and citation navigation from handling a chip tap.
document.addEventListener('click',event=>{const chip=event.target.closest('[data-place-id]');if(!chip)return;event.preventDefault();event.stopImmediatePropagation();openAtlas(chip.dataset.placeId,chip);},true);
for(const type of ['pointerdown','dblclick','contextmenu'])document.addEventListener(type,event=>{if(event.target.closest('[data-place-id]'))event.stopImmediatePropagation();},true);
async function initializeChips(){
 try{
  const match=createPlaceMatcher(await loadPlaces());
  const scopes='.verse-body,.story-card > p';
  function decorate(root){
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return node.parentElement.closest('button,a,script,style,textarea,.verse-num,[contenteditable]')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;}}),nodes=[];
   while(walker.nextNode())nodes.push(walker.currentNode);
   for(const node of nodes){if(!match(node.data).length)continue;const template=document.createElement('template');template.innerHTML=wrapLocationNames(node.data,match);node.replaceWith(template.content);}
  }
  const roots=new Set();let queued=false;
  const enqueue=node=>{const el=node.nodeType===1?node:node.parentElement;if(!el)return;const parent=el.closest(scopes);if(parent)roots.add(parent);for(const root of el.querySelectorAll?.(scopes)||[])roots.add(root);if(!queued&&roots.size){queued=true;queueMicrotask(()=>{observer.disconnect();for(const root of roots)if(root.isConnected)decorate(root);roots.clear();queued=false;observer.observe(document.body,{childList:true,subtree:true,characterData:true});});}};
  const observer=new MutationObserver(records=>{for(const record of records){if(record.type==='characterData')enqueue(record.target);else for(const node of record.addedNodes)enqueue(node);}});
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  enqueue(document.body);
 }catch(error){console.warn('Atlas chips unavailable:',error.message);}
}
initializeChips();
