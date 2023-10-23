import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { StyleSheet, Text } from 'react-native';
import { Navigation, NavigationFunctionComponent, OptionsTopBarButton } from 'react-native-navigation';
import { LoaderScreen, TabController, TabControllerItemProps, View } from 'react-native-ui-lib';
import { messages } from './messages';
import { menuButton } from '../menu/menuHelpers';
import { useAppSelector } from '../../store/store';
import { selectServerApiUrl } from '../../store/settings';
import { Log, LogPreview } from './LogPreview';
const { TabBar, TabPage } = TabController;

const refreshButton: (onPress?: () => void) => OptionsTopBarButton = onPress => ({
  id: 'refresh',
  component: {
    id: 'FilterButton',
    name: 'TopBarButton',
    passProps: {
      icon: 'sync',
      onPress,
    },
  },
});

const styles = StyleSheet.create({
  noLogs: {
    padding: 20,
    color: 'black',
    textAlign: 'center',
  },
});

export const Logs: NavigationFunctionComponent = ({componentId}) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = useAppSelector(selectServerApiUrl);
  const intl = useIntl();

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: intl.formatMessage(messages['topBar.title']),
        },
        leftButtons: [menuButton],
        rightButtons: [refreshButton(refresh)],
      },
    });
  }, [componentId, intl]);

  const refresh = useCallback(() => {
    setLoading(true);
    const logsTypes = ['frigate', 'go2rtc', 'nginx'];
    Promise.allSettled(
      logsTypes.map(
        logType => fetch(`${apiUrl}/logs/${logType}`)
          .then(result => {
            const statusGroup = Math.floor(result.status / 100);
            if (statusGroup === 2) {
              return result.text();
            } else {
              throw new Error(`Status: ${result.status}`);
            }
          })
      ),
    ).then(logsData => {
      const updatedLogs: Log[] = logsTypes
        .map((logType, i) => ({ logType, result: logsData[i] }))
        .filter(log => log.result.status === 'fulfilled')
        .map(log => ({
          name: log.logType,
          data: (log.result as PromiseFulfilledResult<string>).value.split('\n').reverse(),
        }));
      setLogs(updatedLogs);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  const tabBarItems: TabControllerItemProps[] = useMemo(() =>
    logs.map(log => ({label: log.name})),
    [logs],
  );

  return (
    loading
      ? (
          <LoaderScreen />
        )
      : logs.length > 1
        ? (
            <TabController items={tabBarItems}>
              <TabBar enableShadow />
              <View flex>
                {logs.map((log, index) => (
                  <TabPage index={index} key={log.name}>
                    <LogPreview log={log} />
                  </TabPage>
                ))}
              </View>
            </TabController>
          )
        : logs.length > 0
          ? <LogPreview log={logs[0]} />
          : <Text style={styles.noLogs}>{intl.formatMessage(messages['noLogs'])}</Text>
  );
};
