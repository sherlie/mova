import React, { FC } from 'react';
import { useQuery } from '@apollo/client';

import EntryRow from './EntryRow';
import { Entry } from '../../graphql/types';

interface EntryListProps {
  entries: Entry[] | undefined;
}

const EntryList: FC<EntryListProps> = ({ entries }) => {
  if (!entries) return <div></div>;

  return (
    <div>
      {entries.map((entry) => (
        <EntryRow key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default EntryList;
