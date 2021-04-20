import React, { FC } from 'react';

import { Language } from '../../types';

interface MainPageProps {
  selectedLang: Language | undefined;
}

const MainPage: FC<MainPageProps> = ({ selectedLang }) => {
  return (
    <div>
      <h3>MainPage: {selectedLang && selectedLang.name}</h3>
    </div>
  );
};

export default MainPage;
