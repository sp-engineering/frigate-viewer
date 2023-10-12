import { FC, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { messages } from './messages';
import { useOpenLink } from './useOpenLink';

const libs = [
  '@ant-design/icons-react-native',
  '@react-native-async-storage/async-storage',
  '@reduxjs/toolkit',
  'date-fns',
  'formik',
  'react',
  'react-intl',
  'react-native',
  'react-native-gesture-handler',
  'react-native-navigation',
  'react-native-reanimated',
  'react-native-ui-lib',
  'react-native-vlc-media-player',
  'react-redux',
  'redux',
  'redux-persist',
  'yup',
];

const styles = StyleSheet.create({
  wrapper: {
    margin: 20,
    marginTop: 0,
    paddingTop: 20,
    borderColor: '#00000088',
    borderTopWidth: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  header: {
    marginBottom: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  lib: {
    marginBottom: 5,
    color: 'blue',
  },
});

export const UsedLibs: FC = () => {
  const openLink = useOpenLink();
  const intl = useIntl();

  const openNpm = useCallback((lib: string) => {
    const link = `https://npmjs.com/package/${lib}`;
    return openLink(link);
  }, [openLink]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>
        {intl.formatMessage(messages['usedLibs.header'])}
      </Text>
      {libs.map((lib, index) => (
        <Pressable
          onPress={openNpm(lib)}
          key={index}
        >
          <Text style={styles.lib}>{lib}</Text>
        </Pressable>
      ))}
    </View>
  );
};
