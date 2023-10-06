import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, ToastAndroid} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {catchError, map} from 'rxjs/operators';
import {componentWithRedux} from '../../helpers/redux';
import {get} from '../../helpers/rest';
import {
  fillGapsWithInitialData,
  selectServerApiUrl,
} from '../../store/settings';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {navigateToMenuItem, settingsMenuItem} from '../menu/Menu';
import {menuButton, useMenu} from '../menu/menuHelpers';
import {CameraTile} from './CameraTile';

const CamerasListComponent: NavigationFunctionComponent = ({componentId}) => {
  useMenu(componentId, 'camerasList');
  const [loading, setLoading] = useState(true);
  const [cameras, setCameras] = useState<string[]>([]);
  const apiUrl = useAppSelector(selectServerApiUrl);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fillGapsWithInitialData());
  }, [dispatch]);

  const refresh = useCallback(() => {
    setLoading(true);
    get<{cameras: Array<unknown>}>(`${apiUrl}/config`)
      .pipe(
        map(data => Object.keys(data.cameras)),
        catchError(() => []),
      )
      .subscribe(data => {
        setCameras(data);
        setLoading(false);
      });
  }, [apiUrl]);

  useEffect(() => {
    if (apiUrl === undefined) {
      navigateToMenuItem(settingsMenuItem)();
      ToastAndroid.showWithGravity(
        'You need to provide frigate nvr server data.',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    } else {
      refresh();
    }
  }, [refresh, apiUrl]);

  return (
    <FlatList
      data={cameras}
      renderItem={({item}) => (
        <CameraTile cameraName={item} componentId={componentId} />
      )}
      keyExtractor={cameraName => cameraName}
      refreshing={loading}
      onRefresh={refresh}
    />
  );
};

export const CamerasList = componentWithRedux(CamerasListComponent);

CamerasList.options = {
  topBar: {
    title: {
      text: 'List of cameras',
    },
    rightButtons: [menuButton],
  },
};
