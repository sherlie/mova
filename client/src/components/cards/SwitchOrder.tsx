import React, { FC } from 'react';
import '../App.css';

interface SwitchOrderProps {
  reverse: boolean;
  setReverse: (reverse: boolean) => void;
}

const SwitchOrder: FC<SwitchOrderProps> = ({ reverse, setReverse }) => {
  return (
    <div className='switch-container'>
      <label className='switch'>
        <input
          id='switch'
          className='switch'
          type='checkbox'
          checked={reverse}
          onChange={() => setReverse(!reverse)}
        />
        <span className='slider'> </span>
      </label>
      <label htmlFor='switch' className='switch-label'>
        SHOW TRANSLATION FIRST
      </label>
    </div>
  );
};
export default SwitchOrder;
