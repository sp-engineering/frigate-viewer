import {useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {Text} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {
  LoaderScreen,
  TabController,
  TabControllerItemProps,
  View,
} from 'react-native-ui-lib';
import {messages} from './messages';
import {menuButton, useMenu} from '../menu/menuHelpers';
import {useAppSelector} from '../../store/store';
import {
  selectServerApiUrl,
  selectServerCredentials,
} from '../../store/settings';
import {Log, LogPreview} from './LogPreview';
import {refreshButton} from '../../helpers/buttonts';
import {useTheme, useStyles} from '../../helpers/colors';
import {get} from '../../helpers/rest';
const {TabBar, TabPage} = TabController;

export const Logs: NavigationFunctionComponent = ({componentId}) => {
  const styles = useStyles(({theme}) => ({
    noLogs: {
      padding: 20,
      color: theme.text,
      textAlign: 'center',
    },
  }));
  const theme = useTheme();

  useMenu(componentId, 'logs');
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = useAppSelector(selectServerApiUrl);
  const credentials = useAppSelector(selectServerCredentials);
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
      logsTypes.map(logType =>
        get(`${apiUrl}/logs/${logType}`, credentials, undefined, false),
      ),
    ).then(logsData => {
      const updatedLogs: Log[] = logsTypes
        .map((logType, i) => ({logType, result: logsData[i]}))
        .filter(log => log.result.status === 'fulfilled')
        .map(log => ({
          name: log.logType,
          data: (log.result as PromiseFulfilledResult<string>).value
            .split('\n')
            .reverse(),
        }));
      setLogs(updatedLogs);
      setLoading(false);
    });
  }, [apiUrl]);

  useEffect(() => {
    refresh();
  }, []);

  const tabBarItems: TabControllerItemProps[] = useMemo(
    () =>
      logs.map(log => ({
        label: log.name,
        labelColor: theme.link,
        selectedLabelColor: theme.text,
        backgroundColor: theme.background,
        activeBackgroundColor: theme.background,
      })),
    [logs, theme],
  );

  return loading ? (
    <LoaderScreen
      backgroundColor={theme.background}
      loaderColor={theme.text}
      overlay
    />
  ) : logs.length > 1 ? (
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
  ) : logs.length > 0 ? (
    <LogPreview log={logs[0]} />
  ) : (
    <Text style={styles.noLogs}>{intl.formatMessage(messages['noLogs'])}</Text>
  );
};
