import React, { FC } from 'react';
import { Language } from '../api/types';

interface LanguageSelectProps {
  languages: Language[];
  selectedLanguage?: Language;
  onSelect: (selectedLanguage: Language) => void;
}

const LanguageSelect: FC<LanguageSelectProps> = ({
  languages,
  selectedLanguage,
  onSelect,
}) => (
  <select
    defaultValue=''
    value={selectedLanguage && selectedLanguage.id}
    onChange={(event) =>
      onSelect(
        languages.find((language) => language.id === event.target.value)!,
      )
    }
  >
    <option key='' value='' hidden>
      Select language
    </option>
    {languages.map((language) => (
      <option key={language.id} value={language.id}>
        {language.name}
      </option>
    ))}
  </select>
);

export default LanguageSelect;
