import React, { FC } from 'react';

import { Entry } from '../../api/types';
import '../App.css';

interface EntryProps {
  entry: Entry;
}

const EntryRow: FC<EntryProps> = ({ entry }) => {
  return (
    <div>
      <div className='grid-container-2-equal'>
        <div className='grid-item no-border'>
          <b> {entry.original} </b>
        </div>
        <div className='grid-item no-border'>{entry.translation}</div>
      </div>
    </div>
  );
};

export default EntryRow;
