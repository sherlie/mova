import React, { FC } from 'react';

import EntryRow from './EntryRow';
import { Entry } from '../../graphql/types';

interface EntryListProps {
  entries: Entry[];
}

const EntryList: FC<EntryListProps> = ({ entries }) => {
  return (
    <div>
      {entries.map((entry) => (
        <EntryRow key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default EntryList;
