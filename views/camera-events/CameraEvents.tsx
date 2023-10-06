import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {catchError, map} from 'rxjs/operators';
import {get} from '../../helpers/rest';
import {CameraEvent} from './CameraEvent';

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
    <View>
      <FlatList
        data={cameras}
        renderItem={({item}) => <CameraEvent cameraName={item} />}
        keyExtractor={cameraName => cameraName}
        refreshing={loading}
        onRefresh={refresh}
      />
    </View>
  );
};

export default CamerasList;
