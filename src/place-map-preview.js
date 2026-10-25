import {atlasPreviewLand} from './data/atlas-preview-land.js';

// Modern geographical context from the same vendored Natural Earth geometry
// used by the atlas. These previews do not claim ancient borders or locations.
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function clipRing(ring,bounds){
 let points=ring;
 for(const [axis,bound,sign] of [[0,bounds.west,1],[0,bounds.east,-1],[1,bounds.south,1],[1,bounds.north,-1]]){
  const output=[];
  for(let i=0;i<points.length;i++){
   const a=points[i],b=points[(i+1)%points.length],insideA=(a[axis]-bound)*sign>=0,insideB=(b[axis]-bound)*sign>=0;
   if(insideA)output.push(a);
   if(insideA!==insideB){const t=(bound-a[axis])/(b[axis]-a[axis]);output.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}
  }
  points=output;if(!points.length)break;
 }
 return points;
}
export function placePreviewGeometry(place){
 if(!place.coordinates)return null;
 const {latitude,longitude}=place.coordinates;
 const halfHeight=place.featureType==='Region'?7:3.5;
 const halfWidth=halfHeight*2.15/Math.cos(latitude*Math.PI/180);
 const bounds={west:longitude-halfWidth,east:longitude+halfWidth,south:latitude-halfHeight,north:latitude+halfHeight};
 const project=([x,y])=>[(x-bounds.west)/(bounds.east-bounds.west)*600,(bounds.north-y)/(bounds.north-bounds.south)*280];
 const paths={land:[],water:[]};
 for(const feature of atlasPreviewLand){
  const [west,south,east,north]=feature.bbox;
  if(east<bounds.west||west>bounds.east||north<bounds.south||south>bounds.north)continue;
  const path=feature.rings.map(ring=>clipRing(ring,bounds)).filter(ring=>ring.length>=3).map(ring=>'M'+ring.map(point=>project(point).map(n=>n.toFixed(1)).join(' ')).join('L')+'Z').join('');
  if(path)paths[feature.water?'water':'land'].push(path);
 }
 return {...paths,bounds,point:project([longitude,latitude])};
}
export function placePreviewSVG(place){
 const geometry=placePreviewGeometry(place);if(!geometry)return '';
 const {point:[x,y]}=geometry;
 return `<svg viewBox="0 0 600 280" aria-hidden="true" focusable="false"><rect class="place-map-water" width="600" height="280"/><path class="place-map-land" fill-rule="evenodd" d="${geometry.land.join('')}"/><path class="place-map-water" fill-rule="evenodd" d="${geometry.water.join('')}"/><g class="place-map-grid"><path d="M0 70H600M0 140H600M0 210H600M100 0V280M200 0V280M300 0V280M400 0V280M500 0V280"/></g><g class="place-map-compass"><path d="M559 54V28M554 35L559 28 564 35"/><text x="559" y="20" text-anchor="middle">N</text></g><circle class="place-map-halo" cx="${x}" cy="${y}" r="25"/><circle class="place-map-pin" cx="${x}" cy="${y}" r="7"/><text class="place-map-name" x="${x}" y="${y+49}" text-anchor="middle">${escapeHTML(place.name)}</text></svg>`;
}
