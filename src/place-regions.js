// Broad browsing windows, NEVER ancient borders or claims of secure identification.
// bbox = [west, south, east, north], half-open so shared edges never overlap.
// Editorial edges trim the coordinate clusters in the attributed Theographic
// snapshot below. Sources establish geographic context, not these exact edges.
// Combined labels include adjoining coast/desert areas rather than misnaming them.
const snapshot='https://github.com/robertrouse/theographic-bible-metadata/blob/52e049efb3b95e4f1da52d11a3303fbd2d648922/json/places.json';
export const regionWindows=[
 {name:'Galilee & Northern Coast',bbox:[34.8,32.55,35.65,33.15],source:'https://pleiades.stoa.org/places/678145'},
 {name:'Samaria & Central Coast',bbox:[34.8,32,35.55,32.55],source:'https://pleiades.stoa.org/places/678369'},
 {name:'Judea, Negev & Southern Coast',bbox:[34.2,29.5,35.55,32],source:snapshot},
 {name:'Transjordan',bboxes:[[35.55,29.5,37,32.55],[35.65,32.55,37,33.15]],source:snapshot},
 {name:'Phoenicia, Syria & Upper Jordan',bbox:[35,33.15,38.5,36.8],source:snapshot},
 {name:'Egypt & Sinai',bbox:[24,22,34.2,31.6],source:'https://pleiades.stoa.org/places/981503'},
 {name:'Mesopotamia & Persia',bbox:[38.5,28,56,40],source:snapshot},
 {name:'Asia Minor & Nearby Islands',bbox:[26,36.8,38.5,42],source:'https://assets.press.princeton.edu/chapters/s10702.pdf'},
 {name:'Greece, Rome & Adriatic',bbox:[11,35,26,44],source:snapshot}
];
export const inWindow=(place,region)=>!!place.coordinates&&(region.bboxes||[region.bbox]).some(box=>place.coordinates.longitude>=box[0]&&place.coordinates.latitude>=box[1]&&place.coordinates.longitude<box[2]&&place.coordinates.latitude<box[3]);
// UNVERIFIED is not a dispute flag. A missing feature type is not uncertainty.
export const usableRegionPoint=place=>!!place.coordinates&&!place.ambiguous&&!place.identificationUncertain&&!/NOT_IDENTIFIABLE|UNCERTAIN|DISPUTED/i.test(place.verification||'')&&place.precision!=='Unlocated';
export function regionCoverage(places){
 const rows=regionWindows.map(region=>({...region,candidates:places.filter(place=>inWindow(place,region)).length,usable:places.filter(place=>usableRegionPoint(place)&&inWindow(place,region)).length}));
 const assigned=rows.reduce((n,row)=>n+row.usable,0),coverage=places.length?assigned/places.length:0;
 return rows.map(row=>({...row,totalAssigned:assigned,totalCoverage:coverage,shown:coverage>=.7&&row.usable>=15}));
}
