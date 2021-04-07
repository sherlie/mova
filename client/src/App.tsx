import React, { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';

import './App.css';
import MainPage from './MainPage';
import { client } from './api';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className='App'>
        <MainPage />
      </div>
    </ApolloProvider>
  );
}

export default App;
