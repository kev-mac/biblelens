import atlasStyle from './data/atlas-style.json';
import {loadPlaces,getLocationDetails,createPlaceMatcher,wrapLocationNames} from './places-core.js';
const sheet=document.querySelector('#atlas-sheet'),mapNode=document.querySelector('#atlas-map'),status=document.querySelector('#atlas-status');
let map,marker,anchor,request=0,workerURL,mapFailed=false;
const close=()=>sheet.close();
document.querySelector('#atlas-close').addEventListener('click',close);
sheet.addEventListener('click',event=>{if(event.target===sheet){const r=sheet.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
sheet.addEventListener('close',()=>{request++;anchor?.setAttribute('aria-expanded','false');if(anchor?.isConnected)anchor.focus({preventScroll:true});});
const resize=new ResizeObserver(()=>{if(sheet.open)map?.resize();});resize.observe(mapNode);
const mapNotice=document.createElement('p');mapNotice.className='atlas-map-notice';mapNotice.setAttribute('role','status');mapNode.after(mapNotice);
function colorMap(){
 if(!map?.isStyleLoaded())return;
 const dark=document.body.classList.contains('dark');
 for(const layer of atlasStyle.layers){
  if(layer.type==='background')map.setPaintProperty(layer.id,'background-color',dark?'#23313a':'#f4f1e8');
  if(layer.id==='water')map.setPaintProperty(layer.id,'fill-color',dark?'#17232f':'#bfddea');
  if(layer.type==='symbol'){
   map.setPaintProperty(layer.id,'text-color',dark?'#d7e4e9':'#294458');
   map.setPaintProperty(layer.id,'text-halo-color',dark?'#23313a':'#f4f1e8');
  }
 }
}
new MutationObserver(colorMap).observe(document.body,{attributes:true,attributeFilter:['class']});
async function openAtlas(id,button){
 const token=++request;anchor?.setAttribute('aria-expanded','false');anchor=button;button.setAttribute('aria-expanded','true');
 document.querySelector('#atlas-name').textContent='Loading place…';document.querySelector('#atlas-names').textContent='';document.querySelector('#atlas-description').textContent='';status.textContent='';mapNotice.textContent='';mapNode.hidden=true;document.querySelector('#atlas-external').hidden=true;
 if(!sheet.open)sheet.showModal();document.querySelector('#atlas-close').focus({preventScroll:true});sheet.querySelector('.atlas-scroll').scrollTop=0;
 try{
  const place=await getLocationDetails(id);if(token!==request||!sheet.open)return;if(!place)throw Error('This place is not in the reference dataset.');
  document.querySelector('#atlas-name').textContent=place.name;
  document.querySelector('#atlas-names').textContent=[place.modern_name&&`Modern name: ${place.modern_name}`,place.aliases.length&&`Also called ${place.aliases.join(', ')}`].filter(Boolean).join(' · ');
  document.querySelector('#atlas-description').textContent=place.description;
  if(!place.coordinates){status.textContent='Coordinates are unavailable for this location.';return;}
  const {latitude,longitude}=place.coordinates,point=[longitude,latitude];mapNode.hidden=false;
  const approximate=place.verification!=='VERIFIED'||!['Precise','Center'].includes(place.precision);
  status.textContent=`${latitude.toFixed(5)}, ${longitude.toFixed(5)} · Dataset location${place.verification?` (${place.verification.toLowerCase()})`:''}. ${approximate?'This is an approximate reference point, not a confirmed ancient site. ':''}Historical identifications and precision vary. Map labels and boundaries show modern geographical context, not reconstructed ancient geography.`;
  const external=document.querySelector('#atlas-external');external.href=`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=7/${latitude}/${longitude}`;external.hidden=false;
  mapNotice.textContent='Loading geographical context…';
  try{
   const modulePath='/vendor/maplibre-gl.mjs';
   const M=await import(modulePath);if(token!==request||!sheet.open)return;
   if(mapFailed&&map){map.remove();map=null;marker=null;mapFailed=false;}
   if(!map){
    // Use a local module worker blob on web and Capacitor's custom origin.
    // The library's HTTP-only URL inference cannot locate a native worker.
    if(!workerURL){
     const response=await fetch('/vendor/maplibre-gl-worker.mjs');if(!response.ok)throw Error('Map worker unavailable');
     workerURL=URL.createObjectURL(new Blob([await response.text()],{type:'application/javascript'}));
    }
    M.setWorkerUrl(workerURL);
    if(token!==request||!sheet.open)return;
    map=new M.Map({container:mapNode,style:atlasStyle,center:point,zoom:4,maxZoom:12,attributionControl:false,renderWorldCopies:false,pitchWithRotate:false,dragRotate:false});
    map.scrollZoom.disable();map.touchZoomRotate.disableRotation();
    map.addControl(new M.NavigationControl({showCompass:false}),'top-left');
    map.addControl(new M.ScaleControl({unit:'metric'}),'bottom-left');
    map.addControl(new M.AttributionControl({compact:false}),'bottom-right');
    map.on('load',colorMap);
    map.on('idle',()=>{if(!mapFailed&&map.areTilesLoaded())mapNotice.textContent='';});
    map.on('error',()=>{mapFailed=true;mapNotice.textContent='Some map detail could not load. An internet connection is needed for geographical context. Place details remain available below.';});
   }
   const baseZoom=place.featureType==='City'?8:place.featureType==='Region'||place.name==='India'?4.2:approximate?5:7;
   const zoom=baseZoom+Math.min(0,Math.log2(Math.max(240,mapNode.clientWidth)/536));
   map.resize();map.jumpTo({center:point,zoom});
   if(marker)marker.remove();
   const pin=document.createElement('div');pin.className='atlas-reference-pin';
   const label=document.createElement('span');label.textContent=place.name+(approximate?' · approximate':'');pin.append(label);
   const dot=document.createElement('span');dot.className='atlas-reference-dot';pin.append(dot);
   marker=new M.Marker({element:pin,anchor:'bottom'}).setLngLat(point).addTo(map);
   mapNode.setAttribute('aria-label',`Modern geographical context for ${place.name}`);
   map.getCanvas().setAttribute('aria-label',`Map of ${place.name}. Use arrow keys to pan and plus or minus to zoom.`);
   requestAnimationFrame(()=>{if(token===request&&sheet.open)map.resize();});
  }catch(error){mapNode.hidden=true;mapNotice.textContent='The interactive map is unavailable on this device. Place details and the external map link remain available.';}

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
