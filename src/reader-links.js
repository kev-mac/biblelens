import {wrapReferenceNames} from './people-links.js';
// Red letters and user highlights can split text nodes. Keep those exact
// boundaries and link only complete names inside the current text segment.
window.BibleLensReaderLinks={html(text,hits=[],offset=0){
 const local=hits.filter(hit=>hit.start>=offset&&hit.end<=offset+text.length).map(hit=>({...hit,start:hit.start-offset,end:hit.end-offset}));
 return wrapReferenceNames(text,()=>local.filter(hit=>!hit.person),()=>local.filter(hit=>hit.person),{scope:'reader'});
}};
