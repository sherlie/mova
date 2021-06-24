export interface Entry {
  id: string;
  original: string;
  translation: string;
  partOfSpeech: PartOfSpeech;
  customValues: Record<string, PropertyValue>;
}

export interface Property {
  id: string;
  name: string;
  type: string;
  partOfSpeech: PartOfSpeech;
  options?: Record<string, string>;
  table?: Record<string, string>;
}

export interface Language {
  id: string;
  name: string;
}

export enum CustomType {
  Text = 'text',
  SingleOption = 'single',
  MultiOption = 'multi',
  Table = 'table',
}

export enum PartOfSpeech {
  Noun = 'noun',
  Verb = 'verb',
  Adj = 'adj',
  Adv = 'adv',
  Pron = 'pron',
  Aux = 'aux',
}

export interface Option {
  id: string;
  name: string;
}

export interface TableCell {
  id: string;
  name: string;
}
export interface PropertyValue {
  definition: Property;
  text?: string;
  option?: string;
  options?: string[];
  table: Record<string, string>;
}
export interface Page<T> {
  items: T[];
  hasMore: boolean;
}
