import React from 'react';
import { useQuery, gql } from '@apollo/client';
import EntryList from './EntryList';
import EntryDetails from './EntryDetails';
import SearchBar from './SearchBar';

const GET_LANGS = gql`
  query {
    langs {
      items {
        name
      }
    }
  }
`;

const MainPage = () => {
  const { loading, error, data } = useQuery(GET_LANGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return (
    <div>
      <SearchBar />
      <EntryList />
      <EntryDetails />
      <ul>
        {data.langs.items.map(lang =>
          <li key={lang.id}> {lang.name}</li>)}
      </ul>
    </div>
  )
}

export default MainPage;