import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import MainPage from './main/MainPage';
import CardsPage from './cards/CardsPage';
import SettingsPage from './SettingsPage';
import PropertiesPage from './properties/PropertiesPage';

const AppSwitch: FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={MainPage} />
        <Route path='/languages' component={PropertiesPage} />
        <Route path='/settings' component={SettingsPage} />
        <Route path='/cards' component={CardsPage} />
      </Switch>
    </Router>
  );
};

export default AppSwitch;
