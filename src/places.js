import {directorySaveButton} from './directory-save.js';
import books from '../data/books.json' with {type:'json'};
import atlasStyle from './data/atlas-style.json';
import {loadPlaces,getLocationDetails,createPlaceMatcher,wrapLocationNames,atlasDescription} from './places-core.js';
const sheet=document.querySelector('#atlas-sheet'),mapNode=document.querySelector('#atlas-map'),status=document.querySelector('#atlas-status');
const passageDetails=document.createElement('details');passageDetails.id='atlas-passages';passageDetails.className='atlas-sources';passageDetails.hidden=true;document.querySelector('#atlas-sources').before(passageDetails);
let map,marker,anchor,request=0,workerURL,mapFailed=false,mapTimer;
const close=()=>sheet.close();
function themedStyle(){const style=structuredClone(atlasStyle),dark=document.body.classList.contains('dark');if(dark)for(const layer of style.layers){const paint=layer.paint||{};if(layer.type==='background')paint['background-color']='#23313a';if(layer.type==='fill')paint['fill-color']='#17232f';if(layer.type==='line')paint['line-color']='#526573';if(layer.type==='symbol'){paint['text-color']='#d7e4e9';paint['text-halo-color']='#23313a';}}return style;}
document.querySelector('#atlas-close').addEventListener('click',close);
sheet.addEventListener('click',event=>{if(event.target===sheet){const r=sheet.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
sheet.addEventListener('close',()=>{clearTimeout(mapTimer);request++;anchor?.setAttribute('aria-expanded','false');if(anchor?.isConnected)anchor.focus({preventScroll:true});});
const resize=new ResizeObserver(()=>{if(sheet.open)map?.resize();});resize.observe(mapNode);
const mapNotice=document.createElement('p');mapNotice.className='atlas-map-notice';mapNotice.setAttribute('role','status');mapNode.after(mapNotice);
// Identification limits belong beside the map, not only in collapsed sources.
const identification=document.createElement('p');identification.className='atlas-identification';identification.setAttribute('role','status');mapNode.before(identification);

document.querySelector('#atlas-sources summary').textContent='Sources & Identification';
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
 sheet.querySelector('.directory-save')?.remove();
 passageDetails.hidden=true;passageDetails.open=false;passageDetails.replaceChildren();
 document.querySelector('#atlas-sources').open=false;document.querySelectorAll('.atlas-map-controls').forEach(node=>node.hidden=true);
 const token=++request;anchor?.setAttribute('aria-expanded','false');anchor=button;button.setAttribute('aria-expanded','true');
 document.querySelector('#atlas-name').classList.add('loading-state');document.querySelector('#atlas-name').textContent='Loading place…';document.querySelector('#atlas-names').textContent='';document.querySelector('#atlas-description').textContent='';document.querySelector('#atlas-description').hidden=true;status.textContent='';mapNotice.classList.remove('loading-state');mapNotice.textContent='';identification.textContent='';mapNode.hidden=true;document.querySelector('#atlas-external').hidden=true;
 if(!sheet.open)sheet.showModal();document.querySelector('#atlas-close').focus({preventScroll:true});sheet.querySelector('.atlas-scroll').scrollTop=0;
 try{
  const place=await getLocationDetails(id);if(token!==request||!sheet.open)return;if(!place)throw Error('This place is not in the reference dataset.');
  document.querySelector('#atlas-name').classList.remove('loading-state');document.querySelector('#atlas-name').textContent=place.name;
  const save=directorySaveButton('place',id,place.name);save.title='Save place';document.querySelector('#atlas-names').after(save);
  document.querySelector('#atlas-names').textContent=[place.modern_name&&`Modern Name: ${place.modern_name}`,place.aliases.length&&`Also called ${place.aliases.join(', ')}`].filter(Boolean).join(' · ');
  const description=document.querySelector('#atlas-description');description.textContent=atlasDescription(place);description.hidden=!description.textContent;
  const refs=(place.refs||[]).filter(([book,chapter,verse])=>books[book]&&Number.isInteger(chapter)&&Number.isInteger(verse));
  if(refs.length){
   const summary=document.createElement('summary');summary.textContent='Linked Passages ('+refs.length.toLocaleString()+')';passageDetails.append(summary);
   const list=document.createElement('ul');passageDetails.append(list);
   for(const [book,chapter,verse]of refs){const row=document.createElement('li'),link=document.createElement('a');link.href='#read/'+book+'/'+chapter+'/'+verse;link.textContent=books[book].name+' '+chapter+':'+verse;link.onclick=close;link.style.display='inline-flex';link.style.alignItems='center';link.style.minHeight='44px';row.append(link);list.append(row);}
   passageDetails.hidden=false;
  }
  if(!place.coordinates){identification.textContent='Location unknown';return;}
  const {latitude,longitude}=place.coordinates,point=[longitude,latitude];mapNode.hidden=false;document.querySelectorAll('.atlas-map-controls').forEach(node=>node.hidden=false);
  const approximate=place.verification!=='VERIFIED'||!['Precise','Center'].includes(place.precision);
  identification.textContent=approximate?'Approximate reference point · Ancient identification is uncertain. The map shows modern geographical context.':'Dataset reference point · Historical identifications vary. The map shows modern geographical context.';
  status.textContent=`${latitude.toFixed(5)}, ${longitude.toFixed(5)} · Dataset location${place.verification?` (${place.verification.toLowerCase()})`:''}. ${approximate?'This is an approximate reference point, not a confirmed ancient site. ':''}Historical identifications and precision vary. Map labels and boundaries show modern geographical context, not reconstructed ancient geography.`;
  const external=document.querySelector('#atlas-external');external.href=`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=7/${latitude}/${longitude}`;external.hidden=false;
  mapNotice.classList.add('loading-state');mapNotice.textContent='Loading geographical context…';mapNode.classList.add('atlas-loading');clearTimeout(mapTimer);mapTimer=setTimeout(()=>{if(token!==request||!sheet.open)return;mapNode.classList.remove('atlas-loading');mapNotice.classList.remove('loading-state');mapNotice.textContent='Map details have not loaded. Check your connection or use the external map link.';},12000);
  try{
   const modulePath='/vendor/maplibre-gl.mjs';
   const [M]=await Promise.all([import(modulePath),window.BibleLensFeatures.style('/vendor/maplibre-gl.css')]);if(token!==request||!sheet.open)return;
   if(mapFailed&&map){document.querySelectorAll('.atlas-map-controls').forEach(node=>node.remove());map.remove();map=null;marker=null;mapFailed=false;}
   if(!map){
    // Web uses a same-origin worker; Capacitor needs a local module blob.
    // The library's HTTP-only URL inference cannot locate a native worker.
    if(!workerURL && !document.documentElement.classList.contains('native-ios'))workerURL=new URL('/vendor/maplibre-gl-worker.mjs',location.href).href;
    if(!workerURL){
     const response=await fetch('/vendor/maplibre-gl-worker.mjs');if(!response.ok)throw Error('Map worker unavailable');
     workerURL=URL.createObjectURL(new Blob([await response.text()],{type:'application/javascript'}));
    }
    M.setWorkerUrl(workerURL);
    if(token!==request||!sheet.open)return;
    map=new M.Map({container:mapNode,style:themedStyle(),center:point,zoom:4,maxZoom:12,attributionControl:false,renderWorldCopies:false,pitchWithRotate:false,dragRotate:false});
    map.scrollZoom.disable();map.touchZoomRotate.disableRotation();
    map.addControl(new M.NavigationControl({showCompass:false}),'top-left');
    map.addControl(new M.ScaleControl({unit:'metric'}),'bottom-left');
    map.addControl(new M.AttributionControl({compact:false}),'bottom-right');
    const controls=document.createElement('div');controls.className='atlas-map-controls';mapNode.after(controls);for(const corner of ['bottom-left','bottom-right']){const node=mapNode.querySelector('.maplibregl-ctrl-'+corner);if(node)controls.append(node);}
    map.on('load',colorMap);
    map.on('idle',()=>{if(!mapFailed&&map.areTilesLoaded()){clearTimeout(mapTimer);mapNode.classList.remove('atlas-loading');mapNotice.classList.remove('loading-state');mapNotice.textContent='';}});
    map.on('error',()=>{clearTimeout(mapTimer);mapNode.classList.remove('atlas-loading');mapFailed=true;mapNotice.classList.remove('loading-state');mapNotice.textContent='Some map detail could not load. An internet connection is needed for geographical context. Place details remain available below.';});
   }
   const baseZoom=place.featureType==='City'?8:place.featureType==='Region'||place.name==='India'?4.2:approximate?5:7;
   const zoom=baseZoom+Math.min(0,Math.log2(Math.max(240,mapNode.clientWidth)/536));
   map.resize();map.jumpTo({center:point,zoom});
   const hideDuplicate=()=>{for(const layer of atlasStyle.layers.filter(layer=>layer.type==='symbol'&&layer['source-layer']==='place'))map.setFilter(layer.id,['all',...(layer.filter?[layer.filter]:[]),['!=',['coalesce',['get','name:en'],['get','name_en'],['get','name:latin'],''],place.name]]);};if(map.isStyleLoaded())hideDuplicate();else map.once('load',hideDuplicate);
   if(marker)marker.remove();
   const pin=document.createElement('div');pin.className='atlas-reference-pin';
   const label=document.createElement('span');label.textContent=place.name+(approximate?' · approximate':'');pin.append(label);
   const dot=document.createElement('span');dot.className='atlas-reference-dot';pin.append(dot);
   marker=new M.Marker({element:pin,anchor:'bottom'}).setLngLat(point).addTo(map);
   mapNode.setAttribute('aria-label',`Modern geographical context for ${place.name}`);
   map.getCanvas().setAttribute('aria-label',`Map of ${place.name}. Use arrow keys to pan and plus or minus to zoom.`);
   requestAnimationFrame(()=>{if(token===request&&sheet.open)map.resize();});
  }catch(error){clearTimeout(mapTimer);mapNode.hidden=true;document.querySelectorAll('.atlas-map-controls').forEach(node=>node.hidden=true);mapNotice.classList.remove('loading-state');mapNotice.textContent='The interactive map is unavailable on this device. Place details and the external map link remain available.';}

 }catch(error){if(token!==request)return;document.querySelector('#atlas-name').classList.remove('loading-state');document.querySelector('#atlas-name').textContent='Place unavailable';status.textContent=error.message;identification.textContent=error.message;}
}
window.BibleLensAtlas={open:openAtlas};
