import React from 'react';
import {
  NavigationFunctionComponent,
  NavigationProps,
} from 'react-native-navigation';
import {Provider} from 'react-redux';
import {store} from '../store/store';

export const componentWithRedux =
  <P,>(
    Component: NavigationFunctionComponent<P>,
  ): NavigationFunctionComponent<P> =>
  (props: P & NavigationProps) =>
    (
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    );
