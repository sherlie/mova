import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'cookies-js';
import { Language } from '../api/types';

const COOKIE_SELECTED_LANG = 'selectedLang';

interface LangState {
  value: Language | undefined;
}

const initialState: LangState = {
  value: getSelectedLangCookie(),
};

export const langSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    select: (state, action: PayloadAction<Language>) => {
      const selectedLang = action.payload;
      state.value = selectedLang;
      setSelectedLangCookie(selectedLang);
    },
  },
});

export const { select } = langSlice.actions;

export default langSlice.reducer;

function getSelectedLangCookie(): Language | undefined {
  const cookie = Cookies.get(COOKIE_SELECTED_LANG);
  return cookie && JSON.parse(cookie);
}

function setSelectedLangCookie(selectedLang: Language) {
  Cookies.set(COOKIE_SELECTED_LANG, JSON.stringify(selectedLang));
}
