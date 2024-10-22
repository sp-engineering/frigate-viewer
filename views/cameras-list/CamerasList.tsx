import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {FlatList, Text} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {useRest} from '../../helpers/rest';
import {
  selectAvailableCameras,
  setAvailableCameras,
  setAvailableLabels,
  setAvailableZones,
} from '../../store/events';
import {selectCamerasNumColumns, selectServer} from '../../store/settings';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {menuButton, useMenu} from '../menu/menuHelpers';
import {CameraTile} from './CameraTile';
import {messages} from './messages';
import {useNoServer} from '../settings/useNoServer';
import {Background} from '../../components/Background';
import {useStyles} from '../../helpers/colors';
import {View} from 'react-native-ui-lib';
import {Refresh} from '../../components/Refresh';

interface IConfigResponse {
  cameras: Record<
    string,
    {
      zones: Record<string, unknown>;
    }
  >;
  objects: {
    track: string[];
  };
}

export const CamerasList: NavigationFunctionComponent = ({componentId}) => {
  const styles = useStyles(({theme}) => ({
    noCameras: {
      padding: 20,
      color: theme.text,
      textAlign: 'center',
    },
  }));

  useMenu(componentId, 'camerasList');
  useNoServer();
  const [loading, setLoading] = useState(true);
  const server = useAppSelector(selectServer);
  const cameras = useAppSelector(selectAvailableCameras);
  const numColumns = useAppSelector(selectCamerasNumColumns);
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const {get} = useRest();

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: intl.formatMessage(messages['topBar.title']),
        },
        leftButtons: [menuButton],
      },
    });
  }, [componentId, intl]);

  const refresh = () => {
    setLoading(true);
    get<IConfigResponse>(server, `config`)
      .then(config => {
        const availableCameras = Object.keys(config.cameras);
        const availableLabels = config.objects.track;
        const availableZones = availableCameras.reduce(
          (zones, cameraName) => [
            ...zones,
            ...Object.keys(config.cameras[cameraName].zones).filter(
              zoneName => !zones.includes(zoneName),
            ),
          ],
          [] as string[],
        );
        dispatch(setAvailableCameras(availableCameras));
        dispatch(setAvailableLabels(availableLabels));
        dispatch(setAvailableZones(availableZones));
      })
      .catch(() => {
        dispatch(setAvailableCameras([]));
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (server.host) {
      refresh();
    }
  }, [server]);

  return (
    <Background>
      {!loading && cameras.length === 0 && (
        <View>
          <Refresh refreshing={loading} onRefresh={refresh} />
          <Text style={styles.noCameras}>
            {intl.formatMessage(messages['noCameras'])}
          </Text>
        </View>
      )}
      <FlatList
        data={cameras}
        renderItem={({item}) => (
          <CameraTile cameraName={item} componentId={componentId} />
        )}
        key={numColumns}
        keyExtractor={cameraName => cameraName}
        numColumns={numColumns}
        refreshControl={<Refresh refreshing={loading} onRefresh={refresh} />}
      />
    </Background>
  );
};
