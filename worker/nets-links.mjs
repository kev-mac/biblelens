// Book-level links verified against the official NETS electronic edition index.
// Copyrighted NETS PDFs/text are never packaged. A reading link is not a claim
// that NETS prints or supports a record's existing Greek quotation/numbering.
const NETS_FILES=['01-gen','02-exod','03-leu','04-num','05-deut','06-iesous','07-judges','08-routh','09-1reigns','10-2reigns','11-3reigns','12-4reigns','13-1suppl','14-2suppl','16-2esdras','16-2esdras','17-esther','28-iob','24-ps','25-proverbs','26-eccles','27-song','33-esaias','34-ieremias','36-lam','38-iezekiel','40-daniel',...Array(12).fill('32-twelve')];
function netsReadingSource(ref){
 const parsed=parseRef(ref);if(!parsed||!NETS_FILES[parsed.book])return null;
 return {label:BOOKS[parsed.book].name+' — NETS (English reading)',url:'https://septuaginta.uni-goettingen.de/static/ioscs/pdf/nets/'+NETS_FILES[parsed.book]+'-nets.pdf',kind:'English reading reference · NETS'};
}
function comparisonReadingSources(record){
 const sources=record.sources||[];
 if(!record.witness?.includes('Septuagint')&&!sources.some(s=>/grcbrent|Brenton/i.test(s.url+' '+s.label)))return sources;
 const english=netsReadingSource(record.ref);return english?[english,...sources]:sources;
}
function withNetsReadingLinks(sources){
 const result=[...sources];
 for(const source of sources){
  if(!/grcbrent|Brenton/i.test(source.url+' '+source.label))continue;
  const english=netsReadingSource(source.label);if(english&&!result.some(s=>s.url===english.url))result.push({...english,id:result.length+1});
 }
 return result;
}
