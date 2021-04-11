import React, { FC } from 'react';

import { Entry } from '../../graphql/types';

interface EntryProps {
  entry: Entry;
}

const EntryRow: FC<EntryProps> = ({ entry }) => {
  return <div>{entry.original}</div>;
};

export default EntryRow;
