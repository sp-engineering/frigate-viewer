import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {ProgressInfo, VLCPlayer} from 'react-native-vlc-media-player';
import {ZoomableView} from '../../components/ZoomableView';
import {selectServerApiUrl} from '../../store/settings';
import {useAppSelector} from '../../store/store';
import {ProgressBar} from './ProgressBar';
import {VideoHUD} from './VideoHUD';

interface ICameraEventClipProps {
  eventId: string;
}

const styles = StyleSheet.create({
  player: {
    width: '100%',
    height: '100%',
  },
});

interface IVideoPlayerProps {
  clipUrl: string;
}

const VideoPlayer: FC<IVideoPlayerProps> = ({clipUrl}) => {
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [progressInfo, setProgressInfo] = useState<ProgressInfo>();
  const player = useRef<VLCPlayer>(null);

  const resumeIfStopped = useCallback(() => {
    if (player.current && stopped) {
      player.current.resume(true);
      setStopped(false);
    }
  }, [stopped]);

  const onPaused = useCallback(
    (pause: boolean) => {
      resumeIfStopped();
      setPaused(pause);
    },
    [resumeIfStopped],
  );

  const onProgress = useCallback((info: ProgressInfo) => {
    setProgressInfo(info);
  }, []);

  const onStopped = useCallback(() => {
    setStopped(true);
  }, []);

  const seek = useCallback(
    (pos: number) => {
      if (player.current) {
        resumeIfStopped();
        player.current.seek(pos * 10);
      }
    },
    [resumeIfStopped],
  );

  return (
    <View>
      <ZoomableView>
        <VideoHUD
          paused={paused}
          duration={progressInfo?.duration}
          position={progressInfo?.position}
          onPaused={onPaused}
          onSeek={seek}>
          <VLCPlayer
            ref={player}
            paused={paused}
            source={{uri: clipUrl}}
            style={[styles.player]}
            resizeMode="contain"
            onProgress={onProgress}
            onStopped={onStopped}
          />
        </VideoHUD>
      </ZoomableView>
      {progressInfo && (
        <ProgressBar
          paused={paused}
          currentTime={progressInfo.currentTime}
          duration={progressInfo.duration}
          position={progressInfo.position}
        />
      )}
    </View>
  );
};

export const CameraEventClip: NavigationFunctionComponent<
  ICameraEventClipProps
> = ({eventId}) => {
  const apiUrl = useAppSelector(selectServerApiUrl);
  const clipUrl = useMemo(
    () => `${apiUrl}/events/${eventId}/clip.mp4`,
    [eventId, apiUrl],
  );

  return <VideoPlayer clipUrl={clipUrl} />;
};
