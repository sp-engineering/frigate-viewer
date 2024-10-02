import {FC} from 'react';
import {StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text} from 'react-native-ui-lib';

export interface Log {
  name: string;
  data: string[];
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    backgroundColor: 'white',
  },
  line: {
    color: 'black',
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
