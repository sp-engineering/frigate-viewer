import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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
import {ZoomableImage} from '../../components/ZoomableImage';
import {CameraLabels} from './CameraLabels';
import {setFiltersLabels, setFiltersZones} from '../../store/events';

type CameraTileProps = PropsWithChildren<{
  componentId: string;
  cameraName: string;
}>;

const styles = StyleSheet.create({
  cameraTile: {
    paddingVertical: 2,
    paddingHorizontal: 1,
  },
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
  cameraTileImage: {
    flex: 1,
  },
});

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
    const getUrl = () =>
      `${apiUrl}/${cameraName}/latest.jpg?bbox=1&ts=${new Date().toISOString()}`;
    setLastImageSrc(getUrl());
    const removeRefreshing = () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
    removeRefreshing();
    interval.current = setInterval(async () => {
      const url = getUrl();
      await Image.prefetch(url);
      setLastImageSrc(url);
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
      <Carousel>
        <TouchableWithoutFeedback onPress={showCameraEvents}>
          <View
            style={[
              styles.cameraTile,
              {width: `${100 / numColumns}%`, height: previewHeight},
            ]}>
            {lastImageSrc && (
              <ZoomableImage
                source={{uri: lastImageSrc}}
                style={styles.cameraTileImage}
                fadeDuration={0}
                resizeMode="contain"
                resizeMethod="scale"
                onLoad={onPreviewLoad}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
        <CameraLabels onLabelPress={showCameraEventsWithLabel} />
      </Carousel>
      <Text style={[styles.cameraTileTitle]}>{cameraName}</Text>
    </View>
  );
};
