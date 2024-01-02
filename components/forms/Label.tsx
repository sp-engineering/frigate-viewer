import React, {FC} from 'react';
import {StyleSheet, Text, TextInputProps, View} from 'react-native';
import { colors } from '../../store/colors';

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text,
  },
  error: {
    color: 'red',
  },
  required: {
    color: 'red',
  },
});

export interface ILabelProps extends TextInputProps {
  text: string;
  touched?: boolean;
  error?: string;
  required?: boolean;
}

export const Label: FC<ILabelProps> = ({
  text,
  touched,
  error,
  required,
  children,
}) => (
  <View style={styles.wrapper}>
    <Text style={styles.text}>
      <Text>{text}</Text>
      {required && <Text style={styles.required}>*</Text>}
    </Text>
    {children}
    {touched && error && <Text style={styles.error}>{error}</Text>}
  </View>
);
