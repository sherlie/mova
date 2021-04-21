import { gql } from '@apollo/client';
import {
  CustomDefinition,
  Language,
  Page,
  PartOfSpeech,
  Entry,
  Property,
} from './types';

export interface GetLanguagesData {
  languages: Page<Language>;
}

export const GQL_GET_LANGUAGES = gql`
  query GetLanguages {
    languages {
      items {
        id
        name
      }
      hasMore
    }
  }
`;

export interface GetLanguageEntriesData {
  language: {
    entries: Page<Entry>;
  };
}

export interface GetLanguageEntriesVariables {
  languageId: string;
}

export const GQL_GET_LANGUAGE_ENTRIES = gql`
  query GetLanguageEntries($languageId: ID!) {
    language(id: $languageId) {
      entries {
        items {
          id
          translation
          original
          partOfSpeech
        }
      }
    }
  }
`;

export interface GetLanguagePropertiesData {
  language: {
    definitions: Property[];
  };
}

export interface GetLanguagePropertiesVariables {
  languageId: string;
}

export const GQL_GET_LANGUAGE_PROPERTIES = gql`
  query GetLanguageProperties($languageId: ID!) {
    language(id: $languageId) {
      definitions(partOfSpeech: Noun) {
        ... on TextCustomDefinition {
          name
        }
        ... on OptionCustomDefinition {
          name
        }
        ... on TableCustomDefinition {
          name
        }
      }
    }
  }
`;

export interface GetCustomFieldDefinitionsData {
  language: Language & {
    definitions: CustomDefinition[];
  };
}

export interface GetCustomFieldDefinitionsArgs {
  languageId: string;
  partOfSpeech: PartOfSpeech;
}

export const GQL_GET_CUSTOM_FIELD_DEFINITIONS = gql`
  query GetCustomFieldDefs($languageId: ID!, $partOfSpeech: PartOfSpeech!) {
    language(id: $languageId) {
      definitions(partOfSpeech: $partOfSpeech) {
        ... on ICustomDefinition {
          id
          name
          type
        }
        ... on OptionCustomDefinition {
          options {
            id
            value
          }
        }
        ... on TableCustomDefinition {
          table {
            id
            name
          }
        }
      }
    }
  }
`;
