import React, { FC } from 'react';

import { Property, Entry, Language } from '../../api/types';
import { useQuery } from '../../api/useQuery';
import { getEntryProperties, getEntry } from '../../api/client';
import '../App.css';
import EditEntryDialog from './EditEntryDialog';

interface EntryDetailedProps {
  selectedLang: Language;
  entry: Entry;
  onClose: () => void;
  openEdit: boolean;
  setOpenEdit: (open: boolean) => void;
  onEditEntry: (entry: Entry) => void;
}

const EntryDetailed: FC<EntryDetailedProps> = ({
  selectedLang,
  entry,
  onClose,
  openEdit,
  setOpenEdit,
  onEditEntry,
}) => {
  const { data: defs } = useQuery<Property[]>(
    () => getEntryProperties(entry.id),
    { deps: [entry.id] },
  );
  const { data: entryFull } = useQuery<Entry>(() => getEntry(entry.id), {
    deps: [entry],
  });
  if (entryFull === null) return <div />;
  return (
    <div className='container entry-detailed '>
      <a className='topright'>
        <i
          className='fa fa-pencil-square'
          style={{ marginRight: '2px' }}
          onClick={() => setOpenEdit(true)}
        ></i>
        <i className='fas fa-window-close' onClick={onClose}></i>
      </a>
      <span className='word-title'>{entryFull.original}</span>
      <div style={{ textAlign: 'left' }}>
        {/* <div className='gender-letter gender-m'>M</div> */}
        <br />
        <i>({entryFull.partOfSpeech})</i>
        <br />
        <b>{entryFull.translation}</b>
        {Object.values(entryFull.customValues).map((val) => (
          <p key={val.definition.id}>
            <b>{val.definition.name}: </b>
            {val.definition.type === 'text' && val.text}
            {val.definition.type === 'single' &&
              val.option &&
              val.definition.options![val.option]}
          </p>
        ))}
      </div>
      {/* { defs && defs.map((def) => (console.log("FUCK", def))) }  */}
      {openEdit && (
        <EditEntryDialog
          selectedLang={selectedLang}
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
