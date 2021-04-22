import React, { FC } from 'react';
import { useQuery } from '@apollo/client';

import {
  GetLanguageEntriesData,
  GetLanguageEntriesVariables,
  GQL_GET_LANGUAGE_ENTRIES,
} from '../../graphql/queries';
import { Language, Page } from '../../graphql/types';
import EntryList from './EntryList';

interface MainPageProps {
  selectedLang: Language | undefined;
}

const MainPage: FC<MainPageProps> = ({ selectedLang }) => {
  if (!selectedLang) return <div> </div>;

  const { loading, error, data } = useQuery<
    GetLanguageEntriesData,
    GetLanguageEntriesVariables
  >(GQL_GET_LANGUAGE_ENTRIES, {
    variables: {
      languageId: selectedLang?.id,
    },
  });

  console.log(data?.language.entries.items);

  return (
    <div>
      {selectedLang.id}
      <h3>MainPage: {selectedLang.name}</h3>
      <EntryList entries={data?.language.entries.items} />
    </div>
  );
};

export default MainPage;
