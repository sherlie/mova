import React, { useState, FC } from 'react';
import { createEntry } from '../../api/client';

import { Entry, Language, PartOfSpeech } from '../../api/types';
import { useMutation } from '../../api/useMutation';
import '../App.css';

interface AddEntryDialogProps {
  selectedLang: Language;
  onAddEntry: (entry: Entry) => void;
  onClose: () => void;
}

const AddEntryDialog: FC<AddEntryDialogProps> = ({
  selectedLang,
  onAddEntry,
  onClose,
}) => {
  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');
  const [pos, setPos] = useState('Noun');

  const [addEntry, { error, loading }] = useMutation(() =>
    createEntry({
      original,
      translation,
      langId: selectedLang.id,
      partOfSpeech: pos.toLowerCase() as PartOfSpeech,
    }),
  );

  const handleSubmit = async () => {
    const result = await addEntry();
    if (result) {
      onAddEntry(result);
    }
    onClose();
  };

  return (
    <dialog open className='center dialog'>
      {loading && <p>Loading...</p>}
      <a className='topright' onClick={onClose}>
        <i className='fas fa-window-close'></i>
      </a>
      <h3>Add New Entry</h3>
      <div className='grid-container-2-equal'>
        <div className='grid-item'>
          <label>Entry (in {selectedLang.name})</label> <br />
          <input
            name='original'
            placeholder='word or phrase'
            value={original}
            onChange={(event) => setOriginal(event.target.value)}
          />
        </div>
        <div className='grid-item'>
          <label>Translation</label> <br />
          <input
            name='translation'
            placeholder='translation'
            value={translation}
            onChange={(event) => setTranslation(event.target.value)}
          />
        </div>
      </div>

      <select
        className='wide'
        onChange={(event) => setPos(event.target.value)}
        defaultValue={pos}
      >
        {Object.keys(PartOfSpeech).map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <br />
      <button className='confirm-button' onClick={() => handleSubmit()}>
        {' '}
        ok{' '}
      </button>
    </dialog>
  );
};

export default AddEntryDialog;
