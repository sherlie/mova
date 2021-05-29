import React, { useState, FC } from 'react';
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
} from '../../api/types';
import { useMutation } from '../../api/useMutation';
import { useQuery } from '../../api/useQuery';
import '../App.css';

interface AddEntryDialogProps {
  selectedLang: Language;
  onAddEntry: (entry: Entry) => void;
  onClose: () => void;
}
interface PropertiesFormProps {
  pos: PartOfSpeech;
  selectedLang: Language;
}

interface PropertyRowProps {
  prop: Property;
  onPropValueChange: (propValue: CreateEntryPropertyValue) => void;
}

const PropertyRow: FC<PropertyRowProps> = ({ prop, onPropValueChange }) => {
  const [text, setText] = useState<string>();

  return (
    <p key={prop.id}>
      <label className='label'>{prop.name.toUpperCase()}</label> <br />
      {prop.type === 'single' && prop.options && (
        <select className='basic-slide'>
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
            const text = event.target.value;
            setText(text);
            onPropValueChange({ text });
          }}
          value={text}
        />
      )}
    </p>
  );
};

const PropertiesForm: FC<PropertiesFormProps> = ({ pos, selectedLang }) => {
  const { data: propertiesData } = useQuery<Property[]>(
    getLanguageProperties(selectedLang.id).then((page) => page.items),
  );
  const properties = propertiesData ?? [];

  const [
    propertyValues,
    setPropertyValues,
  ] = useState<CreateEntryPropertyValues>({});

  if (!properties || properties.length < 1) return <div />;
  const propertiesPOS = properties.filter((prop) => prop.partOfSpeech === pos);

  console.log(properties);
  console.log(pos);

  return (
    <div>
      {propertiesPOS.map((prop) => (
        <PropertyRow
          key={prop.id}
          prop={prop}
          onPropValueChange={(propValue) => {
            setPropertyValues({ ...propertyValues, [prop.id]: propValue });
          }}
        />
      ))}
    </div>
  );
};

const AddEntryDialog: FC<AddEntryDialogProps> = ({
  selectedLang,
  onAddEntry,
  onClose,
}) => {
  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');
  const [pos, setPos] = useState<PartOfSpeech>(PartOfSpeech.Noun);

  const [addEntry, { loading }] = useMutation(() =>
    createEntry({
      original,
      translation,
      langId: selectedLang.id,
      partOfSpeech: pos.toLowerCase() as PartOfSpeech,
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
    <dialog open className='center dialog'>
      {loading && <p>Loading...</p>}
      <a className='topright' onClick={onClose}>
        <i className='fas fa-window-close'></i>
      </a>
      <h3>Add New Entry</h3>
      <p>
        <label>ENTRY (IN {selectedLang.name.toUpperCase()})</label> <br />
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
        <PropertiesForm pos={pos} selectedLang={selectedLang} />
      </div>
      <button className='confirm-button' onClick={() => handleSubmit()}>
        SUBMIT
      </button>
    </dialog>
  );
};

export default AddEntryDialog;
