import {FC, useMemo} from 'react';
import {Text, View} from 'react-native-ui-lib';
import {messages} from './messages';
import {useIntl} from 'react-intl';
import {formatDistance, formatRelative} from 'date-fns';
import {useDateLocale} from '../../helpers/locale';
import {Service} from '../../helpers/interfaces';
import {useStyles} from '../../helpers/colors';

interface ISystemInfoProps {
  service: Service;
}

export const SystemInfo: FC<ISystemInfoProps> = ({service}) => {
  const styles = useStyles(({theme}) => ({
    info: {
      flexDirection: 'column',
      borderTopWidth: 1,
      borderColor: theme.border,
      marginTop: 20,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    text: {
      color: theme.text,
    },
    textLabel: {
      color: theme.text,
      fontWeight: '600',
    },
    updateAvailable: {
      color: theme.text,
      fontWeight: '600',
      fontStyle: 'italic',
    },
    version: {
      marginTop: 10,
    },
  }));

  const dateLocale = useDateLocale();
  const intl = useIntl();

  const isUpdateAvailable = useMemo(
    () =>
      service.latest_version !== undefined &&
      service.version !== service.latest_version,
    [service],
  );

  const dataUpdatedTime = useMemo(
    () =>
      service.last_updated
        ? formatRelative(new Date(service.last_updated * 1000), new Date(), {
            locale: dateLocale,
          })
        : '-',
    [service],
  );

  const uptime = useMemo(
    () =>
      formatDistance(
        new Date(new Date().getTime() - service.uptime * 1000),
        new Date(),
        {
          includeSeconds: true,
          locale: dateLocale,
        },
      ),
    [service],
  );

  return (
    <View style={styles.info}>
      <View style={styles.infoRow}>
        <Text style={styles.textLabel}>
          {intl.formatMessage(messages['info.data_updated'])}:{' '}
        </Text>
        <Text style={styles.text}>{dataUpdatedTime}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.textLabel}>
          {intl.formatMessage(messages['info.uptime'])}:{' '}
        </Text>
        <Text style={styles.text}>{uptime}</Text>
      </View>
      <View style={[styles.infoRow, styles.version]}>
        <Text style={styles.text}>
          {intl.formatMessage(messages['info.current_version'], {
            version: service.version,
          })}
        </Text>
      </View>
      {isUpdateAvailable && (
        <View style={styles.infoRow}>
          <Text style={styles.updateAvailable}>
            {intl.formatMessage(messages['info.latest_version'], {
              version: service.latest_version,
            })}
          </Text>
        </View>
      )}
    </View>
  );
};
