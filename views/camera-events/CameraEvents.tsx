import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {get} from '../../helpers/rest';
import {
  selectFiltersCameras,
  selectFiltersLabels,
  selectFiltersRetained,
  selectFiltersZones,
} from '../../store/events';
import {
  selectEventsNumColumns,
  selectEventsSnapshotHeight,
  selectServerApiUrl,
  selectServerCredentials,
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
import {useNoServer} from '../settings/useNoServer';
import {Background} from '../../components/Background';
import {useOrientation} from '../../helpers/screen';

const styles = StyleSheet.create({
  noEvents: {
    padding: 20,
    color: 'black',
    textAlign: 'center',
  },
});

export interface ICameraEventsProps {
  cameraNames?: string[];
  retained?: boolean;
}

export const CameraEvents: NavigationFunctionComponent<ICameraEventsProps> = ({
  cameraNames,
  retained,
  componentId,
}) => {
  const isSpecificCamera = useMemo(
    () => cameraNames && cameraNames.length === 1,
    [cameraNames],
  );
  useNoServer();
  useMenu(
    componentId,
    !retained
      ? isSpecificCamera
        ? 'camerasList'
        : 'cameraEvents'
      : 'retained',
  );
  useEventsFilters(componentId, cameraNames);
  const listRef = useRef<FlatList<ICameraEvent>>(null);
  const [refreshing, setRefreshing] = useState(true);
  const [events, setEvents] = useState<ICameraEvent[]>([]);
  const [endReached, setEndReached] = useState<boolean>(false);
  const [snapshotDimensions, setSnapshotDimensions] =
    useState<[number, number]>();
  const dispatch = useAppDispatch();
  const apiUrl = useAppSelector(selectServerApiUrl);
  const credentials = useAppSelector(selectServerCredentials);
  const numColumns = useAppSelector(selectEventsNumColumns);
  const snapshotHeight = useAppSelector(selectEventsSnapshotHeight);
  const filtersCameras = useAppSelector(selectFiltersCameras);
  const filtersLabels = useAppSelector(selectFiltersLabels);
  const filtersZones = useAppSelector(selectFiltersZones);
  const filtersRetained = useAppSelector(selectFiltersRetained);
  const intl = useIntl();
  const {orientation, setComponentId} = useOrientation();

  const filterCount = useMemo(
    () =>
      (filtersCameras.length || 0) +
      (filtersLabels.length || 0) +
      (filtersZones.length || 0) +
      (filtersRetained ? 1 : 0),
    [filtersCameras, filtersLabels, filtersZones],
  );

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: retained
        ? {
            title: {
              text: intl.formatMessage(messages['topBar.retained.title']),
            },
            leftButtons: [menuButton],
            rightButtons: [filterButton(filterCount)],
          }
        : isSpecificCamera
        ? {
            title: {
              text: intl.formatMessage(
                messages['topBar.specificCamera.title'],
                {cameraName: cameraNames![0]},
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
      favorites: retained || filtersRetained ? '1' : '0',
      limit: '100',
      include_thumbnails: '0',
    }),
    [
      cameraNames,
      events,
      filtersCameras,
      filtersLabels,
      filtersZones,
      filtersRetained,
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
        get<ICameraEvent[]>(`${apiUrl}/events`, credentials, eventsQueryParams)
          .then(data => {
            watchEndReached(data);
            setEvents(data);
            if (data.length > 0) {
              listRef.current?.scrollToIndex({index: 0});
            }
          })
          .catch(() => {})
          .finally(() => {
            setRefreshing(false);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshing]);

  const loadMore = useCallback(() => {
    if (!endReached) {
      get<ICameraEvent[]>(
        `${apiUrl}/events`,
        credentials,
        eventsQueryParams,
      ).then(data => {
        watchEndReached(data);
        setEvents([...events, ...data]);
      });
    }
  }, [apiUrl, endReached, events, eventsQueryParams, watchEndReached]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersCameras, filtersLabels, filtersZones, filtersRetained]);

  const onDelete = useCallback(
    (deletedIds: string[]) => {
      setEvents(events.filter(event => !deletedIds.includes(event.id)));
    },
    [events],
  );

  const onSnapshotDimensions = (width: number, height: number) => {
    if (!snapshotDimensions) {
      setSnapshotDimensions([width, height]);
    }
  };

  useEffect(() => {
    if (snapshotDimensions) {
      const [width, height] = snapshotDimensions;
      const proportion = height / width;
      const windowWidth = Dimensions.get('window').width;
      const newHeight = (windowWidth * proportion) / numColumns;
      if (newHeight !== snapshotHeight) {
        dispatch(setEventSnapshotHeight(newHeight));
      }
    }
  }, [snapshotDimensions, numColumns, orientation]);

  const showEventClip = (event: ICameraEvent) => {
    if (event.has_clip) {
      Navigation.showModal({
        component: {
          name: 'CameraEventClip',
          passProps: {
            eventId: event.id,
          },
          options: {
            layout: {
              orientation: ['landscape'],
            },
          },
        },
      }).then(componentId => {
        setComponentId(componentId);
      });
    } else {
      ToastAndroid.showWithGravity(
        intl.formatMessage(messages['toast.noClip']),
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
  };

  return (
    <Background>
      {!refreshing && events.length === 0 && (
        <Text style={styles.noEvents}>
          {intl.formatMessage(messages['noEvents'])}
        </Text>
      )}
      <FlatList
        ref={listRef}
        data={events}
        renderItem={({item}) => (
          <CameraEvent
            {...item}
            componentId={componentId}
            onDelete={onDelete}
            onSnapshotDimensions={onSnapshotDimensions}
            onEventPress={showEventClip}
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
    </Background>
  );
};
