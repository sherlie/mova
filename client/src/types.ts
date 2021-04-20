export interface Language {
  id: string;
  name: string;
}

export interface Entry {
  id: string;
  original: string;
  translation: string;
}

export interface Page<T> {
  items: T[];
  hasMore: boolean;
}
