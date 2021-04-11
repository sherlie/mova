import React, { FC, useState } from 'react';
import { useQuery } from '@apollo/client';

import { GQL_GET_LANGUAGES, GetLanguagesData } from '../../graphql/queries';
import { Language } from '../../graphql/types';
import LanguageSelect from './LanguageSelect';
import LanguageCustomDefinitions from './LanguageCustomDefinitions';

const SettingsPage: FC = () => {
  const { loading, error, data } = useQuery<GetLanguagesData>(
    GQL_GET_LANGUAGES,
  );

  const [selectedLanguage, setSelectedLanguage] = useState<Language>();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data) return null;

  return (
    <div className='LanguagePage'>
      <LanguageSelect
        languages={data.languages.items}
        onSelect={(language) => setSelectedLanguage(language)}
      />
      {selectedLanguage && (
        <LanguageCustomDefinitions language={selectedLanguage!} />
      )}
    </div>
  );
};

export default SettingsPage;
