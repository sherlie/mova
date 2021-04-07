import React from 'react';
import { useQuery, gql } from '@apollo/client';

import EntryList from './EntryList'
import { GET_LANGUAGES } from './queries';


const MainPage = () => {
  const { loading, error, data } = useQuery(GET_LANGUAGES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <EntryList entries={data.languages.items[0].entries.items} />
    </div>
  );
}

export default MainPage;