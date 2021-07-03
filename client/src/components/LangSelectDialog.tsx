import React, { FC, useState } from 'react';

import { Language } from '../api/types';
import { getLanguages } from '../api/client';
import { useQuery } from '../api/useQuery';
import { useDispatch } from 'react-redux';
import { useLangSelector } from '../store';
import { select } from '../store/lang';

interface LangSelectDialogProps {
  onClose: () => void;
}

const LangSelectDialog: FC<LangSelectDialogProps> = ({ onClose }) => {
  const { loading, error, data } = useQuery<Language[]>(() =>
    getLanguages().then((page) => page.items),
  );
  const initialSelectedLang = useLangSelector();
  const dispatch = useDispatch();

  const [selectedLang, setSelectedLang] = useState(initialSelectedLang);
  const languages = data ?? [];

  if (error) return <p>Error!</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div
      className='dialog-overlay'
      onClick={() => initialSelectedLang && onClose()}
    >
      <dialog
        open
        className='center dialog'
        onClick={(event) => event.stopPropagation()}
      >
        <h3>Select Language</h3>
        <select
          className='basic-slide'
          value={selectedLang ? selectedLang.id : ''}
          onChange={(event) => {
            setSelectedLang(
              languages.find((lang) => lang.id === event.target.value)!,
            );
          }}
        >
          <option key='' hidden={!selectedLang} />
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => {
              dispatch(select(selectedLang!));
              onClose();
            }}
            className='confirm-button'
            disabled={!selectedLang}
          >
            OK
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default LangSelectDialog;
