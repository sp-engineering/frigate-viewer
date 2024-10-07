import React, {FC} from 'react';
import {Text, TextInputProps, View} from 'react-native';
import {useStyles} from '../../helpers/colors';

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
}) => {
  const styles = useStyles(({theme}) => ({
    wrapper: {
      marginVertical: 10,
    },
    text: {
      color: theme.text,
    },
    error: {
      color: theme.error,
    },
    required: {
      color: theme.error,
    },
  }));

  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>
        <Text>{text}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </Text>
      {children}
      {touched && error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};
