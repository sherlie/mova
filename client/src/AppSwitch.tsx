import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Language } from '../types';

import MainPage from './main/MainPage';
import LanguagesPage from './settings/LanguagesPage';

interface AppSwitchProps {
  selectedLang: Language | undefined;
}

const AppSwitch: FC<AppSwitchProps> = ({ selectedLang }) => {
  return (
    <Router>
      <Switch>
        <Route
          exact
          path='/'
          render={() => <MainPage selectedLang={selectedLang} />}
        />
        <Route
          path='/languages'
          render={() => <LanguagesPage selectedLang={selectedLang} />}
        />
      </Switch>
    </Router>
  );
};

export default AppSwitch;
