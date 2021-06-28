import { configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import langReducer from './lang';

const store = configureStore({
  reducer: {
    lang: langReducer,
  },
});

export default store;

export type AppState = ReturnType<typeof store.getState>;

export const useLangSelector = () =>
  useSelector((state: AppState) => state.lang.value);
