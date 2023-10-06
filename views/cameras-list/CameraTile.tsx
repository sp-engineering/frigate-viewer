import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {useAppSelector} from '../../store/store';
import {
  selectCamerasPreviewHeight,
  selectCamerasRefreshFrequency,
  selectServerApiUrl,
} from '../../store/settings';

type CameraTileProps = PropsWithChildren<{
  componentId: string;
  cameraName: string;
}>;

const styles = StyleSheet.create({
  cameraTile: {
    paddingVertical: 2,
    paddingHorizontal: 1,
    width: '100%',
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
  const apiUrl = useAppSelector(selectServerApiUrl);
  const refreshFrequency = useAppSelector(selectCamerasRefreshFrequency);
  const previewHeight = useAppSelector(selectCamerasPreviewHeight);
  let interval = useRef<number>();

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
          cameraName,
        },
      },
    });
  }, [cameraName, componentId]);

  return (
    <TouchableWithoutFeedback onPress={showCameraEvents}>
      <View style={[styles.cameraTile, {height: previewHeight}]}>
        {lastImageSrc && (
          <Image
            source={{uri: lastImageSrc}}
            style={styles.cameraTileImage}
            fadeDuration={0}
            resizeMode="contain"
            resizeMethod="scale"
          />
        )}
        <Text style={[styles.cameraTileTitle]}>{cameraName}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
