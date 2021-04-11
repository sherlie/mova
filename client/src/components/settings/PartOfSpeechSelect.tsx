import React, { FC } from 'react';
import { Language } from '../../graphql/types';

export interface PartOfSpeechSelectProps {
  languages: Language[];
  selectedLanguage?: Language;
  onSelect: (selectedLanguage: Language) => void;
}

const PartOfSpeechSelect: FC<PartOfSpeechSelectProps> = ({
  languages,
  selectedLanguage,
  onSelect,
}) => (
  <select
    value={selectedLanguage && selectedLanguage.id}
    onChange={(event) =>
      onSelect(
        languages.find((language) => language.id === event.target.value)!,
      )
    }
  >
    <option key='' selected={!selectedLanguage} hidden>
      Select language
    </option>
    {languages.map((language) => (
      <option key={language.id} value={language.id}>
        {language.name}
      </option>
    ))}
  </select>
);

export default PartOfSpeechSelect;
