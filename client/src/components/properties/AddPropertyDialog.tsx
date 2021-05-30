import React, { useState, FC } from 'react';

import { useMutation } from '../../api/useMutation';
import { CustomType, Language, PartOfSpeech } from '../../api/types';
import '../App.css';
import { createProperty } from '../../api/client';

interface PropetyDialogProps {
  selectedLang: Language;
  onClose: () => void;
}

const AddPropetyDialog: FC<PropetyDialogProps> = ({
  selectedLang,
  onClose,
}) => {
  const [inputList, setInputList] = useState<string[]>(['']);
  const [name, setName] = useState<string>('');
  const [text, setText] = useState('');
  const [type, setType] = useState<string>('text');
  const [pos, setPos] = useState('Noun');

  const [addProperty, { loading }] = useMutation(() =>
    createProperty({
      name,
      type,
      langId: selectedLang.id,
      partOfSpeech: pos.toLowerCase() as PartOfSpeech,
      options:
        type === CustomType.SingleOption || type === CustomType.MultiOption
          ? inputList
          : undefined,
      table: type === CustomType.Table ? inputList : undefined,
    }),
  );

  const handleSubmit = async () => {
    await addProperty();
    console.log('added?', text);
    onClose();
  };

  const handleInputChange = (value: string, index: number) => {
    const list = [...inputList];
    list[index] = value;
    setInputList(list);
  };

  const handleRemoveClick = (index: number) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const handleAddClick = () => {
    setInputList([...inputList, '']);
  };

  return (
    <dialog open className='center dialog'>
      <p>
        <label>PROPERTY NAME</label>
        <br />
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          className='basic-slide'
          placeholder='Property name'
        />
      </p>
      <p>
        <label>PROPERTY TYPE</label>
        <br />
        <select
          className='basic-slide'
          value={type}
          onChange={(event) => {
            setType(event.target.value);
          }}
        >
          <option value='text'>text</option>
          <option value='single'>single option</option>
          <option value='multi'>multi option</option>
          <option value='table'>table</option>
        </select>
      </p>
      <p>
        <label>PART OF SPEECH</label>
        <br />
        <select
          className='basic-slide'
          onChange={(event) => setPos(event.target.value)}
          defaultValue={pos}
        >
          {Object.keys(PartOfSpeech).map((p) => (
            <option className='option' key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </p>
      {type === 'text' && (
        <div>
          <label>TEXT</label>
          <br />
          <textarea
            className='basic-slide'
            onChange={(event) => setText(event.target.value)}
            value={text}
          ></textarea>
        </div>
      )}
      {(type === 'single' || type === 'multi' || type === 'table') && (
        <div>
          <label>OPTIONS</label>
          {inputList.map((x, i) => {
            return (
              <div className='box' key={i}>
                <input
                  className='basic-slide'
                  name='firstName'
                  placeholder={
                    type === 'table'
                      ? 'Enter table cell'
                      : 'Enter property option'
                  }
                  value={x}
                  onChange={(e) => handleInputChange(e.target.value, i)}
                />
                {inputList.length !== 1 && (
                  <button
                    onClick={() => handleRemoveClick(i)}
                    className='submit-button'
                  >
                    x
                  </button>
                )}
                {inputList.length - 1 === i && (
                  <>
                    <br />
                    <button className='submit-button' onClick={handleAddClick}>
                      Add {type === 'table' ? 'table cell' : 'option'}
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
      <a className='topright' onClick={onClose}>
        <i className='fas fa-window-close'></i>
      </a>
      <button className='confirm-button' onClick={() => handleSubmit()}>
        {loading ? '...' : 'SUBMIT'}
      </button>
    </dialog>
  );
};

export default AddPropetyDialog;
