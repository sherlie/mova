import React, { useState, FC } from 'react';
import {
  createEntry,
  CreateEntryPropertyValue,
  CreateEntryPropertyValues,
  getLanguageProperties,
} from '../../api/client';

import { PropertyType, Entry, PartOfSpeech, Property } from '../../api/types';
import { useMutation } from '../../api/useMutation';
import { useQuery } from '../../api/useQuery';
import { useLangSelector } from '../../store';
import '../App.css';

interface AddEntryDialogProps {
  onAddEntry: (entry: Entry) => void;
  onClose: () => void;
}

interface PropertiesFormProps {
  pos: PartOfSpeech;
  propValues: CreateEntryPropertyValues;
  onPropValueChange: (
    propId: string,
    propValue: CreateEntryPropertyValue,
  ) => void;
}

interface PropertyRowProps {
  prop: Property;
  propValue: CreateEntryPropertyValue;
  onPropValueChange: (propValue: CreateEntryPropertyValue) => void;
}

const PropertyRow: FC<PropertyRowProps> = ({
  prop,
  propValue,
  onPropValueChange,
}) => {
  return (
    <p key={prop.id}>
      <label className='label'>{prop.name.toUpperCase()}</label> <br />
      {prop.type === 'single' && prop.options && (
        <select
          className='basic-slide'
          onChange={(event) => {
            onPropValueChange({ option: event.target.value });
          }}
          value={propValue?.option}
          defaultValue=''
        >
          <option value='' disabled hidden>
            ---
          </option>
          {Object.entries(prop.options).map(([key, opt]) => (
            <option key={key} value={key}>
              {opt}
            </option>
          ))}
        </select>
      )}
      {prop.type === 'multi' && prop.options && (
        <>
          {Object.entries(prop.options).map(([key, opt]) => (
            <>
              <input
                key={key}
                value={key}
                type='checkbox'
                className='basic-slide'
              />
              <label>{opt}</label>
            </>
          ))}
        </>
      )}
      {prop.type === PropertyType.Text && (
        <textarea
          className='basic-slide'
          onChange={(event) => {
            onPropValueChange({ text: event.target.value });
          }}
          value={propValue?.text}
        />
      )}
    </p>
  );
};

const PropertiesForm: FC<PropertiesFormProps> = ({
  pos,
  propValues,
  onPropValueChange,
}) => {
  const selectedLang = useLangSelector();
  const { data: propertiesData } = useQuery<Property[]>(() =>
    getLanguageProperties(selectedLang!.id).then((page) => page.items),
  );
  const properties = propertiesData ?? [];
  const posProperties = properties.filter((prop) => prop.partOfSpeech === pos);

  return (
    <div>
      {posProperties.map((prop) => (
        <PropertyRow
          key={prop.id}
          prop={prop}
          propValue={propValues[prop.id]}
          onPropValueChange={(propValue) =>
            onPropValueChange(prop.id, propValue)
          }
        />
      ))}
    </div>
  );
};

const AddEntryDialog: FC<AddEntryDialogProps> = ({ onAddEntry, onClose }) => {
  const selectedLang = useLangSelector();
  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');
  const [pos, setPos] = useState<PartOfSpeech>(PartOfSpeech.Noun);
  const [
    propertyValues,
    setPropertyValues,
  ] = useState<CreateEntryPropertyValues>({});

  const [addEntry, { loading }] = useMutation(() =>
    createEntry({
      original,
      translation,
      langId: selectedLang!.id,
      partOfSpeech: pos,
      customValues: propertyValues,
    }),
  );

  const handleSubmit = async () => {
    const result = await addEntry();
    if (result) {
      onAddEntry(result);
    }
    onClose();
  };

  return (
    <div className='dialog-overlay' onClick={onClose}>
      <dialog
        open
        className='center dialog'
        onClick={(event) => event.stopPropagation()}
      >
        {loading && <p>Loading...</p>}
        <div className='sticky'>
          <a className='topright' onClick={onClose}>
            <i className='fas fa-window-close'></i>
          </a>
          <h3>Add New Entry</h3>
        </div>
        <p>
          <label>ENTRY (IN {selectedLang!.name.toUpperCase()})</label> <br />
          <input
            className='basic-slide'
            name='original'
            placeholder='word or phrase'
            value={original}
            onChange={(event) => setOriginal(event.target.value)}
          />
        </p>
        <p>
          <label>TRANSLATION</label> <br />
          <input
            className='basic-slide'
            name='translation'
            placeholder='translation'
            value={translation}
            onChange={(event) => setTranslation(event.target.value)}
          />
        </p>
        <p>
          <label>PART OF SPEECH</label> <br />
          <select
            className='basic-slide wide'
            onChange={(event) => setPos(event.target.value as PartOfSpeech)}
            defaultValue={pos}
          >
            {Object.entries(PartOfSpeech).map(([posName, posValue]) => (
              <option key={posValue} value={posValue}>
                {posName}
              </option>
            ))}
          </select>
        </p>
        <div>
          <PropertiesForm
            pos={pos}
            propValues={propertyValues}
            onPropValueChange={(propId, propValue) =>
              setPropertyValues({ ...propertyValues, [propId]: propValue })
            }
          />
        </div>
        <button className='confirm-button' onClick={() => handleSubmit()}>
          SUBMIT
        </button>
      </dialog>
    </div>
  );
};

export default AddEntryDialog;
