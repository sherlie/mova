import React, { useState, FC } from 'react';
import { useQuery } from '@apollo/client';

import {
  GetLanguagePropertiesData,
  GetLanguagePropertiesVariables,
  GQL_GET_LANGUAGE_PROPERTIES,
} from '../../graphql/queries';
import { Language, Page } from '../../graphql/types';
import PropertyDialog from './PropertyDialog';

interface LangPageProps {
  selectedLang: Language | undefined;
}

const LanguagesPage: FC<LangPageProps> = ({ selectedLang }) => {
  if (!selectedLang) return <div> </div>;
  const [open, setOpen] = useState(false);
  const { loading, error, data } = useQuery<
    GetLanguagePropertiesData,
    GetLanguagePropertiesVariables
  >(GQL_GET_LANGUAGE_PROPERTIES, {
    variables: {
      languageId: selectedLang?.id,
    },
  });

  if (data) console.log(data.language.definitions);

  return (
    <div>
      <h3>Settings to {selectedLang.name}</h3>
      <button onClick={() => setOpen(true)}>add property</button>
      {open && (
        <PropertyDialog
          selectedLang={selectedLang}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};
export default LanguagesPage;
