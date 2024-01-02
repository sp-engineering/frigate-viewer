import React, {FC} from 'react';
import {StyleSheet, Text, TextInputProps, View} from 'react-native';
import { colors } from '../../store/colors';

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
    backgroundColor: colors.background,
    color: colors.text,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
});

export interface ISectionProps extends TextInputProps {
  header: string | JSX.Element;
}

export const Section: FC<ISectionProps> = ({header, children}) => (
  <View style={styles.wrapper}>
    <Text style={styles.header}>{header}</Text>
    {children}
  </View>
);
