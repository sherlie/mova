import React, { useState, FC } from 'react';
import { useQuery } from '@apollo/client';

import { GET_LANGUAGES } from '../queries';
import { Page, Language } from '../types';

export interface GetLanguagesData {
  languages: Page<Language>;
}

interface LangSelectDialogProps {
  selectedLang: Language | undefined;
  onSelectLang: (lang: Language) => void;
  onClose: () => void;
}

const LangSelectDialog: FC<LangSelectDialogProps> = ({
  selectedLang,
  onSelectLang,
  onClose,
}) => {
  const { loading, error, data } = useQuery<GetLanguagesData>(GET_LANGUAGES);

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error :(</p>;

  return (
    <dialog open>
      <select
        value={selectedLang && selectedLang.id}
        onChange={(event) => {
          onSelectLang(
            data.languages.items.find(
              (lang) => lang.id === event.target.value,
            )!,
          );
        }}
      >
        <option selected={!selectedLang} hidden />
        {data.languages.items.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
      <button onClick={() => onClose()}> ok </button>
    </dialog>
  );
};

export default LangSelectDialog;
