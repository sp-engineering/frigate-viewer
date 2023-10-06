import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
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

const styles = StyleSheet.create({
  cameraTileTitle: {
    position: 'absolute',
    left: 2,
    top: 1,
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 14,
    fontSize: 16,
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
  const dispatch = useAppDispatch();
  const apiUrl = useAppSelector(selectServerApiUrl);
  const refreshFrequency = useAppSelector(selectCamerasRefreshFrequency);
  const previewHeight = useAppSelector(selectCamerasPreviewHeight);
  const numColumns = useAppSelector(selectCamerasNumColumns);
  let interval = useRef<NodeJS.Timer>();

  useEffect(() => {
    const getLastImageUrl = () =>
      `${apiUrl}/${cameraName}/latest.jpg?bbox=1&ts=${new Date().toISOString()}`;
    setLastImageSrc(getLastImageUrl());
    const removeRefreshing = () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
    removeRefreshing();
    interval.current = setInterval(async () => {
      const lastImageUrl = getLastImageUrl();
      await Image.prefetch(lastImageUrl);
      setLastImageSrc(lastImageUrl);
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

  return (
    <View>
      <Carousel initialPage={2}>
        <View>
          <Text>Last event</Text>
        </View>
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
