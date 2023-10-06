import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {apiUrl} from '../../config';

type CameraTileProps = PropsWithChildren<{
  cameraName: string;
}>;

const styles = StyleSheet.create({
  cameraTile: {
    paddingVertical: '1%',
    paddingHorizontal: '2%',
    width: '100%',
    height: 220,
  },
  cameraTileTitle: {
    position: 'absolute',
    left: '2%',
    top: '1%',
    width: '100%',
    padding: 5,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#00000070',
  },
  cameraTileImage: {
    flex: 1,
  },
});

export const CameraTile = ({cameraName}: CameraTileProps): JSX.Element => {
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

  return (
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
  );
};
