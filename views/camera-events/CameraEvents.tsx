import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {catchError} from 'rxjs/operators';
import {componentWithRedux} from '../../helpers/redux';
import {get} from '../../helpers/rest';
import {selectServerApiUrl} from '../../store/settings';
import {useAppSelector} from '../../store/store';
import {menuButton, useMenu} from '../menu/menuHelpers';
import {CameraEvent, ICameraEvent} from './CameraEvent';

interface ICameraEventsProps {
  cameraNames?: string[];
}

const CameraEventsComponent: NavigationFunctionComponent<
  ICameraEventsProps
> = ({cameraNames, componentId}) => {
  useMenu(componentId, 'cameraEvents');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<ICameraEvent[]>([]);
  const apiUrl = useAppSelector(selectServerApiUrl);

  const refresh = useCallback(() => {
    setLoading(true);
    get<ICameraEvent[]>(`${apiUrl}/events`, {
      ...(cameraNames ? {cameras: cameraNames.join(',')} : {}),
      limit: '300',
      include_thumbnails: '0',
    })
      .pipe(catchError(() => []))
      .subscribe(data => {
        setEvents(data);
        setLoading(false);
      });
  }, [cameraNames, apiUrl]);

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

CameraEvents.options = ({cameraNames}) => ({
  topBar:
    cameraNames && cameraNames.length === 1
      ? {
          title: {
            text: `Events of ${cameraNames[0]}`,
          },
        }
      : {
          title: {
            text: 'Events',
          },
          rightButtons: [menuButton],
        },
});
