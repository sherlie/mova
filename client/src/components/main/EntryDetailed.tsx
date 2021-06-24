import React, { FC } from 'react';

import { Property, Entry, Language } from '../../api/types';
import { useQuery } from '../../api/useQuery';
import { getEntryProperties, getEntry } from '../../api/client';
import '../App.css';
import EditEntryDialog from './EditEntryDialog';

interface EntryDetailedProps {
  selectedLang: Language;
  entryId: string;
  onClose: () => void;
  openEdit: boolean;
  setOpenEdit: (open: boolean) => void;
}

const EntryDetailed: FC<EntryDetailedProps> = ({
  selectedLang,
  entryId,
  onClose,
  openEdit,
  setOpenEdit,
}) => {
  const { data: defs } = useQuery<Property[]>(
    () => getEntryProperties(entryId),
    { deps: [entryId] },
  );
  const { data: entry } = useQuery<Entry>(() => getEntry(entryId), {
    deps: [entryId],
  });
  if (entry === null) return <div />;
  return (
    <div className='container entry-detailed '>
      <a className='topright'>
        <i
          className='fa fa-pencil-square'
          onClick={() => setOpenEdit(true)}
        ></i>
        <i className='fas fa-window-close' onClick={onClose}></i>
      </a>
      <span className='word-title'>{entry.original}</span>
      <i>({entry.partOfSpeech})</i>
      <div className='gender-letter gender-m'>M</div>
      {entry.translation}
      {Object.values(entry.customValues).map((val) => (
        <p key={val.definition.id}>
          <b>{val.definition.name}: </b>
          {val.definition.type === 'text' && val.text}
          {val.definition.type === 'single' &&
            val.option &&
            val.definition.options![val.option]}
        </p>
      ))}
      {/* { defs && defs.map((def) => (console.log("FUCK", def))) }  */}
      {openEdit && (
        <EditEntryDialog
          selectedLang={selectedLang}
          entry={entry}
          onClose={() => setOpenEdit(false)}
          defs={defs}
          customValues={entry.customValues}
          onAddEntry={() => console.log('onaddentry')}
        />
      )}
    </div>
  );
};

export default EntryDetailed;
