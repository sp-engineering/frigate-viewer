import {FC, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View} from 'react-native-ui-lib';
import {messages} from './messages';
import {useIntl} from 'react-intl';
import {formatDistance, formatRelative} from 'date-fns';
import {useDateLocale} from '../../helpers/locale';
import {Service} from '../../helpers/interfaces';

const styles = StyleSheet.create({
  info: {
    flexDirection: 'column',
    borderTopWidth: 1,
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textLabel: {
    fontWeight: '600',
  },
  updateAvailable: {
    fontWeight: '600',
    fontStyle: 'italic',
  },
  version: {
    marginTop: 10,
  },
});

interface ISystemInfoProps {
  service: Service;
}

export const SystemInfo: FC<ISystemInfoProps> = ({service}) => {
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
        <Text>{dataUpdatedTime}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.textLabel}>
          {intl.formatMessage(messages['info.uptime'])}:{' '}
        </Text>
        <Text>{uptime}</Text>
      </View>
      <View style={[styles.infoRow, styles.version]}>
        <Text>
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
