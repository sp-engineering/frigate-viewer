import React, {FC, useMemo} from 'react';
import {useIntl} from 'react-intl';
import {Pressable, Text, View} from 'react-native';
import {Server} from '../../store/settings';
import {useStyles, useTheme} from '../../helpers/colors';
import {buildServerUrl} from '../../helpers/rest';
import {messages} from './messages';
import {IconOutline} from '@ant-design/icons-react-native';

interface ServerItemProps {
  server: Server;
  onPress?: () => void;
  onRemovePress?: () => void;
}

export const ServerItem: FC<ServerItemProps> = ({
  server,
  onPress,
  onRemovePress,
}) => {
  const styles = useStyles(({theme}) => ({
    wrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      marginVertical: 8,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderBottomWidth: 2,
      borderColor: theme.text,
      borderRadius: 4,
    },
    data: {
      flex: 1,
    },
    url: {
      color: theme.text,
    },
    property: {
      flexDirection: 'row',
    },
    propertyLabel: {
      fontSize: 10,
      color: theme.text,
      fontWeight: 'bold',
      paddingRight: 4,
    },
    propertyValue: {
      fontSize: 10,
      color: theme.text,
    },
  }));
  const theme = useTheme();
  const intl = useIntl();

  const url = useMemo(() => buildServerUrl(server), [server]) ?? '-';

  return (
    <Pressable style={styles.wrapper} onPress={onPress}>
      <View style={styles.data}>
        <Text style={styles.url}>{url}</Text>
        <View style={styles.property}>
          <Text style={styles.propertyLabel}>
            {intl.formatMessage(messages['server.auth.label'])}:
          </Text>
          <Text style={styles.propertyValue}>
            {server.auth === 'none'
              ? intl.formatMessage(messages['server.auth.option.none'])
              : server.auth}
          </Text>
        </View>
        {(server.auth === 'basic' || server.auth === 'frigate') && (
          <View style={styles.property}>
            <Text style={styles.propertyLabel}>
              {intl.formatMessage(messages['server.username.label'])}:
            </Text>
            <Text style={styles.propertyValue}>
              {server.credentials.username}
            </Text>
          </View>
        )}
      </View>
      <View>
        <IconOutline
          name="delete"
          color={theme.text}
          size={24}
          onPress={onRemovePress}
        />
      </View>
    </Pressable>
  );
};
