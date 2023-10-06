import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {catchError, tap} from 'rxjs/operators';
import {componentWithRedux} from '../../helpers/redux';
import {get} from '../../helpers/rest';
import {
  selectFiltersCameras,
  selectFiltersLabels,
  selectFiltersZones,
} from '../../store/events';
import {selectEventsNumColumns, selectServerApiUrl} from '../../store/settings';
import {useAppSelector} from '../../store/store';
import {
  filterButton,
  useEventsFilters,
} from '../events-filters/eventsFiltersHelpers';
import {menuButton, useMenu} from '../menu/menuHelpers';
import {CameraEvent, ICameraEvent} from './CameraEvent';

interface ICameraEventsProps {
  cameraNames?: string[];
}

const CameraEventsComponent: NavigationFunctionComponent<
  ICameraEventsProps
> = ({cameraNames, componentId}) => {
  useMenu(componentId, 'cameraEvents');
  useEventsFilters(componentId, cameraNames);
  const [refreshing, setRefreshing] = useState(true);
  const [events, setEvents] = useState<ICameraEvent[]>([]);
  const [endReached, setEndReached] = useState<boolean>(false);
  const apiUrl = useAppSelector(selectServerApiUrl);
  const numColumns = useAppSelector(selectEventsNumColumns);
  const filtersCameras = useAppSelector(selectFiltersCameras);
  const filtersLabels = useAppSelector(selectFiltersLabels);
  const filtersZones = useAppSelector(selectFiltersZones);

  const loadMore$ = useMemo(() => {
    return get<ICameraEvent[]>(`${apiUrl}/events`, {
      ...(cameraNames
        ? {cameras: cameraNames.join(',')}
        : filtersCameras.length > 0
        ? {cameras: filtersCameras.join(',')}
        : {}),
      ...(filtersLabels.length > 0 ? {labels: filtersLabels.join(',')} : {}),
      ...(filtersZones.length > 0 ? {zones: filtersZones.join(',')} : {}),
      ...(events.length > 0
        ? {before: `${events[events.length - 1].start_time}`}
        : {}),
      limit: '100',
      include_thumbnails: '0',
    }).pipe(
      tap(data => {
        if (data.length === 0) {
          setEndReached(true);
        }
      }),
      catchError(() => []),
    );
  }, [
    apiUrl,
    cameraNames,
    events,
    filtersCameras,
    filtersLabels,
    filtersZones,
  ]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setEndReached(false);
    loadMore$.subscribe(data => {
      setEvents(data);
      setRefreshing(false);
    });
  }, [loadMore$]);

  const loadMore = useCallback(() => {
    loadMore$.subscribe(data => {
      if (!endReached) {
        setEvents([...events, ...data]);
      }
    });
  }, [endReached, events, loadMore$]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersCameras, filtersLabels, filtersZones]);

  return (
    <View>
      <FlatList
        data={events}
        renderItem={({item}) => (
          <CameraEvent {...item} componentId={componentId} />
        )}
        keyExtractor={data => data.id}
        initialNumToRender={30}
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        numColumns={numColumns}
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
          rightButtons: [filterButton],
        }
      : {
          title: {
            text: 'Events',
          },
          rightButtons: [filterButton, menuButton],
        },
});
