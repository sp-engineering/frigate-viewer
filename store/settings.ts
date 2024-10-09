import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';
import {NativeModules} from 'react-native';

/**
 * STORE MODEL
 **/

export type Region =
  | 'de_AT'
  | 'de_DE'
  | 'de_LU'
  | 'de_CH'
  | 'en_AU'
  | 'en_CA'
  | 'en_GB'
  | 'en_IE'
  | 'en_NZ'
  | 'en_US'
  | 'es_AR'
  | 'es_BO'
  | 'es_CL'
  | 'es_CO'
  | 'es_CR'
  | 'es_DO'
  | 'es_EC'
  | 'es_ES'
  | 'es_GT'
  | 'es_HN'
  | 'es_MX'
  | 'es_NI'
  | 'es_PA'
  | 'es_PE'
  | 'es_PY'
  | 'es_SV'
  | 'es_UY'
  | 'es_VE'
  | 'fr_FR'
  | 'fr_CA'
  | 'fr_CH'
  | 'pl_PL'
  | 'pt_BR'
  | 'pt_PT'
  | 'uk_UA'
  | 'it_CH'
  | 'it_IT'
  | 'sv_SE';

export interface Credentials {
  username: string;
  password: string;
}

export interface ISettings {
  server: {
    protocol: 'http' | 'https';
    host: string;
    port: number;
    path: string;
    credentials: Credentials;
  };
  locale: {
    region: Region;
    datesDisplay: 'descriptive' | 'numeric';
  };
  app: {
    colorScheme: 'auto' | 'light' | 'dark';
  };
  cameras: {
    refreshFrequency: number;
    liveView: boolean;
    numColumns: number;
    previewHeight: number;
    actionWhenPressed: 'events' | 'preview';
  };
  events: {
    numColumns: number;
    snapshotHeight: number;
    photoPreference: 'snapshot' | 'thumbnail';
    lockLandscapePlaybackOrientation: boolean;
  };
}

export const initialSettings: ISettings = {
  server: {
    protocol: 'https',
    host: '',
    port: 5000,
    path: '',
    credentials: {
      username: '',
      password: '',
    },
  },
  app: {
    colorScheme: 'auto',
  },
  locale: {
    region: NativeModules.I18nManager.localeIdentifier,
    datesDisplay: 'descriptive',
  },
  cameras: {
    refreshFrequency: 10,
    liveView: false,
    numColumns: 1,
    previewHeight: 222,
    actionWhenPressed: 'events',
  },
  events: {
    numColumns: 1,
    snapshotHeight: 222,
    photoPreference: 'snapshot',
    lockLandscapePlaybackOrientation: false,
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
  const {protocol, host, port, path} = selectServer(state);
  const pathPart = path
    ? `${path
        .split('/')
        .filter(p => p !== '')
        .join('/')}/`
    : '';
  return protocol && host && port
    ? `${protocol}://${host}:${port}/${pathPart}api`
    : undefined;
};

export const selectServerCredentials = (state: RootState) => {
  const {credentials} = selectServer(state);
  return credentials !== undefined &&
    credentials.username !== '' &&
    credentials.password !== ''
    ? credentials
    : null;
};

/* locale */

export const selectLocale = (state: RootState) => selectSettings(state).locale;

export const selectLocaleRegion = (state: RootState) =>
  selectLocale(state).region;

export const selectLocaleDatesDisplay = (state: RootState) =>
  selectLocale(state).datesDisplay;

export const selectApp = (state: RootState) => selectSettings(state).app;

export const selectAppColorScheme = (state: RootState) =>
  selectApp(state)?.colorScheme || 'auto';

/* cameras */

export const selectCameras = (state: RootState) =>
  selectSettings(state).cameras;

export const selectCamerasRefreshFrequency = (state: RootState) =>
  selectCameras(state).refreshFrequency;

export const selectCamerasLiveView = (state: RootState) =>
  selectCameras(state).liveView;

export const selectCamerasNumColumns = (state: RootState) =>
  selectCameras(state).numColumns;

export const selectCamerasPreviewHeight = (state: RootState) =>
  selectCameras(state).previewHeight;

export const selectCamerasactionWhenPressed = (state: RootState) =>
  selectCameras(state).actionWhenPressed;

/* events */

export const selectEvents = (state: RootState) => selectSettings(state).events;

export const selectEventsNumColumns = (state: RootState) =>
  selectEvents(state).numColumns;

export const selectEventsSnapshotHeight = (state: RootState) =>
  selectEvents(state).snapshotHeight;

export const selectEventsPhotoPreference = (state: RootState) =>
  selectEvents(state).photoPreference;

export const selectEventsLockLandscapePlaybackOrientation = (
  state: RootState,
) => selectEvents(state).lockLandscapePlaybackOrientation;
