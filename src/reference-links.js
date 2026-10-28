import {referenceJson} from './reference-cache.js';
import {createPersonMatcher,wrapReferenceNames} from './people-links.js';
import {loadPlaces,createPlaceMatcher} from './places-core.js';
async function initializeChips(){
 let match=()=>[],matchPeople=()=>[],placesReady=false,peopleReady=false,loading=null;
 const scopes='.verse-body,.story-card p,.category-profile-card[data-profile-people="true"] .comparison-summary>p,.category-profile-card[data-profile-people="true"] .category-profile-panel p';
 function decorate(root){
  if(root.matches?.('.verse-body[data-inline-references="ready"]'))return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];let leadingText='';
  while(walker.nextNode()){
   const node=walker.currentNode;
   if(node.parentElement&&!node.parentElement.closest('button,a,script,style,textarea,.verse-num,[contenteditable]'))nodes.push({node,leadingText});
   leadingText+=node.data;
  }
  for(const {node,leadingText} of nodes){
   if(!node.parentElement||!node.isConnected)continue;
   const body=node.parentElement.closest('.verse-body'),question=node.parentElement.closest('.category-profile-card'),story=node.parentElement.closest('.story-card[data-story-book]');
   const context=body?{book:Number(body.dataset.book),chapter:Number(body.dataset.chapter),verse:Number(body.dataset.verse)}:question?{book:Number(question.dataset.referenceBook),chapter:Number(question.dataset.referenceChapter),verse:Number(question.dataset.referenceVerse)}:story?{scope:'story',placesReady,leadingText,book:Number(story.dataset.storyBook),chapter:Number(story.dataset.storyChapter),verse:Number(story.dataset.storyVerse),endChapter:Number(story.dataset.storyEndChapter),endVerse:Number(story.dataset.storyEndVerse)}:{};
   if(!match(node.data,context).length&&!matchPeople(node.data,context).length)continue;
   const template=document.createElement('template');template.innerHTML=wrapReferenceNames(node.data,match,matchPeople,context);node.replaceWith(template.content);
  }
 }
 const roots=new Set();let queued=false;
 const observerOptions={childList:true,subtree:true,characterData:true};
 function flush(){
  // A second render can replace queued roots before this microtask runs. Its
  // mutation records may not have reached the observer callback yet; disconnect
  // would discard them and leave the replacement story permanently unlinked.
  collectRecords(observer.takeRecords());
  observer.disconnect();
  const pending=[...roots];roots.clear();
  try{
   for(const root of pending)if(root.isConnected){try{decorate(root);}catch(error){console.warn('Reference links could not decorate a passage:',error.message);}}
  }finally{queued=false;observer.observe(document.body,observerOptions);}
 }
 const enqueue=node=>{const el=node.nodeType===1?node:node.parentElement;if(!el)return;const parent=el.closest(scopes);if(parent)roots.add(parent);for(const root of el.querySelectorAll?.(scopes)||[])roots.add(root);if(!queued&&roots.size){queued=true;queueMicrotask(flush);}};
 function collectRecords(records){for(const record of records){if(record.type==='characterData')enqueue(record.target);else for(const node of record.addedNodes)enqueue(node);}}
 const observer=new MutationObserver(collectRecords);
 observer.observe(document.body,observerOptions);
 async function loadReferenceMatchers(){
  if(loading)return loading;
  if(placesReady&&peopleReady){enqueue(document.body);return;}
  loading=Promise.allSettled([
   placesReady?Promise.resolve():loadPlaces().then(places=>{match=createPlaceMatcher(places);placesReady=true;enqueue(document.body);}),
   peopleReady?Promise.resolve():referenceJson('/reference/people.json').then(people=>{matchPeople=createPersonMatcher(people);peopleReady=true;enqueue(document.body);})
  ]).then(results=>{
   for(const result of results)if(result.status==='rejected')console.warn('Reference links are incomplete:',result.reason?.message||result.reason);
   enqueue(document.body);
  }).finally(()=>{loading=null;});
  return loading;
 }
 // A reference request may fail independently of the visible content. Keep the
 // working matcher and retry only missing data on a fresh view or reconnection.
 window.addEventListener('viewchange',()=>{void loadReferenceMatchers();});
 window.addEventListener('online',()=>{void loadReferenceMatchers();});
 try{
  await loadReferenceMatchers();
 }catch(error){console.warn('Atlas chips unavailable:',error.message);}
}
initializeChips();
