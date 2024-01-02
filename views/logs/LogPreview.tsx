import { FC } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Text } from 'react-native-ui-lib';
import { colors } from '../../store/colors';

export interface Log {
  name: string;
  data: string[];
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    backgroundColor: colors.background,
    color: colors.text,
  },
  line: {
    backgroundColor: colors.background,
    color: colors.text,
    marginVertical: 6,
  },
});

interface ILogPreviewProps {
  log: Log;
}

export const LogPreview: FC<ILogPreviewProps> = ({log}) => (
  <FlatList
    style={styles.wrapper}
    data={log.data}
    renderItem={({item}) => <Text style={styles.line}>{item}</Text>}
    keyExtractor={(_, index) => `${index}`}
    inverted={true}
  />
);
