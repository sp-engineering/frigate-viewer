import { FC } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors } from '../store/colors';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background,
    color: colors.text,
  },
});

export const Background: FC<ViewProps> = ({children}) => (
  <View style={styles.wrapper}>{children}</View>
);
