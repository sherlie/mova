import React, { useState, FC } from 'react';

import { GET_LANGUAGES } from '../../queries';
import { Language, Page } from '../../types';
import PropertyDialog from './PropertyDialog';

interface LangPageProps {
  selectedLang: Language | undefined;
}

const LanguagesPage: FC<LangPageProps> = ({ selectedLang }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <h3>Settings to {selectedLang && selectedLang.name}</h3>
      <button onClick={() => setOpen(true)}>add property</button>
      {open && (
        <PropertyDialog
          selectedLang={selectedLang}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};
export default LanguagesPage;
