import React, { useState, FC } from 'react';

import '../App.css';
import { Language, Property } from '../../api/types';
import { getLanguageProperties } from '../../api/client';
import { useQuery } from '../../api/useQuery';
import AddPropertyDialog from './AddPropertyDialog';
import EditPropertyDialog from './EditPropertyDialog';

interface PropertiesPageProps {
  selectedLang: Language | undefined;
}

const PropertiesPage: FC<PropertiesPageProps> = ({ selectedLang }) => {
  if (!selectedLang) return <div> </div>;

  const [open, setOpen] = useState(false);
  const [openedProperty, setOpenedProperty] = useState<Property | undefined>(
    undefined,
  );

  const { loading, error, data } = useQuery<Property[]>(() =>
    getLanguageProperties(selectedLang.id).then((page) => page.items),
  );
  const properties = data ?? [];

  if (error) return <p>Error!</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h3>Properties of {selectedLang.name}</h3>
      <h4>Noun</h4>
      <div className='grid-container-2-equal'>
        <div className='grid-item'>
          {properties &&
            properties.map((property) => (
              <div className='entry-row grid-item' key={property.id}>
                <a onClick={() => setOpenedProperty(property)}>
                  <div>{property.name}</div>
                </a>
              </div>
            ))}
        </div>
      </div>
      <button className='round-button' onClick={() => setOpen(true)}>
        <i className='fas fa-plus'></i>
      </button>
      {open && (
        <AddPropertyDialog
          selectedLang={selectedLang}
          onClose={() => setOpen(false)}
        />
      )}
      {openedProperty && (
        <EditPropertyDialog
          property={openedProperty}
          onClose={() => setOpenedProperty(undefined)}
        />
      )}
    </div>
  );
};
export default PropertiesPage;
