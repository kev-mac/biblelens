// Preserve the source's explicit place/verse links. Never infer links from names.
export function placePassageFields(source, verses, books) {
 const bookIds=new Map(books.map(book=>[book.code,book.id]));
 const lookup=new Map(verses.map(verse=>{
  const match=/^(\w+)\.(\d+)\.(\d+)$/.exec(verse.fields.osisRef||'');
  return [verse.id,match&&bookIds.has(match[1])?[bookIds.get(match[1]),+match[2],+match[3]]:null];
 }));
 return new Map(source.map(record=>[record.id,{
  refs:[...new Map((record.fields.verses||[]).map(id=>lookup.get(id)).filter(Boolean).map(ref=>[ref.join(':'),ref])).values()],
  partOf:record.fields.partOf||[]
 }]));
}
