import React, {useCallback, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {catchError, map} from 'rxjs/operators';
import {get} from '../../helpers/rest';
import {menuButton, useMenu} from '../menu/menuHelpers';
import {CameraTile} from './CameraTile';

export const CamerasList: NavigationFunctionComponent = ({componentId}) => {
  useMenu(componentId, 'camerasList');
  const [loading, setLoading] = useState(true);
  const [cameras, setCameras] = useState<string[]>([]);

  const refresh = useCallback(() => {
    setLoading(true);
    get<{cameras: Array<unknown>}>('/config')
      .pipe(
        map(data => Object.keys(data.cameras)),
        catchError(() => []),
      )
      .subscribe(data => {
        setCameras(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

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

CamerasList.options = {
  topBar: {
    title: {
      text: 'List of cameras',
    },
    rightButtons: [menuButton],
  },
};
