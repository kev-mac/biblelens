// Only explicit person references inside a story's passage AND a named
// participant in its existing title/summary establish a new story link.
export function linkPeopleStories(people, catalog, books) {
 const slug=value=>value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const stories=catalog.flatMap(group=>group.stories.map(story=>({story,book:books.find(book=>book.name===group.book)})));
 return people.map(person=>{
  const names=[person.name,...(person.aliases||[])].filter(name=>name.length>2);
  const linked_stories=stories.flatMap(({story,book})=>{
   const range=/ (\d+):(\d+)\s*[-–]\s*(?:(\d+):)?(\d+)\s*$/.exec(story.passage);
   if(!book||!range)return [];
   const start=Number(range[1])*1000+Number(range[2]),end=Number(range[3]||range[1])*1000+Number(range[4]);
   const overlap=(person.refs||[]).some(([id,ch,v])=>id===book.id&&ch*1000+v>=start&&ch*1000+v<=end);
   const text=story.title+' '+story.summary;
   const named=names.some(name=>new RegExp('(?<![\\p{L}\\p{N}])'+name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\p{L}\\p{N}])','iu').test(text));
   return overlap&&named?[{story_id:slug(book.name)+'-'+slug(story.title),title:story.title,passage:story.passage,route:'#stories/'+slug(book.name)+'/'+slug(story.title)}]:[];
  });
  return {...person,linked_stories};
 });
}
