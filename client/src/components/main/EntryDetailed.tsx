import React, { FC } from 'react';

import { Property, Entry } from '../../api/types';
import { useQuery } from '../../api/useQuery';
import { getEntryProperties, getEntry, deleteEntry } from '../../api/client';
import '../App.css';
import EditEntryDialog from './EditEntryDialog';

interface EntryDetailedProps {
  entry: Entry;
  onClose: () => void;
  openEdit: boolean;
  setOpenEdit: (open: boolean) => void;
  onEditEntry: (entry: Entry) => void;
  onDeleteEntry: (entry: Entry) => void;
}

const EntryDetailed: FC<EntryDetailedProps> = ({
  entry,
  onClose,
  openEdit,
  setOpenEdit,
  onEditEntry,
  onDeleteEntry,
}) => {
  const { data: defs } = useQuery<Property[]>(
    () => getEntryProperties(entry.id),
    { deps: [entry.id] },
  );
  const { data: entryFull } = useQuery<Entry>(() => getEntry(entry.id), {
    deps: [entry],
  });
  const handleDelete = async () => {
    onClose();
    const result = await deleteEntry(entry);
    if (result) {
      onDeleteEntry(result);
    }
  };
  if (entryFull === null) return <div />;
  return (
    <div className='container entry-detailed '>
      <a className='topright'>
        <i
          className='fas fa-edit'
          style={{ marginRight: '2px' }}
          onClick={() => setOpenEdit(true)}
        ></i>
        <i
          className='fas fa-trash-alt'
          onClick={handleDelete}
          style={{ marginRight: '2px' }}
        ></i>
        <i className='fas fa-times' onClick={onClose}></i>
      </a>
      <span className='word-title'>{entryFull.original}</span>
      <div style={{ textAlign: 'left' }}>
        <p>
          {/* <div className='gender-letter gender-m'>M</div> */}
          <i>({entryFull.partOfSpeech})</i>
          <br />
          <b>{entryFull.translation}</b>
        </p>
        {Object.values(entryFull.customValues).map((val) => (
          <p key={val.definition.id}>
            <b>{val.definition.name}: </b>
            {val.definition.type === 'text' && val.text}
            {val.definition.type === 'single' &&
              val.option &&
              val.definition.options![val.option]}
            {val.definition.type === 'multi' &&
              val.options &&
              val.options.map((opt) => val.definition.options![opt] + ' ')}
          </p>
        ))}
      </div>
      {/* { defs && defs.map((def) => (console.log("FUCK", def))) }  */}
      {openEdit && (
        <EditEntryDialog
          entry={entryFull}
          onClose={() => setOpenEdit(false)}
          defs={defs}
          customValues={entryFull.customValues}
          onEditEntry={onEditEntry}
        />
      )}
    </div>
  );
};

export default EntryDetailed;
