import React, { useState, FC, useEffect } from 'react';
import { getLanguageEntries } from '../../api/client';
import { Entry, Page } from '../../api/types';
import { useQuery } from '../../api/useQuery';
import { useLangSelector } from '../../store';
import '../App.css';

interface CardProps {
  entry: Entry;
  reverse: boolean;
}

const Card: FC<CardProps> = ({ entry, reverse }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className='card-container'>
      <div
        className={`card ${flipped ? 'is-flipped' : ''}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className='card-side card-side--front'>
          {reverse ? entry.translation : entry.original}
        </div>
        <div className='card-side card-side--back'>
          {reverse ? entry.original : entry.translation}
        </div>
      </div>
    </div>
  );
};
export default Card;
