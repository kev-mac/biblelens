import {createPersonMatcher,referenceMatches} from '../src/people-links.js';
import {parsePlaces,createPlaceMatcher} from '../src/places-core.js';
// Derive the same ambiguity-aware links once while packaging. Scripture and
// reference source records remain unchanged; browsers need only this chapter.
export function readerReferences(people,places){
 const personMatch=createPersonMatcher(people),placeMatch=createPlaceMatcher(parsePlaces(places));
 return chapter=>({...chapter,verses:chapter.verses.map(verse=>({...verse,referenceLinks:Object.fromEntries(['kjv','web','asv'].map(edition=>[edition,referenceMatches(verse[edition]||'',placeMatch,personMatch,{book:chapter.book,chapter:chapter.chapter,verse:verse.n})]))}))});
}
