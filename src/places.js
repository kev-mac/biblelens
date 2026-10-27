import atlasStyle from './data/atlas-style.json';
import {loadPlaces,getLocationDetails,createPlaceMatcher,wrapLocationNames,atlasDescription} from './places-core.js';
const sheet=document.querySelector('#atlas-sheet'),mapNode=document.querySelector('#atlas-map'),status=document.querySelector('#atlas-status');
let map,marker,anchor,request=0,workerURL,mapFailed=false;
const close=()=>sheet.close();
document.querySelector('#atlas-close').addEventListener('click',close);
sheet.addEventListener('click',event=>{if(event.target===sheet){const r=sheet.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
sheet.addEventListener('close',()=>{request++;anchor?.setAttribute('aria-expanded','false');if(anchor?.isConnected)anchor.focus({preventScroll:true});});
const resize=new ResizeObserver(()=>{if(sheet.open)map?.resize();});resize.observe(mapNode);
const mapNotice=document.createElement('p');mapNotice.className='atlas-map-notice';mapNotice.setAttribute('role','status');mapNode.after(mapNotice);
// Identification limits belong beside the map, not only in collapsed sources.
const identification=document.createElement('p');identification.className='atlas-identification';identification.setAttribute('role','status');mapNode.before(identification);
document.querySelector('#atlas-close').textContent='Close';
document.querySelector('#atlas-sources summary').textContent='Sources & identification';
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
 document.querySelector('#atlas-sources').open=false;
 const token=++request;anchor?.setAttribute('aria-expanded','false');anchor=button;button.setAttribute('aria-expanded','true');
 document.querySelector('#atlas-name').classList.add('loading-state');document.querySelector('#atlas-name').textContent='Loading place…';document.querySelector('#atlas-names').textContent='';document.querySelector('#atlas-description').textContent='';document.querySelector('#atlas-description').hidden=true;status.textContent='';mapNotice.classList.remove('loading-state');mapNotice.textContent='';identification.textContent='';mapNode.hidden=true;document.querySelector('#atlas-external').hidden=true;
 if(!sheet.open)sheet.showModal();document.querySelector('#atlas-close').focus({preventScroll:true});sheet.querySelector('.atlas-scroll').scrollTop=0;
 try{
  const place=await getLocationDetails(id);if(token!==request||!sheet.open)return;if(!place)throw Error('This place is not in the reference dataset.');
  document.querySelector('#atlas-name').classList.remove('loading-state');document.querySelector('#atlas-name').textContent=place.name;
  document.querySelector('#atlas-names').textContent=[place.modern_name&&`Modern name: ${place.modern_name}`,place.aliases.length&&`Also called ${place.aliases.join(', ')}`].filter(Boolean).join(' · ');
  const description=document.querySelector('#atlas-description');description.textContent=atlasDescription(place);description.hidden=!description.textContent;
  if(!place.coordinates){status.textContent='Coordinates are unavailable for this location.';identification.textContent=status.textContent;return;}
  const {latitude,longitude}=place.coordinates,point=[longitude,latitude];mapNode.hidden=false;
  const approximate=place.verification!=='VERIFIED'||!['Precise','Center'].includes(place.precision);
  identification.textContent=approximate?'Approximate reference point · Ancient identification is uncertain. The map shows modern geographical context.':'Dataset reference point · Historical identifications vary. The map shows modern geographical context.';
  status.textContent=`${latitude.toFixed(5)}, ${longitude.toFixed(5)} · Dataset location${place.verification?` (${place.verification.toLowerCase()})`:''}. ${approximate?'This is an approximate reference point, not a confirmed ancient site. ':''}Historical identifications and precision vary. Map labels and boundaries show modern geographical context, not reconstructed ancient geography.`;
  const external=document.querySelector('#atlas-external');external.href=`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=7/${latitude}/${longitude}`;external.hidden=false;
  mapNotice.classList.add('loading-state');mapNotice.textContent='Loading geographical context…';
  try{
   const modulePath='/vendor/maplibre-gl.mjs';
   const [M]=await Promise.all([import(modulePath),window.BibleLensFeatures.style('/vendor/maplibre-gl.css')]);if(token!==request||!sheet.open)return;
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
    map.on('idle',()=>{if(!mapFailed&&map.areTilesLoaded()){mapNotice.classList.remove('loading-state');mapNotice.textContent='';}});
    map.on('error',()=>{mapFailed=true;mapNotice.classList.remove('loading-state');mapNotice.textContent='Some map detail could not load. An internet connection is needed for geographical context. Place details remain available below.';});
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
  }catch(error){mapNode.hidden=true;mapNotice.classList.remove('loading-state');mapNotice.textContent='The interactive map is unavailable on this device. Place details and the external map link remain available.';}

 }catch(error){if(token!==request)return;document.querySelector('#atlas-name').classList.remove('loading-state');document.querySelector('#atlas-name').textContent='Place unavailable';status.textContent=error.message;identification.textContent=error.message;}
}
window.BibleLensAtlas={open:openAtlas};
