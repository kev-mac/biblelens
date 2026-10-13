export function validateChapterNames(names,books){
 const expected=new Set(books.map(book=>book.name));let count=0;
 for(const key of Object.keys(names))if(!key.startsWith('_')&&!expected.has(key))throw Error('Unknown chapter-name book: '+key);
 for(const book of books){
  const chapters=names[book.name];
  if(!chapters||typeof chapters!=='object'||Array.isArray(chapters))throw Error('Missing chapter names for '+book.name);
  for(let chapter=1;chapter<=book.chapters;chapter++){
   const name=chapters[chapter];
   if(typeof name!=='string'||!name.trim())throw Error(`Missing chapter name: ${book.name} ${chapter}`);
   count++;
  }
  for(const key of Object.keys(chapters))if(!/^\d+$/.test(key)||Number(key)<1||Number(key)>book.chapters)throw Error(`Unexpected chapter name: ${book.name} ${key}`);
 }
 return count;
}
