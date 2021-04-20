import React, { useState, FC } from 'react';

import { GET_LANGUAGES } from '../../queries';
import { Language, Page } from '../../types';

interface PropetyDialogProps {
  selectedLang: Language | undefined;
  onClose: () => void;
}

interface Something {
  firstName: string;
  lastName: string;
}

const PropetyDialog: FC<PropetyDialogProps> = ({ selectedLang, onClose }) => {
  const [inputList, setInputList] = useState<Something[]>([
    { firstName: '', lastName: '' },
  ]);

  // handle input change
  const handleInputChange = (
    name: 'firstName' | 'lastName',
    value: string,
    index: number,
  ) => {
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index: number) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { firstName: '', lastName: '' }]);
  };

  return (
    <dialog open>
      {inputList.map((x, i) => {
        return (
          <div className='box' key={i}>
            <input
              name='firstName'
              placeholder='Enter property option'
              value={x.firstName}
              onChange={(e) =>
                handleInputChange('firstName', e.target.value, i)
              }
            />
            {inputList.length !== 1 && (
              <button onClick={() => handleRemoveClick(i)}>x</button>
            )}
            {inputList.length - 1 === i && (
              <>
                <p />
                <button onClick={handleAddClick}>Add</button>
              </>
            )}
          </div>
        );
      })}

      <button onClick={() => onClose()}> ok </button>
    </dialog>
  );
};

export default PropetyDialog;
