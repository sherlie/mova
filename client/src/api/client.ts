import { Page, Language, Entry, Property, PartOfSpeech } from './types';

const API = 'http://localhost:9000/api';

export async function getLanguages(): Promise<Page<Language>> {
  const response = await fetch(`${API}/langs`);
  return response.json();
}

export async function getLanguageEntries(langId: string): Promise<Page<Entry>> {
  const response = await fetch(`${API}/entries?langId=${langId}`);
  return response.json();
}

export async function getLanguageProperties(
  langId: string,
): Promise<Page<Property>> {
  const response = await fetch(`${API}/definitions?langId=${langId}`);
  return response.json();
}
export interface CreateEntryParams {
  original: string;
  translation: string;
  langId: string;
  partOfSpeech: PartOfSpeech;
}

export async function createEntry(
  createEntry: CreateEntryParams,
): Promise<Entry> {
  const response = await fetch(`${API}/entries`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createEntry),
  });
  return response.json();
}

export interface CreatePropertyParams {
  name: string;
  type: string;
  langId: string;
  partOfSpeech: PartOfSpeech;
  options?: string[];
  text?: string;
}

export async function createProperty(
  createProperty: CreatePropertyParams,
): Promise<Entry> {
  const response = await fetch(`${API}/definitions`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createProperty),
  });
  return response.json();
}
