import React, { FC, useState } from 'react';

import { Language } from '../api/types';
import { getLanguages } from '../api/client';
import { useQuery } from '../api/useQuery';

interface LangSelectDialogProps {
  selectedLang: Language | undefined;
  onSelectLang: (lang: Language) => void;
  onClose: () => void;
}

const LangSelectDialog: FC<LangSelectDialogProps> = ({
  selectedLang: initialSelectedLang,
  onSelectLang,
  onClose,
}) => {
  const { loading, error, data } = useQuery<Language[]>(() =>
    getLanguages().then((page) => page.items),
  );
  const [selectedLang, setSelectedLang] = useState(initialSelectedLang);
  const languages = data ?? [];

  if (error) return <p>Error!</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className='dialog-overlay' onClick={onClose}>
      <dialog
        open
        className='center dialog'
        onClick={(event) => event.stopPropagation()}
      >
        <h3>Select Language</h3>
        <select
          className='basic-slide'
          value={selectedLang && selectedLang.id}
          onChange={(event) => {
            setSelectedLang(
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
        <button
          onClick={() => {
            onSelectLang(selectedLang!);
            onClose();
          }}
          className='confirm-button'
        >
          OK
        </button>
      </dialog>
    </div>
  );
};

export default LangSelectDialog;
