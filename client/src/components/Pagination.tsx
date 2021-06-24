import React, { FC, useState } from 'react';
import './App.css';

interface PaginationProps {
  pageSize: number;
  totalCount: number;
  curPage: number;
  setCurPage: (curPage: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  pageSize,
  totalCount,
  curPage,
  setCurPage,
}) => {
  const nOfPages = Math.ceil(totalCount / pageSize);
  const pageNumbers = [];
  for (let i = 1; i <= nOfPages; i++) {
    pageNumbers.push(i);
  }
  return (
    <div>
      {curPage != 1 && (
        <button className='page' onClick={() => setCurPage(curPage - 1)}>
          {'<'}
        </button>
      )}
      {pageNumbers.map((page) => (
        <button
          key={page}
          className='page'
          disabled={page === curPage}
          onClick={() => setCurPage(page)}
        >
          {page}
        </button>
      ))}
      {curPage != nOfPages && (
        <button className='page' onClick={() => setCurPage(curPage + 1)}>
          {'>'}
        </button>
      )}
    </div>
  );
};

export default Pagination;
