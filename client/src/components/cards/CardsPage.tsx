import React, { useState, FC } from 'react';
import '../App.css';

const CardsPage: FC = () => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className='card-container'>
      <div
        className={`card ${flipped ? 'is-flipped' : ''}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className={`card-side card-side--front ${
            flipped ? 'is-flipped' : ''
          }`}
        >
          una giornata
        </div>
        <div className='card-side card-side--back'>a day</div>
      </div>
    </div>
  );
};
export default CardsPage;
