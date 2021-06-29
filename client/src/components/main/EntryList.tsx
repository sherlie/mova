import React, { FC, useState } from 'react';

import EntryRow from './EntryRow';
import { Entry } from '../../api/types';
import '../App.css';

interface EntryListProps {
  entries: Entry[] | undefined;
  openedEntry: Entry | undefined;
  setOpenedEntry: (entry: Entry) => void;
}

const EntryList: FC<EntryListProps> = ({
  entries,
  openedEntry,
  setOpenedEntry,
}) => {
  if (!entries) return <div></div>;

  return (
    <div>
      {entries.map((entry) => (
        <div
          className={
            openedEntry === entry
              ? 'entry-row row-opened'
              : 'entry-row row-regular'
          }
          key={entry.id}
          onClick={() => setOpenedEntry(entry)}
        >
          <EntryRow key={entry.id} entry={entry} />
        </div>
      ))}
    </div>
  );
};

export default EntryList;
