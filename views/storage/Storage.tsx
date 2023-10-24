import { useIntl } from 'react-intl';
import { Navigation, NavigationFunctionComponent } from 'react-native-navigation';
import { LoaderScreen } from 'react-native-ui-lib';
import { useAppSelector } from '../../store/store';
import { selectServerApiUrl } from '../../store/settings';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { menuButton, useMenu } from '../menu/menuHelpers';
import { messages } from './messages';
import { get } from '../../helpers/rest';
import { Stats, StorageInfo, StorageShortPlace } from '../../helpers/interfaces';
import { ScrollView } from 'react-native-gesture-handler';
import { Background } from '../../components/Background';
import { StorageChart } from './StorageChart';
import { StorageTable } from './StorageTable';
import { StyleSheet } from 'react-native';
import { refreshButton } from '../../helpers/buttonts';

const styles = StyleSheet.create({
  wrapper: {
    margin: 20,
  },
});

export const Storage: NavigationFunctionComponent = ({componentId}) => {
  useMenu(componentId, 'storage');
  const [storage, setStorage] = useState<Record<StorageShortPlace, StorageInfo>>();
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

  useEffect(() => {
    refresh();
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    get<Stats>(`${apiUrl}/stats`).then(stats => {
      setStorage({
        clips: stats.service.storage['/media/frigate/clips'],
        recordings: stats.service.storage['/media/frigate/recordings'],
        cache: stats.service.storage['/tmp/cache'],
        shm: stats.service.storage['/dev/shm'],
      });
      setLoading(false);
    });
  }, [apiUrl]);

  return (
    loading || storage === undefined
      ? (
          <LoaderScreen />
        )
      : (
          <Background>
            <ScrollView style={styles.wrapper}>
              <StorageChart storage={storage} />
              <StorageTable storage={storage} />
            </ScrollView>
          </Background>
        )
  );
};
