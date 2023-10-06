import React from 'react';
import {
  NavigationFunctionComponent,
  NavigationProps,
} from 'react-native-navigation';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {persistor, store} from '../store/store';

export const componentWithRedux =
  <P,>(
    Component: NavigationFunctionComponent<P>,
  ): NavigationFunctionComponent<P> =>
  (props: P & NavigationProps) =>
    (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Component {...props} />
        </PersistGate>
      </Provider>
    );
