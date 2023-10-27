import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Carousel} from 'react-native-ui-lib';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {
  selectCamerasNumColumns,
  selectCamerasPreviewHeight,
  selectCamerasRefreshFrequency,
  selectServerApiUrl,
  setCameraPreviewHeight,
} from '../../store/settings';
import {CameraLabels} from './CameraLabels';
import {setFiltersLabels, setFiltersZones} from '../../store/events';
import {ImagePreview} from './ImagePreview';
import { get } from '../../helpers/rest';
import { ICameraEvent } from '../camera-events/CameraEvent';
import { LastEvent } from './LastEvent';

const stylesFn = (numColumns: number) => StyleSheet.create({
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
  const refreshFrequency = useAppSelector(selectCamerasRefreshFrequency);
  const previewHeight = useAppSelector(selectCamerasPreviewHeight);
  const numColumns = useAppSelector(selectCamerasNumColumns);
  const interval = useRef<NodeJS.Timer>();

  const getLastImageUrl = useCallback(
    () => `${apiUrl}/${cameraName}/latest.jpg?bbox=1&ts=${new Date().toISOString()}`,
    [apiUrl],
  );

  const updateLastImageUrl = useCallback(async () => {
    const lastImageUrl = getLastImageUrl();
    await Image.prefetch(lastImageUrl);
    setLastImageSrc(lastImageUrl);
  }, [getLastImageUrl]);

  const getLastEvent = useCallback(() => {
    get<ICameraEvent[]>(`${apiUrl}/events`, {
      cameras: cameraName,
      limit: '1',
      include_thumbnails: '0',
    }).then(data => {
      if (data.length > 0) {
        const event = data[0];
        setLastEvent(event);
      }
    });
  }, [cameraName]);

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

  const showCameraEvents = useCallback(() => {
    Navigation.push(componentId, {
      component: {
        name: 'CameraEvents',
        passProps: {
          cameraNames: [cameraName],
        },
      },
    });
  }, [cameraName, componentId]);

  const showCameraEventsWithLabel = useCallback(
    (label: string) => {
      dispatch(setFiltersLabels([label]));
      dispatch(setFiltersZones([]));
      showCameraEvents();
    },
    [dispatch, showCameraEvents],
  );

  const onPreviewLoad = useCallback(async () => {
    if (lastImageSrc) {
      try {
        Image.getSize(lastImageSrc, (width, height) => {
          const proportion = height / width;
          const windowWidth = Dimensions.get('window').width;
          const newHeight = (windowWidth * proportion) / numColumns;
          if (newHeight !== previewHeight) {
            dispatch(setCameraPreviewHeight(newHeight));
          }
        });
      } catch (err) {}
    }
  }, [dispatch, lastImageSrc, numColumns, previewHeight]);

  const styles = useMemo(() => stylesFn(numColumns), [numColumns]);

  return (
    <View style={{
      width: `${100 / numColumns}%`,
    }}>
      <Carousel initialPage={1}>
        <LastEvent
          event={lastEvent}
          onPress={showCameraEvents}
        />
        <ImagePreview
          imageUrl={lastImageSrc}
          onPress={showCameraEvents}
          onPreviewLoad={onPreviewLoad}
        />
        <CameraLabels onLabelPress={showCameraEventsWithLabel} />
      </Carousel>
      <Text style={[styles.cameraTileTitle]}>{cameraName}</Text>
    </View>
  );
};
