import {IconOutline} from '@ant-design/icons-react-native';
import React, {FC, useCallback, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {ProgressInfo, VLCPlayer} from 'react-native-vlc-media-player';
import {apiUrl} from '../../config';

interface ICameraEventClipProps {
  eventId: string;
}

const styles = StyleSheet.create({
  player: {
    width: '100%',
    height: '100%',
  },
  playerBar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    padding: 1,
    backgroundColor: 'black',
    opacity: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerBarText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  playerProgressBar: {
    height: 3,
    flex: 1,
    marginVertical: 1,
    marginHorizontal: 8,
    borderColor: 'white',
    borderBottomWidth: 1,
  },
  playerProgressBarTrack: {
    backgroundColor: 'white',
    height: '100%',
  },
});

interface IVideoPlayerProps {
  clipUrl: string;
}

const formatVideoTime = (t: number) => {
  const time = Math.round(t / 1000);
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const VideoPlayer: FC<IVideoPlayerProps> = ({clipUrl}) => {
  const [paused, setPaused] = useState<boolean>(false);
  const [progressInfo, setProgressInfo] = useState<ProgressInfo>();

  const togglePlay = useCallback(() => {
    setPaused(!paused);
  }, [paused]);

  const onProgress = useCallback((info: ProgressInfo) => {
    setProgressInfo(info);
  }, []);

  const currentTimeStr = useMemo(
    () => formatVideoTime(progressInfo?.currentTime || 0),
    [progressInfo?.currentTime],
  );

  const durationStr = useMemo(
    () => formatVideoTime(progressInfo?.duration || 0),
    [progressInfo?.duration],
  );

  const percentage = useMemo(
    () => `${(progressInfo?.position || 0) * 100}%`,
    [progressInfo?.position],
  );

  return (
    <View>
      <TouchableNativeFeedback onPress={togglePlay}>
        <VLCPlayer
          paused={paused}
          source={{uri: clipUrl}}
          style={[styles.player]}
          resizeMode="contain"
          onProgress={onProgress}
        />
      </TouchableNativeFeedback>
      <View style={[styles.playerBar]}>
        {paused ? (
          <IconOutline name="pause" color="white" />
        ) : (
          <IconOutline name="caret-right" color="white" />
        )}
        <Text style={[styles.playerBarText]}>{currentTimeStr}</Text>
        <View style={[styles.playerProgressBar]}>
          <View style={[styles.playerProgressBarTrack, {width: percentage}]} />
        </View>
        <Text style={[styles.playerBarText]}>{durationStr}</Text>
      </View>
    </View>
  );
};

export const CameraEventClip: NavigationFunctionComponent<
  ICameraEventClipProps
> = ({eventId}) => {
  const clipUrl = useMemo(
    () => `${apiUrl}/events/${eventId}/clip.mp4`,
    [eventId],
  );

  return <VideoPlayer clipUrl={clipUrl} />;
};

CameraEventClip.options = () => ({
  topBar: {
    title: {
      text: 'Clip preview',
    },
  },
});
