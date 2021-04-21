export interface Entry {
  id: string;
  original: string;
  translation: string;
}

export interface Property {
  name: string;
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
  options?: Option[];
  table?: TableCell[];
}

export interface Page<T> {
  items: T[];
  hasMore: boolean;
}
