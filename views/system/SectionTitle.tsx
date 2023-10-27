import { FC, PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-ui-lib';

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
  },
});

export const SectionTitle: FC<PropsWithChildren> = ({children}) => (
  <Text style={styles.text}>{children}</Text>
);
