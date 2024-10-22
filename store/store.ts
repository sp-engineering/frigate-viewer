import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createTransform,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {
  settingsMigrations,
  settingsStore,
  State as SettingsState,
} from './settings';
import {eventsStore} from './events';

const settingsReducer = persistReducer<SettingsState>(
  {
    key: 'settings',
    storage: AsyncStorage,
    transforms: [
      createTransform(
        state => state,
        state => ({...state, ...settingsMigrations(state)}),
      ),
    ],
  },
  settingsStore.reducer,
);

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    events: eventsStore.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const persistor = persistStore(store);
