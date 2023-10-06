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
  cameras: {
    refreshFrequency: number;
    numColumns: number;
    previewHeight: number;
  };
  events: {
    numColumns: number;
    snapshotHeight: number;
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
  cameras: {
    refreshFrequency: 10,
    numColumns: 1,
    previewHeight: 222,
  },
  events: {
    numColumns: 1,
    snapshotHeight: 222,
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
    fillGapsWithInitialData: state => {
      const fillGaps: <T extends object>(
        initial: T,
        current?: Partial<T>,
      ) => T = <T extends object>(initial: T, current?: Partial<T>) =>
        Object.keys(initial).reduce<T>((settings: T, k: string) => {
          const key: keyof T = k as keyof T;
          return {
            ...settings,
            [key]:
              typeof initial[key] === 'object' && !Array.isArray(initial[key])
                ? fillGaps(
                    initial[key] as object,
                    current ? (current[key] as object) : {},
                  )
                : current !== undefined && current[key] !== undefined
                ? current[key]
                : initial[key],
          } as T;
        }, {} as T);
      state.v1 = fillGaps(initialSettings, state.v1);
    },
    saveSettings: (state, action: PayloadAction<ISettings>) => {
      state.v1 = action.payload;
    },
    setCameraPreviewHeight: (state, action: PayloadAction<number>) => {
      state.v1.cameras.previewHeight = action.payload;
    },
    setEventSnapshotHeight: (state, action: PayloadAction<number>) => {
      state.v1.events.snapshotHeight = action.payload;
    },
  },
});

/**
 * ACTIONS
 **/

export const {
  fillGapsWithInitialData,
  saveSettings,
  setCameraPreviewHeight,
  setEventSnapshotHeight,
} = settingsStore.actions;

/**
 * SELECTORS
 **/

const settingsState = (state: RootState) => state.settings;

export const selectSettings = (state: RootState) => settingsState(state).v1;

/* server */

export const selectServer = (state: RootState) => selectSettings(state).server;

export const selectServerApiUrl = (state: RootState) => {
  const {protocol, host, port} = selectServer(state);
  return protocol && host && port
    ? `${protocol}://${host}:${port}/api`
    : undefined;
};

/* locale */

export const selectLocale = (state: RootState) => selectSettings(state).locale;

export const selectLocaleRegion = (state: RootState) =>
  selectLocale(state).region;

export const selectLocaleDatesDisplay = (state: RootState) =>
  selectLocale(state).datesDisplay;

/* cameras */

export const selectCameras = (state: RootState) =>
  selectSettings(state).cameras;

export const selectCamerasRefreshFrequency = (state: RootState) =>
  selectCameras(state).refreshFrequency;

export const selectCamerasNumColumns = (state: RootState) =>
  selectCameras(state).numColumns;

export const selectCamerasPreviewHeight = (state: RootState) =>
  selectCameras(state).previewHeight;

/* events */

export const selectEvents = (state: RootState) => selectSettings(state).events;

export const selectEventsNumColumns = (state: RootState) =>
  selectEvents(state).numColumns;

export const selectEventsSnapshotHeight = (state: RootState) =>
  selectEvents(state).snapshotHeight;
