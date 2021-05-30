import React, { FC, useState } from 'react';

import { useQuery } from '../../api/useQuery';
import { Language, Entry } from '../../api/types';
import EntryList from './EntryList';
import EntryDetailed from './EntryDetailed';
import '../App.css';
import AddEntryDialog from './AddEntryDialog';
import { getLanguageEntries } from '../../api/client';

interface MainPageProps {
  selectedLang: Language | undefined;
}

const MainPage: FC<MainPageProps> = ({ selectedLang }) => {
  if (!selectedLang) return <div> choose a language first :) </div>;

  const [open, setOpen] = useState(false);
  const [openedEntry, setOpenedEntry] = useState<Entry | undefined>(undefined);

  const { loading, error, data } = useQuery<Entry[]>(
    getLanguageEntries(selectedLang.id).then((page) => page.items),
  );
  const entries = data ?? [];

  if (error) return <p>Error!</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <h3>Main Page</h3>
      <div className='search-container'>
        <form action=''>
          <input
            type='text'
            placeholder='Search...'
            name='search'
            className='search-input'
          />
          <button type='submit' className='search-submit '>
            <i className='fa fa-search'></i>
          </button>
        </form>
      </div>

      <div className='grid-container-2-equal'>
        <div>
          <EntryList entries={entries} setOpenedEntry={setOpenedEntry} />
        </div>
        {openedEntry && (
          <div className='grid-item entry-detailed'>
            <EntryDetailed
              entry={openedEntry}
              onClose={() => setOpenedEntry(undefined)}
            />
          </div>
        )}
      </div>
      <button className='round-button' onClick={() => setOpen(true)}>
        <i className='fas fa-plus'></i>
      </button>
      {open && (
        <AddEntryDialog
          selectedLang={selectedLang}
          onClose={() => setOpen(false)}
          onAddEntry={(entry) => console.log(entry)}
        />
      )}
    </div>
  );
};

export default MainPage;
