import React, { useState, FC, useEffect } from 'react';
import { getLanguageEntries } from '../../api/client';
import { Entry, Page } from '../../api/types';
import { useQuery } from '../../api/useQuery';
import { useLangSelector } from '../../store';
import '../App.css';
import Card from './Card';

const CardsPage: FC = () => {
  const selectedLang = useLangSelector();
  const ENTRIES_PER_PAGE = 1;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selectedEntry = entries.length ? entries[selectedIdx] : null;

  function handleLeft() {
    if (selectedIdx > 0) {
      setSelectedIdx(selectedIdx - 1);
    }
  }

  function handleRight() {
    if (lastPage > selectedIdx + 1) {
      setSelectedIdx(selectedIdx + 1);
    } else if (entriesPage?.hasMore) {
      setSelectedIdx(selectedIdx + 1);
      setLastPage(lastPage + 1);
    }
  }

  const { data: entriesPage } = useQuery<Page<Entry>>(
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

  const [flipped, setFlipped] = useState(false);
  const [reverse, setReverse] = useState(false);

  if (!selectedEntry) {
    return null;
  }

  return (
    <>
      <div className='card-width'>
        <Card entry={selectedEntry} reverse={reverse} />

        <div>
          <div className='center'>
            <a onClick={() => handleLeft()}>
              <i
                className='fa fa-long-arrow-left arrow-icon fa-3x'
                aria-hidden='true'
              />
            </a>
            <a onClick={() => handleRight()}>
              <i
                className='fa fa-long-arrow-right arrow-icon fa-3x'
                aria-hidden='true'
              />
            </a>
          </div>
        </div>

        <div>
          <input
            type='checkbox'
            checked={reverse}
            onChange={() => setReverse(!reverse)}
          />
          <label className='switch'>
            <span className='slider'> SHOW TRANSLATION FIRST</span>
          </label>
        </div>
      </div>
    </>
  );
};
export default CardsPage;
