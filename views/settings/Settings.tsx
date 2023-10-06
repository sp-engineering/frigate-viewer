import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {menuButton, useMenu} from '../menu/menuHelpers';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});

export const Settings: NavigationFunctionComponent = ({componentId}) => {
  useMenu(componentId, 'settings');

  return (
    <View style={styles.wrapper}>
      <Text>Settings</Text>
    </View>
  );
};

Settings.options = () => ({
  topBar: {
    title: {
      text: 'Settings',
    },
    rightButtons: [menuButton],
  },
});
