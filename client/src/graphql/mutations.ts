import { gql } from '@apollo/client';
import { Entry, PartOfSpeech } from '../api/types';

export interface CreateEntryData {
  createEntry: Entry;
}

export interface CreateEntryArgs {
  input: {
    original: string;
    translation: string;
    langId: string;
    partOfSpeech: PartOfSpeech;
  };
}

export const GQL_CREATE_ENTRY = gql`
  mutation CreateEntry($input: CreateEntryInput!) {
    createEntry(input: $input) {
      ... on Entry {
        id
      }
    }
  }
`;
