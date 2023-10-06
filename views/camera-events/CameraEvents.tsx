import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {tap} from 'rxjs/operators';
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
  const listRef = useRef<FlatList<ICameraEvent>>(null);
  const [refreshing, setRefreshing] = useState(true);
  const [events, setEvents] = useState<ICameraEvent[]>([]);
  const [endReached, setEndReached] = useState<boolean>(false);
  const apiUrl = useAppSelector(selectServerApiUrl);
  const numColumns = useAppSelector(selectEventsNumColumns);
  const filtersCameras = useAppSelector(selectFiltersCameras);
  const filtersLabels = useAppSelector(selectFiltersLabels);
  const filtersZones = useAppSelector(selectFiltersZones);

  const eventsQueryParams = useMemo(
    () => ({
      ...(cameraNames
        ? {cameras: cameraNames.join(',')}
        : filtersCameras.length > 0
        ? {cameras: filtersCameras.join(',')}
        : {}),
      ...(filtersLabels.length > 0 ? {labels: filtersLabels.join(',')} : {}),
      ...(filtersZones.length > 0 ? {zones: filtersZones.join(',')} : {}),
      ...(!refreshing && events.length > 0
        ? {before: `${events[events.length - 1].start_time}`}
        : {}),
      limit: '100',
      include_thumbnails: '0',
    }),
    [
      cameraNames,
      events,
      filtersCameras,
      filtersLabels,
      filtersZones,
      refreshing,
    ],
  );

  const watchEndReached = useCallback((data: ICameraEvent[]) => {
    if (data.length === 0) {
      setEndReached(true);
    }
  }, []);

  const refresh = useCallback(() => {
    setEndReached(false);
    setRefreshing(true);
  }, []);

  useEffect(() => {
    if (refreshing) {
      get<ICameraEvent[]>(`${apiUrl}/events`, eventsQueryParams)
        .pipe(tap(watchEndReached))
        .subscribe(data => {
          setEvents(data);
          setRefreshing(false);
          listRef.current?.scrollToIndex({index: 0});
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshing]);

  const loadMore = useCallback(() => {
    if (!endReached) {
      get<ICameraEvent[]>(`${apiUrl}/events`, eventsQueryParams)
        .pipe(tap(watchEndReached))
        .subscribe(data => {
          setEvents([...events, ...data]);
        });
    }
  }, [apiUrl, endReached, events, eventsQueryParams, watchEndReached]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersCameras, filtersLabels, filtersZones]);

  return (
    <View>
      <FlatList
        ref={listRef}
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
