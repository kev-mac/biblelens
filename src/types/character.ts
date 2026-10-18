export interface LinkedStoryAnchor {
  story_id: string;
  title: string;
  passage: string;
  route: string;
}

export interface CharacterLineage {
  parents?: string[];
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
  id: string;
  name: string;
  era: 'Primeval' | 'Patriarchal' | 'Exodus' | 'Judges' | 'Monarchy' | 'Prophets' | 'Gospels' | 'Apostolic';
  summary: string;
  lineage?: CharacterLineage;
  geography: CharacterGeography;
  narrative_anchors: NarrativeAnchors;
}
