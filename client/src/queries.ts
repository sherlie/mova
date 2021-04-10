import { gql } from '@apollo/client';

export const GET_LANGUAGES = gql`
  query {
    languages {
      items {
        id
        name
        entries {
          items {
            id
            original
            translation
          }
        }
      }
      hasMore
    }
  }
`;
