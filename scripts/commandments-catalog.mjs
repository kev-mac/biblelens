import fs from 'node:fs';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
let source,books,chapters;
const names={'Ex.':'Exodus','Lev.':'Leviticus','Num.':'Numbers','Deut.':'Deuteronomy','Dent.':'Deuteronomy','Gen.':'Genesis'};
function roman(s){let n=0,last=0;for(const c of [...s].reverse()){const v={i:1,v:5,x:10,l:50,c:100,d:500,m:1000}[c];n+=v<last?-v:v;last=v;}return n;}
function references(text){
 let book,chapter;const refs=[];
 for(const match of text.matchAll(/(Ex\.|Lev\.|Num\.|Deut\.|Dent\.|Gen\.)|\b([ivxlcdm]+)[.,]\s*(\d+(?:-\d+)?(?:,\s*\d+(?:-\d+)?)*)/g)){
  if(match[1]){book=names[match[1]];continue;}
  chapter=roman(match[2]);if(!book)continue;
  for(const number of match[3].split(/,\s*/)){const verse=+number.split('-')[0];refs.push(`${book} ${chapter}:${verse}`);}
 }
 return [...new Set(refs)];
}
function verse(reference){const m=/^(.*?) (\d+):(\d+)$/.exec(reference),book=books.find(b=>b.name===m?.[1]);const key=book&&`${book.id}:${+m[2]}`;assert(chapters[key],`Missing chapter: ${reference}`);const v=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64'))).verses.find(v=>v.n===+m[3]);assert(v?.kjv,`Missing verse: ${reference}`);return v.kjv;}
export function buildCommandmentsCatalog(){
 source=JSON.parse(fs.readFileSync('data/reference/commandments-source.json','utf8'));
 books=JSON.parse(fs.readFileSync('data/books.json','utf8'));
 chapters=JSON.parse(fs.readFileSync('data/chapters.json','utf8'));
 const records=[];
 for(const [index,rows] of source.sections.entries()){
  const prefix=index?'N':'P',polarity=index?'Negative':'Positive';
  for(const row of rows){
   const sourceTitle=row.text.split(/\s+(?:Ex\.|Lev\.|Num\.|Deut\.|Dent\.|Gen\.)/)[0].replace(/\s+"Sha-'aṭnez,"$/,'').replace(/\.$/,'');
   const titles=row.start===row.end?[sourceTitle]:source.expandedTitles[prefix+row.start];
   assert.equal(titles?.length,row.end-row.start+1,`Missing expanded titles ${prefix+row.start}`);
   for(let i=0;i<titles.length;i++){
    const number=row.start+i,code=prefix+number;
    const refs=source.referenceCorrections?.[code]||references(row.text);assert(refs.length,`No references: ${code}`);
    for(const ref of refs)verse(ref);
    const title=source.titleCorrections?.[code]||titles[i],lower=title.toLowerCase();
    const topics=[];
    const topicRules={Worship:/god|lord|holy name|prayer|pray|shema|tefillin|mezuzah|ẓiẓit|law for oneself/,Idolatry:/idol|moloch|stars and planets|necroman|divination|sorcer|witch|enchant|omen|astrolog|familiar spirit/,Priesthood:/priest|aaron|levite|sanctuary|high priest|temple|ephod|breastplate/,Sacrifice:/offer|sacrif|altar|incense|consecrat|paschal/,Purity:/unclean|purif|lepro|leper|corpse|contamin|menstru|discharge/,Food:/eat|food|milk|blood|slaughter|fish|grape|grain|flesh/,Agriculture:/field|harvest|glean|vineyard|seed|land|tithe|first.fruit|sow|reap|produce|corn|jubilee/,Poverty:/poor|alms|stranger|widow|orphan|glean/,Business:/wage|hire|lend|loan|debt|pledge|buy|sell|buyer|seller|interest|usury|weight|measure|rob|steal|plunder|restitution|property/,Justice:/judg|court|witness|testim|innocent|murder|kill|manslay|execut|penalt|punish|fine|rescue|persecut|bribe|claim|damage/,Family:/\b(?:wife|husband|parent|father|mother|sister|brother|daughter|son|incest|sexual|relations|virgin|bride)|marri|divorc|adulter|circumcis/,Sabbath:/sabbath/,Festivals:/passover|sukkot|shebu|shavuot|tishri|atonement|feast|festival|leaven|booths/,Vows:/vow|nazirite|nazarite|oath|swear/,Community:/king|prophet|camp|war|battle|enemy|nation|sanhedrin|wise|neighbor|neighbour/};
    for(const [topic,pattern] of Object.entries(topicRules))if(pattern.test(lower))topics.push(topic);
    if(!topics.length)topics.push('Law and practice');
    // These labels are browsing aids. No new present-day halakhic ruling is inferred.
    const applicability=['Context dependent'];
    if(/priest|aaron|levite|king|judge|court|sanhedrin|worker|hireling|nazirite|nazarite/.test(lower))applicability.push('Specific Roles');
    if(/temple|sanctuary|sacrific|altar|offering|consecrat/.test(lower))applicability.push('Temple Era Only');
    if(/field|tithe|harvest|glean|jubilee|seventh.year|vineyard|first.fruit/.test(lower))applicability.push('Land of Israel Only');
    if(source.generalDuties.includes(code))applicability.push('Universal / Today');
    const humanity=topics.some(t=>['Business','Justice','Family','Poverty'].includes(t));
    records.push({id:records.length+1,code,number,title,passage:refs[0],references:refs,summary:verse(refs[0]),summaryEdition:'KJV',taxonomy:{polarity,sphere:humanity?'Humanity':'God',applicability,topics},lens:source.lenses[code]||[],sourceGroup:`${prefix}${row.start}${row.end===row.start?'':'–'+row.end}`});
   }
  }
 }
 assert.equal(records.length,613);assert.equal(new Set(records.map(r=>r.code)).size,613);
 return {enumeration:source.edition,sourceUrl:source.sourceUrl,authors:source.authors,rights:source.rights,numberingNote:'P1–P248 and N1–N365 follow the historical Jewish Encyclopedia list. Some positions differ from other editions. Linked KJV passages provide context for traditional interpretations; they do not always explicitly state the entire rule. Applicability and topic filters are browsing aids, not rulings on practice today.',records};
}
export function validateCommandmentsCatalog(){const expected=buildCommandmentsCatalog(),actual=JSON.parse(fs.readFileSync('data/commandments-catalog.json','utf8'));assert.deepEqual(actual,expected,'Catalog must match its retained source and adaptations');return actual.records.length;}
if(process.argv.includes('--write'))fs.writeFileSync('data/commandments-catalog.json',JSON.stringify(buildCommandmentsCatalog(),null,2)+'\n');
