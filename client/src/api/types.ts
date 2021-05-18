export interface Entry {
  id: string;
  original: string;
  translation: string;
  partOfSpeech: PartOfSpeech;
}

export interface Property {
  id: string;
  name: string;
  type: CustomType;
  partOfSpeech: PartOfSpeech;
  options?: string[];
  table?: TableCell[];
}

export interface Language {
  id: string;
  name: string;
}

export enum CustomType {
  Text = 'Text',
  SingleOption = 'SingleOption',
  MultiOption = 'MultiOption',
  Table = 'Table',
}

export enum PartOfSpeech {
  Noun = 'Noun',
  Verb = 'Verb',
  Adj = 'Adj',
  Adv = 'Adv',
  Pron = 'Pron',
  Aux = 'Aux',
}

export interface Option {
  id: string;
  name: string;
}

export interface TableCell {
  id: string;
  name: string;
}

export interface CustomDefinition {
  id: string;
  name: string;
  type: CustomType;
  partOfSpeech: PartOfSpeech;
  options?: Record<string, string>[];
  table?: Record<string, string>[];
}

export interface Page<T> {
  items: T[];
  hasMore: boolean;
}
