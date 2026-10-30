import {passageReference} from './story-topics.mjs';

// Editorial Event headings travel beside scripture, never inside its text.
export function eventHeadings(catalog, books) {
 const chapters={};
 for(const group of catalog)for(const story of group.stories){
  for(const passage of story.passages?.length?story.passages:[story.passage]){
   const [book,chapter,verse]=passageReference(passage,books),key=book+':'+chapter;
   const verses=chapters[key]||={};
   const titles=verses[verse]||=[];
   const title=story.title.replace(/\bCommandments\b/g,'Laws');
   if(!titles.includes(title))titles.push(title);
  }
 }
 return chapters;
}
