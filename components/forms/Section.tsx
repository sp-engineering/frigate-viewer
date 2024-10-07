import React, {FC} from 'react';
import {StyleSheet, Text, TextInputProps, View} from 'react-native';
import {useStyles} from '../../helpers/colors';

export interface ISectionProps extends TextInputProps {
  header: string | JSX.Element;
}

export const Section: FC<ISectionProps> = ({header, children}) => {
  const styles = useStyles(({theme}) => ({
    wrapper: {
      marginVertical: 10,
    },
    header: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
    },
  }));

  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>{header}</Text>
      {children}
    </View>
  );
};
