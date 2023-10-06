import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';

/**
 * STORE MODEL
 **/

export interface IEventsState {
  available: {
    cameras: string[];
    labels: string[];
    zones: string[];
  };
  filters: {
    cameras: string[];
    labels: string[];
    zones: string[];
  };
}

export const initialState: IEventsState = {
  available: {
    cameras: [],
    labels: [],
    zones: [],
  },
  filters: {
    cameras: [],
    labels: [],
    zones: [],
  },
};

/**
 * REDUCERS
 **/

export const eventsStore = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setAvailableCameras: (state, action: PayloadAction<string[]>) => {
      state.available.cameras = action.payload;
    },
    setAvailableLabels: (state, action: PayloadAction<string[]>) => {
      state.available.labels = action.payload;
    },
    setAvailableZones: (state, action: PayloadAction<string[]>) => {
      state.available.zones = action.payload;
    },
    setFiltersCameras: (state, action: PayloadAction<string[]>) => {
      state.filters.cameras = action.payload;
    },
    setFiltersLabels: (state, action: PayloadAction<string[]>) => {
      state.filters.labels = action.payload;
    },
    setFiltersZones: (state, action: PayloadAction<string[]>) => {
      state.filters.zones = action.payload;
    },
  },
});

/**
 * ACTIONS
 **/

export const {
  setAvailableCameras,
  setAvailableLabels,
  setAvailableZones,
  setFiltersCameras,
  setFiltersLabels,
  setFiltersZones,
} = eventsStore.actions;

/**
 * SELECTORS
 **/

const eventsState = (state: RootState) => state.events;

/* available */

export const selectAvailable = (state: RootState) =>
  eventsState(state).available;

export const selectAvailableCameras = (state: RootState) =>
  selectAvailable(state).cameras;

export const selectAvailableLabels = (state: RootState) =>
  selectAvailable(state).labels;

export const selectAvailableZones = (state: RootState) =>
  selectAvailable(state).zones;

/* filters */

export const selectFilters = (state: RootState) => eventsState(state).filters;

export const selectFiltersCameras = (state: RootState) =>
  selectFilters(state).cameras;

export const selectFiltersLabels = (state: RootState) =>
  selectFilters(state).labels;

export const selectFiltersZones = (state: RootState) =>
  selectFilters(state).zones;
