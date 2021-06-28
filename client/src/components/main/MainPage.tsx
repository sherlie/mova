import React, { FC, useState } from 'react';

import { useQuery } from '../../api/useQuery';
import { Language, Entry, Page } from '../../api/types';
import EntryList from './EntryList';
import EntryDetailed from './EntryDetailed';
import '../App.css';
import AddEntryDialog from './AddEntryDialog';
import { getLanguageEntries } from '../../api/client';
import { useEffect } from 'react';
import { useLangSelector } from '../../store';

const ENTRIES_PER_PAGE = 10;

const MainPage: FC = () => {
  const selectedLang = useLangSelector();

  const [open, setOpen] = useState(false);
  const [openedEntry, setOpenedEntry] = useState<Entry | undefined>(undefined);
  const [openEdit, setOpenEdit] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [entries, setEntries] = useState<Entry[]>([]);

  const { loading, error, data: entriesPage } = useQuery<Page<Entry>>(
    () =>
      selectedLang
        ? getLanguageEntries(selectedLang.id, entries.length, ENTRIES_PER_PAGE)
        : Promise.resolve({ items: [], hasMore: false }),
    {
      deps: [selectedLang?.id, lastPage],
    },
  );

  useEffect(() => {
    if (entriesPage) {
      setEntries([...entries, ...entriesPage.items]);
    }
  }, [entriesPage]);

  const handleAddedEntry = async (entry: Entry) => {
    setEntries([entry, ...entries]);
  };

  const handleEditEntry = async (editedEntry: Entry) => {
    const idx = entries.findIndex((e) => e.id === editedEntry.id);
    const newEntries = [...entries];
    newEntries.splice(idx, 1, editedEntry);
    console.log(editedEntry);
    setEntries(newEntries);
  };

  if (!selectedLang) return <div> choose a language first :) </div>;
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
        <div className='grid-item'>
          <EntryList entries={entries} setOpenedEntry={setOpenedEntry} />
          {entriesPage && entriesPage.hasMore && (
            <button
              className='confirm-button'
              onClick={() => setLastPage(lastPage + 1)}
            >
              Load More
            </button>
          )}
        </div>
        {openedEntry && (
          <div className='grid-item entry-detailed'>
            <EntryDetailed
              entry={entries.find((e) => e.id === openedEntry.id)!}
              onClose={() => setOpenedEntry(undefined)}
              openEdit={openEdit}
              onEditEntry={(entry) => handleEditEntry(entry)}
              setOpenEdit={setOpenEdit}
            />
          </div>
        )}
      </div>

      <button className='round-button' onClick={() => setOpen(true)}>
        <i className='fas fa-plus'></i>
      </button>
      {open && (
        <AddEntryDialog
          onClose={() => setOpen(false)}
          onAddEntry={(entry) => handleAddedEntry(entry)}
        />
      )}
    </div>
  );
};

export default MainPage;
