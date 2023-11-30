import { useIntl } from 'react-intl';
import { Navigation, NavigationFunctionComponent } from 'react-native-navigation';
import { Carousel, LoaderScreen, PageControlPosition } from 'react-native-ui-lib';
import { useAppSelector } from '../../store/store';
import { selectServerApiUrl, selectServerCredentials } from '../../store/settings';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { menuButton, useMenu } from '../menu/menuHelpers';
import { messages } from './messages';
import { get } from '../../helpers/rest';
import { CamerasStorage, Stats, StorageInfo, StorageShortPlace } from '../../helpers/interfaces';
import { ScrollView } from 'react-native-gesture-handler';
import { Background } from '../../components/Background';
import { StorageChart } from './StorageChart';
import { StorageTable } from './StorageTable';
import { StyleSheet } from 'react-native';
import { refreshButton } from '../../helpers/buttonts';
import { CamerasStorageChart } from './CamerasStorageChart';
import { CamerasStorageTable } from './CamerasStorageTable';

const styles = StyleSheet.create({
  wrapper: {
    margin: 20,
  },
});

export const Storage: NavigationFunctionComponent = ({componentId}) => {
  useMenu(componentId, 'storage');
  const [storage, setStorage] = useState<Record<StorageShortPlace, StorageInfo>>();
  const [camerasStorage, setCamerasStorage] = useState<CamerasStorage>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
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

  useEffect(() => {
    refresh();
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    Promise.allSettled([
      get<Stats>(`${apiUrl}/stats`, credentials),
      get<CamerasStorage>(`${apiUrl}/recordings/storage`, credentials),
    ])
      .then(([stats, cameras]) => {
        if (stats.status === 'fulfilled') {
          const { service} = stats.value;
          setStorage({
            clips: service.storage['/media/frigate/clips'],
            recordings: service.storage['/media/frigate/recordings'],
            cache: service.storage['/tmp/cache'],
            shm: service.storage['/dev/shm'],
          });
        }
        if (cameras.status === 'fulfilled') {
          setCamerasStorage(cameras.value);
        }
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
              <Carousel
                pageControlPosition={PageControlPosition.UNDER}
                onChangePage={setPage}
              >
                <StorageChart storage={storage} />
                {camerasStorage !== undefined && <CamerasStorageChart camerasStorage={camerasStorage} />}
              </Carousel>
              {page === 0 && <StorageTable storage={storage} />}
              {camerasStorage && page === 1 && <CamerasStorageTable camerasStorage={camerasStorage} />}
            </ScrollView>
          </Background>
        )
  );
};
