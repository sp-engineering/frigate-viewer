import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {catchError} from 'rxjs/operators';
import {componentWithRedux} from '../../helpers/redux';
import {get} from '../../helpers/rest';
import {selectApiUrl} from '../../store/settings';
import {useAppSelector} from '../../store/store';
import {CameraEvent, ICameraEvent} from './CameraEvent';

interface ICameraEventsProps {
  cameraName: string;
}

const CameraEventsComponent: NavigationFunctionComponent<
  ICameraEventsProps
> = ({cameraName, componentId}) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<ICameraEvent[]>([]);
  const apiUrl = useAppSelector(selectApiUrl);

  const refresh = useCallback(() => {
    setLoading(true);
    get<ICameraEvent[]>(`${apiUrl}/events`, {
      cameras: cameraName,
      limit: '300',
      include_thumbnails: '0',
    })
      .pipe(catchError(() => []))
      .subscribe(data => {
        setEvents(data);
        setLoading(false);
      });
  }, [cameraName, apiUrl]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <View>
      <FlatList
        data={events}
        renderItem={({item}) => (
          <CameraEvent {...item} componentId={componentId} />
        )}
        keyExtractor={data => data.id}
        refreshing={loading}
        onRefresh={refresh}
      />
    </View>
  );
};

export const CameraEvents = componentWithRedux(CameraEventsComponent);

CameraEvents.options = ({cameraName}) => ({
  topBar: {
    title: {
      text: `Events of ${cameraName}`,
    },
  },
});
