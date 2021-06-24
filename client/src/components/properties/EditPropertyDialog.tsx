import React, { useState, FC } from 'react';

import { PartOfSpeech, Property } from '../../api/types';

import '../App.css';

interface PropetyDialogProps {
  property: Property;
  onClose: () => void;
}

const AddPropetyDialog: FC<PropetyDialogProps> = ({ property, onClose }) => {
  const [inputList, setInputList] = useState<string[]>(['']);
  const [name, setName] = useState<string>(property.name);
  const [type, setType] = useState<string>(property.type);
  const [pos, setPos] = useState(property.partOfSpeech.toString());

  const handleSubmit = async () => {
    //await addProperty();
    onClose();
  };

  const handleInputChange = (value: string, index: number) => {
    const list = [...inputList];
    list[index] = value;
    setInputList(list);
  };

  return (
    <div className='dialog-overlay' onClick={onClose}>
      <dialog
        open
        className='center dialog'
        onClick={(event) => event.stopPropagation()}
      >
        <div className='sticky'>
          <a className='topright' onClick={onClose}>
            <i className='fas fa-window-close'></i>
          </a>
          <h3>Edit Property</h3>
        </div>
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
        {type === 'text' && <div />}
        {(type === 'single' || type === 'multi') && (
          <div>
            <label>OPTIONS</label>
            {property.options &&
              Object.entries(property.options).map(([key, option], i) => {
                return (
                  <div className='box' key={key}>
                    <input
                      className='basic-slide'
                      name='firstName'
                      placeholder='Enter property option'
                      value={option}
                      onChange={(e) => handleInputChange(e.target.value, i)}
                    />
                  </div>
                );
              })}
          </div>
        )}
        <button className='confirm-button' onClick={() => handleSubmit()}>
          CLOSE
        </button>
      </dialog>
    </div>
  );
};

export default AddPropetyDialog;
