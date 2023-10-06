import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {catchError} from 'rxjs/operators';
import {get} from '../../helpers/rest';
import {CameraEvent, ICameraEvent} from './CameraEvent';

interface ICameraEventsProps {
  cameraName: string;
}

export const CameraEvents: NavigationFunctionComponent<ICameraEventsProps> = ({
  cameraName,
}) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<ICameraEvent[]>([]);

  const refresh = useCallback(() => {
    setLoading(true);
    get<ICameraEvent[]>('/events', {
      cameras: cameraName,
      limit: '300',
      include_thumbnails: '0',
    })
      .pipe(catchError(() => []))
      .subscribe(data => {
        setEvents(data);
        setLoading(false);
      });
  }, [cameraName]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <View>
      <FlatList
        data={events}
        renderItem={({item}) => <CameraEvent {...item} />}
        keyExtractor={data => data.id}
        refreshing={loading}
        onRefresh={refresh}
      />
    </View>
  );
};

CameraEvents.options = ({cameraName}) => ({
  topBar: {
    title: {
      text: `Events of ${cameraName}`,
    },
  },
});
