import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Video from 'react-native-video';
import {apiUrl} from '../../config';

interface ICameraEventClipProps {
  eventId: string;
}

const styles = StyleSheet.create({
  player: {
    width: '100%',
    height: '100%',
  },
});

export const CameraEventClip: NavigationFunctionComponent<
  ICameraEventClipProps
> = ({eventId}) => {
  const clipUrl = useMemo(
    () => `${apiUrl}/events/${eventId}/clip.mp4`,
    [eventId],
  );

  return (
    <Video
      source={{uri: clipUrl}}
      controls={true}
      style={[styles.player]}
      resizeMode="contain"
    />
  );
};

CameraEventClip.options = () => ({
  topBar: {
    title: {
      text: 'Clip preview',
    },
  },
});
