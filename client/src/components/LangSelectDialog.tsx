import React, { FC } from 'react';

import { Language } from '../api/types';
import { getLanguages } from '../api/client';
import { useQuery } from '../api/useQuery';

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
  const { loading, error, data } = useQuery<Language[]>(
    getLanguages().then((page) => page.items),
  );
  const languages = data ?? [];

  if (error) return <p>Error!</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <dialog open>
      <select
        value={selectedLang && selectedLang.id}
        onChange={(event) => {
          onSelectLang(
            languages.find((lang) => lang.id === event.target.value)!,
          );
        }}
      >
        <option key='' selected={!selectedLang} hidden />
        {languages.map((lang) => (
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
