import React, { useQuery } from '@apollo/client';
import { FC } from 'react';
import {
  GQL_GET_CUSTOM_FIELD_DEFINITIONS,
  GetCustomFieldDefinitionsData,
  GetCustomFieldDefinitionsArgs,
} from '../../graphql/queries';
import { Language, PartOfSpeech } from '../../graphql/types';

interface LanguageCustomDefinitionListProps {
  language: Language;
}

const LanguageCustomDefinitions: FC<LanguageCustomDefinitionListProps> = ({
  language,
}) => {
  const partOfSpeech = PartOfSpeech.Noun;

  const { loading, error, data } = useQuery<
    GetCustomFieldDefinitionsData,
    GetCustomFieldDefinitionsArgs
  >(GQL_GET_CUSTOM_FIELD_DEFINITIONS, {
    variables: {
      languageId: language.id,
      partOfSpeech,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data) return null;

  return (
    <div>
      <h5>Definitions:</h5>
      {data.language.definitions.map((definition) => (
        <div key={definition.id}>
          <p>{definition.name}</p>
          <p>{definition.type}</p>
        </div>
      ))}
    </div>
  );
};

export default LanguageCustomDefinitions;
