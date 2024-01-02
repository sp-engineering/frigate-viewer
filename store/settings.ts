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

export interface NotificationsFilter {
  enabled: boolean;
  cameras: string[];
  labels: string[];
  zones: string[];
}

export interface INotifications {
  filters: NotificationsFilter[];
}

const initialNotifications: INotifications = {
  filters: [],
};

export interface ISettings {
  dark: {
    mode: 'auto' | 'light' | 'dark';
    default: 'auto';
    header: 'Styling 1';
    label: 'Dark Mode 1';
  };
  server: {
    protocol: 'http' | 'https';
    host: string;
    port: number;
    credentials: Credentials;
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
    photoPreference: 'snapshot' | 'thumbnail';
  };
}

export const initialSettings: ISettings = {
  dark: {
    mode: 'auto',
    default: 'auto',
    header: 'Styling 1',
    label: 'Dark Mode 1'
  },
  server: {
    protocol: 'https',
    host: '',
    port: 5000,
    credentials: {
      username: '',
      password: '',
    },
  },
  locale: {
    region: NativeModules.I18nManager.localeIdentifier,
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
    photoPreference: 'snapshot',
  },
};

/**
 * REDUCERS
 **/

const isTheSameNotificationsFilter =
  (b: Partial<NotificationsFilter>) => (a: NotificationsFilter) => {
    const camerasMatch =
      a.cameras.length === b.cameras?.length &&
      a.cameras.every((camera: string) => b.cameras?.includes(camera));
    const labelsMatch =
      a.labels.length === b.labels?.length &&
      a.labels.every((label: string) => b.labels?.includes(label));
    const zonesMatch =
      a.zones.length === b.zones?.length &&
      a.zones.every((zone: string) => b.zones?.includes(zone));
    return camerasMatch && labelsMatch && zonesMatch;
  };

export const settingsStore = createSlice({
  name: 'settings',
  initialState: {
    v1: initialSettings,
    notifications: initialNotifications,
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
    addNotificationsFilter: (
      state,
      action: PayloadAction<NotificationsFilter>,
    ) => {
      state.notifications.filters.push(action.payload);
    },
    removeNotificationsFilter: (
      state,
      action: PayloadAction<NotificationsFilter>,
    ) => {
      state.notifications.filters = state.notifications.filters.filter(
        isTheSameNotificationsFilter(action.payload),
      );
    },
    setNotificationsFilterEnabled: (
      state,
      action: PayloadAction<NotificationsFilter>,
    ) => {
      const filter = state.notifications.filters.find(
        isTheSameNotificationsFilter(action.payload),
      );
      if (filter) {
        filter.enabled = action.payload.enabled;
      }
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
  addNotificationsFilter,
  removeNotificationsFilter,
  setNotificationsFilterEnabled,
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

export const selectEventsPhotoPreference = (state: RootState) =>
  selectEvents(state).photoPreference;

/* notifications */

export const selectNotifications = (state: RootState) =>
  settingsState(state).notifications;

export const selectNotificationsFilters = (state: RootState) =>
  selectNotifications(state).filters;

export const selectNotificationsFilter = (
  state: RootState,
  filter: Partial<NotificationsFilter>,
) => {
  return selectNotifications(state).filters.find(
    isTheSameNotificationsFilter(filter),
  );
};
