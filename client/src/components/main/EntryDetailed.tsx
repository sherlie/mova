import React, { FC } from 'react';

import { Entry } from '../../api/types';
import '../App.css';

interface EntryDetailedProps {
  entry: Entry;
  onClose: () => void;
}

const EntryDetailed: FC<EntryDetailedProps> = ({ entry, onClose }) => {
  return (
    <div className='container'>
      <a className='topright' onClick={onClose}>
        <i className='fas fa-window-close'></i>
      </a>
      <span className='word-title'>{entry.original}</span>
      <i>({entry.partOfSpeech})</i>
      <div className='gender-letter gender-m'>M</div>
      {entry.translation}
    </div>
  );
};

export default EntryDetailed;
