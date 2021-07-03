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
  type: PropertyType;
  partOfSpeech: PartOfSpeech;
  options?: Record<string, string>;
  table?: Record<string, string>;
}

export interface Language {
  id: string;
  name: string;
}

export enum PropertyType {
  Text = 'text',
  'Single Option' = 'single',
  'Multi Option' = 'multi',
  Table = 'table',
}

export function propertyTypeLabel(type: PropertyType): string {
  return Object.entries(PropertyType).find(
    ([, typeValue]) => type === typeValue,
  )![0];
}

export enum PartOfSpeech {
  Noun = 'noun',
  Verb = 'verb',
  Adjective = 'adj',
  Adverb = 'adv',
  Pronoun = 'pron',
  Misc = 'misc',
}

export function partOfSpeechLabel(pos: PartOfSpeech): string {
  return Object.entries(PartOfSpeech).find(
    ([, posValue]) => pos === posValue,
  )![0];
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
