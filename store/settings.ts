import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';

export interface ISettings {
  protocol: 'http' | 'https';
  host: string;
  port: number;
}

export const initialSettings: ISettings = {
  protocol: 'https',
  host: '',
  port: 5000,
};

export const settingsStore = createSlice({
  name: 'settings',
  initialState: {
    settings: initialSettings,
  },
  reducers: {
    saveSettings: (state, action: PayloadAction<ISettings>) => {
      state.settings = action.payload;
    },
  },
});

export const {saveSettings} = settingsStore.actions;

const settingsState = (state: RootState) => state.settings;

export const selectSettings = (state: RootState) =>
  settingsState(state).settings;

export const selectApiUrl = (state: RootState) => {
  const {protocol, host, port} = selectSettings(state);
  return protocol && host && port
    ? `${protocol}://${host}:${port}/api`
    : undefined;
};
