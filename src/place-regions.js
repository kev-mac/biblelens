// Conservative geographic windows, not ancient borders. One sourced table.
// Pleiades Galilaea bounding box, accessed 2026-10-29 (CC BY 3.0).
// Its coarse window crosses historical regional boundaries: do not expose a chip
// unless >=80% of candidate points are verified, unambiguous and typed, with >=5.
export const regionWindows=[{name:'Galilee',bbox:[35,32.5,35.5,33],source:'https://pleiades.stoa.org/places/678145',minimum:5,coverage:.8}];
export const inWindow=(place,region)=>!!place.coordinates&&place.coordinates.longitude>=region.bbox[0]&&place.coordinates.latitude>=region.bbox[1]&&place.coordinates.longitude<=region.bbox[2]&&place.coordinates.latitude<=region.bbox[3];
export const usableRegionPoint=place=>place.verification==='VERIFIED'&&!place.ambiguous&&!!place.featureType&&place.precision!=='Unlocated';
export function regionCoverage(places){return regionWindows.map(region=>{const candidates=places.filter(place=>inWindow(place,region)),usable=candidates.filter(usableRegionPoint);return {...region,candidates:candidates.length,usable:usable.length,shown:usable.length>=region.minimum&&usable.length/candidates.length>=region.coverage};});}
