import React, {useEffect} from 'react';
import {useIntl} from 'react-intl';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {menuButton, useMenu} from '../menu/menuHelpers';
import {messages} from './messages';
import { ScrollView } from 'react-native-gesture-handler';
import { NotificationsFiltersTable } from './NotificationsFiltersTable';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  description: {
    margin: 20,
    color: 'black',
  },
});

export const Notifications: NavigationFunctionComponent = ({componentId}) => {
  useMenu(componentId, 'notifications');
  const intl = useIntl();

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: intl.formatMessage(messages['topBar.title']),
        },
        leftButtons: [menuButton],
      },
    });
  }, [componentId, intl]);

  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.description}>
        <Text>{intl.formatMessage(messages['description'])}</Text>
      </View>
      <NotificationsFiltersTable />
    </ScrollView>
  );
};
