import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {FlatList, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {tap} from 'rxjs/operators';
import {get} from '../../helpers/rest';
import {
  selectFiltersCameras,
  selectFiltersLabels,
  selectFiltersZones,
} from '../../store/events';
import {
  selectEventsNumColumns,
  selectServerApiUrl,
  setEventSnapshotHeight,
} from '../../store/settings';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {
  filterButton,
  useEventsFilters,
} from '../events-filters/eventsFiltersHelpers';
import {menuButton, useMenu} from '../menu/menuHelpers';
import {CameraEvent, ICameraEvent} from './CameraEvent';
import {messages} from './messages';
import { useNoServer } from '../settings/useNoServer';

interface ICameraEventsProps {
  cameraNames?: string[];
}

export const CameraEvents: NavigationFunctionComponent<ICameraEventsProps> = ({
  cameraNames,
  componentId,
}) => {
  useNoServer();
  useMenu(componentId, 'cameraEvents');
  useEventsFilters(componentId, cameraNames);
  const listRef = useRef<FlatList<ICameraEvent>>(null);
  const [refreshing, setRefreshing] = useState(true);
  const [events, setEvents] = useState<ICameraEvent[]>([]);
  const [endReached, setEndReached] = useState<boolean>(false);
  const [snapshotHeight, setSnapshotHeight] = useState<number>();
  const dispatch = useAppDispatch();
  const apiUrl = useAppSelector(selectServerApiUrl);
  const numColumns = useAppSelector(selectEventsNumColumns);
  const filtersCameras = useAppSelector(selectFiltersCameras);
  const filtersLabels = useAppSelector(selectFiltersLabels);
  const filtersZones = useAppSelector(selectFiltersZones);
  const intl = useIntl();

  const filterCount = useMemo(
    () =>
      (filtersCameras.length || 0) +
      (filtersLabels.length || 0) +
      (filtersZones.length || 0),
    [filtersCameras, filtersLabels, filtersZones],
  );

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar:
        cameraNames && cameraNames.length === 1
          ? {
              title: {
                text: intl.formatMessage(
                  messages['topBar.specificCamera.title'],
                  {cameraName: cameraNames[0]},
                ),
              },
              rightButtons: [filterButton(filterCount)],
            }
          : {
              title: {
                text: intl.formatMessage(messages['topBar.general.title']),
              },
              leftButtons: [menuButton],
              rightButtons: [filterButton(filterCount)],
            },
    });
  }, [componentId, intl, cameraNames, filterCount]);

  useEffect(() => {
    Navigation.updateProps('FilterButton', {
      count: filterCount,
    });
  }, [filterCount]);

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
    if (apiUrl !== undefined) {
      if (refreshing) {
        get<ICameraEvent[]>(`${apiUrl}/events`, eventsQueryParams)
          .pipe(tap(watchEndReached))
          .subscribe(data => {
            setEvents(data);
            setRefreshing(false);
            if (data.length > 0) {
              listRef.current?.scrollToIndex({index: 0});
            }
          });
      }
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

  const onDelete = useCallback(
    (deletedIds: string[]) => {
      setEvents(events.filter(event => !deletedIds.includes(event.id)));
    },
    [events],
  );

  const onSnapshotHeight = useCallback(
    (height: number) => {
      if (!snapshotHeight) {
        setSnapshotHeight(height);
        dispatch(setEventSnapshotHeight(height));
      }
    },
    [dispatch, snapshotHeight],
  );

  return (
    <View>
      <FlatList
        ref={listRef}
        data={events}
        renderItem={({item}) => (
          <CameraEvent
            {...item}
            componentId={componentId}
            onDelete={onDelete}
            onSnapshotHeight={onSnapshotHeight}
          />
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
