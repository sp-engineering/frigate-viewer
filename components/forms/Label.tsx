import React, {FC} from 'react';
import {StyleSheet, Text, TextInputProps, View} from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  text: {
    color: 'black',
  },
});

interface ILabelProps extends TextInputProps {
  text: string;
}

export const Label: FC<ILabelProps> = ({text, children}) => (
  <View style={styles.wrapper}>
    <Text style={styles.text}>{text}</Text>
    {children}
  </View>
);
