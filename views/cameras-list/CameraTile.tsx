import React, {FC, useCallback, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {apiUrl} from '../../config';
import {Navigation} from 'react-native-navigation';

type CameraTileProps = PropsWithChildren<{
  componentId: string;
  cameraName: string;
}>;

const styles = StyleSheet.create({
  cameraTile: {
    paddingVertical: 2,
    paddingHorizontal: 1,
    width: '100%',
    height: 222,
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

  useEffect(() => {
    const getUrl = () =>
      `${apiUrl}/${cameraName}/latest.jpg?bbox=1&ts=${new Date().toISOString()}`;
    setLastImageSrc(getUrl());
    const interval = setInterval(async () => {
      const url = getUrl();
      await Image.prefetch(url);
      setLastImageSrc(url);
    }, 10000);
    return () => clearInterval(interval);
  }, [cameraName, setLastImageSrc]);

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
      <View style={styles.cameraTile}>
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
