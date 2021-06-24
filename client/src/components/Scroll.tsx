import React, { FC, useState } from 'react';
import './App.css';

interface ScrollProps {
  pageSize: number;
  lastPage: number;
  setLastPage: (lastPage: number) => void;
}

const Scroll: FC<ScrollProps> = ({ pageSize, lastPage, setLastPage }) => {
  return (
    <div>
      <button
        className='confirm-button'
        onClick={() => setLastPage(lastPage + 1)}
      >
        Load More
      </button>
    </div>
  );
};

export default Scroll;
