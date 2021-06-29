import React, { useState, FC } from 'react';
import {
  CreateEntryPropertyValue,
  CreateEntryPropertyValues,
  updateEntry,
} from '../../api/client';

import {
  PropertyType,
  Entry,
  partOfSpeechLabel,
  Property,
  PropertyValue,
} from '../../api/types';
import { useMutation } from '../../api/useMutation';
import { useLangSelector } from '../../store';
import '../App.css';

interface EditEntryDialogProps {
  entry: Entry;
  onEditEntry: (entry: Entry) => void;
  onClose: () => void;
  defs: Property[] | null;
  customValues: Record<string, PropertyValue>;
}

const EditEntryDialog: FC<EditEntryDialogProps> = ({
  onEditEntry,
  entry,
  onClose,
  defs,
  customValues,
}) => {
  const selectedLang = useLangSelector();
  const [original, setOriginal] = useState(entry.original);
  const [translation, setTranslation] = useState(entry.translation);
  const [
    propertyValues,
    setPropertyValues,
  ] = useState<CreateEntryPropertyValues>(customValues);

  const [editEntry, { loading }] = useMutation(() =>
    updateEntry(
      {
        original: original,
        translation,
        langId: selectedLang!.id,
        partOfSpeech: entry.partOfSpeech,
        customValues: propertyValues,
      },
      entry.id,
    ),
  );

  const handleSubmit = async () => {
    const result = await editEntry();
    if (result) {
      onEditEntry(result);
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
          <label>PART OF SPEECH: {partOfSpeechLabel(entry.partOfSpeech)}</label>{' '}
          <br />
        </p>
        {defs && (
          <div>
            <PropertiesForm
              propValues={propertyValues}
              defs={defs}
              onPropValueChange={(propId, propValue) =>
                setPropertyValues({ ...propertyValues, [propId]: propValue })
              }
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

interface PropertiesFormProps {
  propValues: CreateEntryPropertyValues;
  onPropValueChange: (
    propId: string,
    propValue: CreateEntryPropertyValue,
  ) => void;
  defs: Property[];
}

const PropertiesForm: FC<PropertiesFormProps> = ({
  propValues,
  onPropValueChange,
  defs,
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

export default EditEntryDialog;
