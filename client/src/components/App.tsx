import React, { FC } from 'react';
import { ApolloProvider } from '@apollo/client';

import './App.css';
import { client } from '../graphql/client';
import SettingsPage from './settings/SettingsPage';

export const App: FC = () => {
  return (
    <ApolloProvider client={client}>
      <div className='App'>
        <SettingsPage />
      </div>
    </ApolloProvider>
  );
};

export default App;
