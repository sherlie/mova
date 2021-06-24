import React, { useState, FC, useEffect, useRef } from 'react';
import {
  createEntry,
  CreateEntryPropertyValue,
  CreateEntryPropertyValues,
  getLanguageProperties,
} from '../../api/client';

import {
  CustomType,
  Entry,
  Language,
  PartOfSpeech,
  Property,
  PropertyValue,
} from '../../api/types';
import { useMutation } from '../../api/useMutation';
import { useQuery } from '../../api/useQuery';
import '../App.css';

interface EditEntryDialogProps {
  selectedLang: Language;
  entry: Entry;
  onAddEntry: (entry: Entry) => void;
  onClose: () => void;
  defs: Property[] | null;
  customValues: Record<string, PropertyValue>;
}

interface PropertiesFormProps {
  propValues: CreateEntryPropertyValues;
  onPropValueChange: (
    propId: string,
    propValue: CreateEntryPropertyValue,
  ) => void;
  defs: Property[];
  customValues: Record<string, PropertyValue>;
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
        >
          <option value='' disabled>
            Select
          </option>
          {Object.entries(prop.options).map(([key, opt]) => (
            <option key={key}>{opt}</option>
          ))}
        </select>
      )}
      {prop.type === 'multi' && prop.options && (
        <>
          {Object.entries(prop.options).map(([key, opt]) => (
            <>
              <input key={key} type='checkbox' className='basic-slide' />
              <label>{opt}</label>
            </>
          ))}
        </>
      )}
      {prop.type === CustomType.Text && (
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
  propValues,
  onPropValueChange,
  defs,
  customValues,
}) => {
  return (
    <div>
      {defs.map((prop) => (
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

const EditEntryDialog: FC<EditEntryDialogProps> = ({
  selectedLang,
  onAddEntry,
  entry,
  onClose,
  defs,
  customValues,
}) => {
  const [translation, setTranslation] = useState(entry.translation);
  const [
    propertyValues,
    setPropertyValues,
  ] = useState<CreateEntryPropertyValues>(customValues);

  const [addEntry, { loading }] = useMutation(() =>
    createEntry({
      original: entry.original,
      translation,
      langId: selectedLang.id,
      partOfSpeech: entry.partOfSpeech.toLowerCase() as PartOfSpeech,
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
          <h3>Edit Entry</h3>
        </div>
        <p>
          <label>ENTRY (IN {selectedLang.name.toUpperCase()})</label> <br />
          <input disabled className='basic-slide' value={entry.original} />
        </p>
        <p>
          <label>PART OF SPEECH</label> <br />
          <input disabled className='basic-slide' value={entry.partOfSpeech} />
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
        {defs && (
          <div>
            <PropertiesForm
              propValues={propertyValues}
              defs={defs}
              onPropValueChange={(propId, propValue) =>
                setPropertyValues({ ...propertyValues, [propId]: propValue })
              }
              customValues={customValues}
            />
          </div>
        )}
        <button className='confirm-button' onClick={() => handleSubmit()}>
          SUBMIT
        </button>
      </dialog>
    </div>
  );
};

export default EditEntryDialog;
