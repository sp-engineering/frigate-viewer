import {FC, useCallback} from 'react';
import {useIntl} from 'react-intl';
import {Pressable, Text, View} from 'react-native';
import {messages} from './messages';
import {useOpenLink} from './useOpenLink';
import {useStyles} from '../../helpers/colors';

const libs = [
  '@ant-design/icons-react-native',
  '@lunarr/vlc-player',
  '@react-native-async-storage/async-storage',
  '@reduxjs/toolkit',
  'buffer',
  'date-fns',
  'formik',
  'react',
  'react-intl',
  'react-native',
  'react-native-gesture-handler',
  'react-native-navigation',
  'react-native-reanimated',
  'react-native-reanimated-table',
  'react-native-svg',
  'react-native-svg-charts',
  'react-native-ui-lib',
  'react-redux',
  'redux',
  'redux-persist',
  'rn-fetch-blob',
  'yup',
];

export const UsedLibs: FC = () => {
  const openLink = useOpenLink();
  const intl = useIntl();

  const styles = useStyles(({theme}) => ({
    wrapper: {
      margin: 20,
      marginTop: 0,
      paddingTop: 20,
      borderColor: theme.border,
      borderTopWidth: 1,
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    header: {
      marginBottom: 10,
      color: theme.text,
      fontWeight: 'bold',
    },
    lib: {
      marginBottom: 5,
      color: theme.link,
    },
  }));

  const openNpm = useCallback(
    (lib: string) => {
      const link = `https://npmjs.com/package/${lib}`;
      return openLink(link);
    },
    [openLink],
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>
        {intl.formatMessage(messages['usedLibs.header'])}
      </Text>
      {libs.map((lib, index) => (
        <Pressable onPress={openNpm(lib)} key={index}>
          <Text style={styles.lib}>{lib}</Text>
        </Pressable>
      ))}
    </View>
  );
};
