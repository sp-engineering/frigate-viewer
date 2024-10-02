import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {PropsWithChildren} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Carousel} from 'react-native-ui-lib';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {
  selectCamerasLiveView,
  selectCamerasNumColumns,
  selectCamerasPreviewHeight,
  selectCamerasRefreshFrequency,
  selectServerApiUrl,
  selectServerCredentials,
  setCameraPreviewHeight,
} from '../../store/settings';
import {CameraLabels} from './CameraLabels';
import {setFiltersLabels, setFiltersZones} from '../../store/events';
import {ImagePreview} from './ImagePreview';
import {authorizationHeader, get} from '../../helpers/rest';
import {ICameraEvent} from '../camera-events/CameraEvent';
import {LastEvent} from './LastEvent';

const stylesFn = (numColumns: number) =>
  StyleSheet.create({
    cameraTileTitle: {
      position: 'absolute',
      left: 2,
      top: 1,
      width: '100%',
      paddingVertical: 5 / numColumns,
      paddingHorizontal: 14 / numColumns,
      fontSize: 16 / numColumns,
      fontWeight: '300',
      color: 'white',
      backgroundColor: '#00000040',
    },
  });

type CameraTileProps = PropsWithChildren<{
  componentId: string;
  cameraName: string;
}>;

export const CameraTile: FC<CameraTileProps> = ({cameraName, componentId}) => {
  const [lastImageSrc, setLastImageSrc] = useState<string | undefined>(
    undefined,
  );
  const [lastEvent, setLastEvent] = useState<ICameraEvent>();
  const dispatch = useAppDispatch();
  const apiUrl = useAppSelector(selectServerApiUrl);
  const credentials = useAppSelector(selectServerCredentials);
  const refreshFrequency = useAppSelector(selectCamerasRefreshFrequency);
  const previewHeight = useAppSelector(selectCamerasPreviewHeight);
  const [cameraHeight, setCameraHeight] = useState<number>();
  const liveView = useAppSelector(selectCamerasLiveView);
  const numColumns = useAppSelector(selectCamerasNumColumns);
  const interval = useRef<NodeJS.Timeout>();

  const getLastImageUrl = () =>
    `${apiUrl}/${cameraName}/latest.jpg?bbox=1&ts=${new Date().toISOString()}`;

  const updateLastImageUrl = async () => {
    const lastImageUrl = getLastImageUrl();
    Image.getSizeWithHeaders(
      lastImageUrl,
      authorizationHeader(credentials),
      () => {
        setLastImageSrc(lastImageUrl);
      },
    );
  };

  const getLastEvent = () => {
    get<ICameraEvent[]>(`${apiUrl}/events`, credentials, {
      cameras: cameraName,
      limit: '1',
      include_thumbnails: '0',
    }).then(data => {
      if (data.length > 0) {
        const event = data[0];
        setLastEvent(event);
      }
    });
  };

  useEffect(() => {
    updateLastImageUrl();
    getLastEvent();
    const removeRefreshing = () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
    removeRefreshing();
    interval.current = setInterval(async () => {
      updateLastImageUrl();
      getLastEvent();
    }, refreshFrequency * 1000);
    return removeRefreshing;
  }, [cameraName, setLastImageSrc, apiUrl, refreshFrequency]);

  const showCameraEvents = () => {
    Navigation.push(componentId, {
      component: {
        name: 'CameraEvents',
        passProps: {
          cameraNames: [cameraName],
        },
      },
    });
  };

  const showCameraEventsWithLabel = (label: string) => {
    dispatch(setFiltersLabels([label]));
    dispatch(setFiltersZones([]));
    showCameraEvents();
  };

  const onPreviewLoad = async () => {
    if (liveView) {
      updateLastImageUrl();
    }
    if (lastImageSrc) {
      try {
        Image.getSize(lastImageSrc, (width, height) => {
          const proportion = height / width;
          const windowWidth = Dimensions.get('window').width;
          const newHeight = (windowWidth * proportion) / numColumns;
          setCameraHeight(newHeight);
          if (newHeight !== previewHeight) {
            dispatch(setCameraPreviewHeight(newHeight));
          }
        });
      } catch (err) {}
    }
  };

  const styles = useMemo(() => stylesFn(numColumns), [numColumns]);

  return (
    <View
      style={{
        width: `${100 / numColumns}%`,
      }}>
      <Carousel initialPage={1}>
        <LastEvent
          height={cameraHeight}
          event={lastEvent}
          onPress={showCameraEvents}
        />
        <ImagePreview
          height={cameraHeight}
          imageUrl={lastImageSrc}
          onPress={showCameraEvents}
          onPreviewLoad={onPreviewLoad}
        />
        <CameraLabels
          height={cameraHeight}
          onLabelPress={showCameraEventsWithLabel}
        />
      </Carousel>
      <Text style={[styles.cameraTileTitle]}>{cameraName}</Text>
    </View>
  );
};
