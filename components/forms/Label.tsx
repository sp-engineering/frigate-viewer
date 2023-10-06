import React, {FC} from 'react';
import {StyleSheet, Text, TextInputProps, View} from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  text: {
    color: 'black',
  },
  error: {
    color: 'red',
  },
});

export interface ILabelProps extends TextInputProps {
  text: string;
  touched?: boolean;
  error?: string;
}

export const Label: FC<ILabelProps> = ({text, touched, error, children}) => (
  <View style={styles.wrapper}>
    <Text style={styles.text}>{text}</Text>
    {children}
    {touched && error && <Text style={styles.error}>{error}</Text>}
  </View>
);
