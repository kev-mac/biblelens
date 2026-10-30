export interface LinkedStoryAnchor {
  story_id: string;
  title: string;
  passage: string;
  route: string;
}

export interface CharacterLineage {
  parents?: string[];
  spouses?: string[];
  siblings?: string[];
  children?: string[];
  tribe?: string;
}

export interface CharacterGeography {
  origin: string;
  residence: string[];
}

export interface NarrativeAnchors {
  books: string[];
  key_verses: string[];
  linked_stories: LinkedStoryAnchor[];
}

export interface CharacterProfile {
  summary_source?: string;
  summary_route?: string;
  summary_links?: {start:number;end:number;label:string;id:string}[];
  scripture_context?: {book:number;chapter:number;verse:number;ref:string;text:string;links:{start:number;end:number;label:string;id:string}[]};
  id: string;
  name: string;
  aliases?: string[];
  identity_context?: string;
  sex: 'female' | 'male' | 'unspecified';
  era: 'Primeval' | 'Patriarchal' | 'Exodus' | 'Conquest' | 'Judges' | 'Monarchy' | 'Wisdom' | 'Prophets' | 'Gospels' | 'Apostolic' | 'Across scripture';
  summary: string;
  lineage?: CharacterLineage;
  lineage_bindings?: {policy: string; links: {relation:string; label:string; profile_id:string}[]};
  geography: CharacterGeography;
  narrative_anchors: NarrativeAnchors;
}
