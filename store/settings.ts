import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';

/**
 * STORE MODEL
 **/

export type Region = 'enGB' | 'enUS' | 'pl';

export interface ISettings {
  server: {
    protocol: 'http' | 'https';
    host: string;
    port: number;
  };
  locale: {
    region: Region;
    datesDisplay: 'descriptive' | 'numeric';
  };
}

export const initialSettings: ISettings = {
  server: {
    protocol: 'https',
    host: '',
    port: 5000,
  },
  locale: {
    region: 'enGB',
    datesDisplay: 'descriptive',
  },
};

/**
 * REDUCERS
 **/

export const settingsStore = createSlice({
  name: 'settings',
  initialState: {
    v1: initialSettings,
  },
  reducers: {
    saveSettings: (state, action: PayloadAction<ISettings>) => {
      state.v1 = action.payload;
    },
  },
});

/**
 * ACTIONS
 **/

export const {saveSettings} = settingsStore.actions;

/**
 * SELECTORS
 **/

const settingsState = (state: RootState) => state.settings;

export const selectSettings = (state: RootState) => settingsState(state).v1;

/* server */

export const selectServer = (state: RootState) => selectSettings(state).server;

export const selectApiUrl = (state: RootState) => {
  const {protocol, host, port} = selectServer(state);
  return protocol && host && port
    ? `${protocol}://${host}:${port}/api`
    : undefined;
};

/* locale */

export const selectLocale = (state: RootState) => selectSettings(state).locale;

export const selectRegion = (state: RootState) => selectLocale(state).region;

export const selectDatesDisplay = (state: RootState) =>
  selectLocale(state).datesDisplay;
