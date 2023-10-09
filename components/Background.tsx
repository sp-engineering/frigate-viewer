import { FC } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});

export const Background: FC<ViewProps> = ({children}) => (
  <View style={styles.wrapper}>{children}</View>
);
