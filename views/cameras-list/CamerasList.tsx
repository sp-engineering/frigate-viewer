import React, {useCallback, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {catchError, map} from 'rxjs/operators';
import {Screen} from '../../components/Screen';
import {get} from '../../helpers/rest';
import {CameraTile} from './CameraTile';

export const CamerasList = (): JSX.Element => {
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
    <Screen>
      <FlatList
        data={cameras}
        renderItem={({item}) => <CameraTile cameraName={item} />}
        keyExtractor={cameraName => cameraName}
        refreshing={loading}
        onRefresh={refresh}
      />
    </Screen>
  );
};

export default CamerasList;
