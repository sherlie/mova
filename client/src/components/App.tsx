import React, { useState } from 'react';

import './App.css';
import LangSelectDialog from './LangSelectDialog';
import Menu from './Menu';
import AppSwitch from './AppSwitch';
import { useLangSelector } from '../store';

function App() {
  const selectedLang = useLangSelector();
  const [open, setOpen] = useState(!selectedLang);

  return (
    <div>
      <Menu setOpen={setOpen} />
      <main>
        <AppSwitch />
      </main>
      {open && <LangSelectDialog onClose={() => setOpen(false)} />}
    </div>
  );
}

export default App;
