import React from 'react';
import { useQuery, gql } from '@apollo/client';

import EntryList from './EntryList'

const GET_LANGUAGES = gql`
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

const MainPage = () => {
  const { loading, error, data } = useQuery(GET_LANGUAGES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  //console.log(data)

  return (
    <div>
      <EntryList data={data.languages.items[0].entries.items}/>
    </div>
  );
}

export default MainPage;