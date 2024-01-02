import { FC, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { messages } from './messages';
import { useOpenLink } from './useOpenLink';
import { colors } from '../../store/colors';

const users = [
  'cybersholt',
];

const styles = StyleSheet.create({
  wrapper: {
    margin: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  header: {
    marginBottom: 10,
    color: colors.text,
    fontWeight: 'bold',
  },
  user: {
    marginBottom: 5,
    color: 'blue',
  },
});

export const SpecialThanks: FC = () => {
  const openLink = useOpenLink();
  const intl = useIntl();

  const openGithub = useCallback((user: string) => {
    const link = `https://github.com/${user}`;
    return openLink(link);
  }, [openLink]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>
        {intl.formatMessage(messages['info.specialThanks'])}
      </Text>
      {users.map((user, index) => (
        <Pressable
          onPress={openGithub(user)}
          key={index}
        >
          <Text style={styles.user}>@{user}</Text>
        </Pressable>
      ))}
    </View>
  );
};
