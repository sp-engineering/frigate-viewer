import React, {FC, useEffect, useRef, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {Image, ImageStyle, View} from 'react-native';
import {useAppSelector} from '../../store/store';
import {
  selectCamerasRefreshFrequency,
  selectServer,
} from '../../store/settings';
import {authorizationHeader, buildServerApiUrl} from '../../helpers/rest';
import {ZoomableImage} from '../../components/ZoomableImage';
import {useStyles} from '../../helpers/colors';

type LivePreviewProps = PropsWithChildren<{
  cameraName: string;
}>;

export const LivePreview: FC<LivePreviewProps> = ({cameraName}) => {
  const styles = useStyles(() => ({
    image: {
      width: '100%',
      height: '100%',
    },
  }));

  const [lastImageSrc, setLastImageSrc] = useState<string | undefined>(
    undefined,
  );
  const server = useAppSelector(selectServer);
  const refreshFrequency = useAppSelector(selectCamerasRefreshFrequency);
  const interval = useRef<NodeJS.Timeout>();

  const getLastImageUrl = () =>
    `${buildServerApiUrl(
      server,
    )}/${cameraName}/latest.jpg?bbox=1&ts=${new Date().toISOString()}`;

  const updateLastImageUrl = async () => {
    const lastImageUrl = getLastImageUrl();
    Image.getSizeWithHeaders(lastImageUrl, authorizationHeader(server), () => {
      setLastImageSrc(lastImageUrl);
    });
  };

  useEffect(() => {
    updateLastImageUrl();
    const removeRefreshing = () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
    removeRefreshing();
    interval.current = setInterval(async () => {
      updateLastImageUrl();
    }, refreshFrequency * 1000);
    return removeRefreshing;
  }, [cameraName, setLastImageSrc, server, refreshFrequency]);

  return (
    <View>
      {lastImageSrc && (
        <ZoomableImage
          source={{
            uri: lastImageSrc,
            headers: authorizationHeader(server),
          }}
          style={styles.image as ImageStyle}
          fadeDuration={0}
          resizeMode="contain"
          resizeMethod="scale"
          onLoad={updateLastImageUrl}
        />
      )}
    </View>
  );
};
