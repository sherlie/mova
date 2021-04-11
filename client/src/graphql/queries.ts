import { gql } from '@apollo/client';
import { CustomDefinition, Language, Page, PartOfSpeech } from './types';

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

export interface GetLanguagesData {
  languages: Page<Language>;
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

export interface GetCustomFieldDefinitionsData {
  language: Language & {
    definitions: CustomDefinition[];
  };
}

export interface GetCustomFieldDefinitionsArgs {
  languageId: string;
  partOfSpeech: PartOfSpeech;
}
