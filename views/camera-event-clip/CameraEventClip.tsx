import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import VLCPlayer, {State} from '@lunarr/vlc-player';
import {ZoomableView} from '../../components/ZoomableView';
import {
  selectServerApiUrl,
  selectServerCredentials,
} from '../../store/settings';
import {useAppSelector} from '../../store/store';
import {ProgressBar} from './ProgressBar';
import {VideoHUD} from './VideoHUD';
import {authorizationHeader} from '../../helpers/rest';
import {useStyles} from '../../helpers/colors';

interface ICameraEventClipProps {
  eventId: string;
}

interface IVideoPlayerProps {
  clipUrl: string;
}

const VideoPlayer: FC<IVideoPlayerProps> = ({clipUrl}) => {
  const styles = useStyles(({colorScheme}) => ({
    wrapper: {
      backgroundColor: colorScheme.background,
    },
    player: {
      width: '100%',
      height: '100%',
    },
  }));

  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [progressInfo, setProgressInfo] = useState<State>();
  const player = useRef<VLCPlayer>(null);
  const credentials = useAppSelector(selectServerCredentials);

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

  const onProgress = useCallback((info: State) => {
    setProgressInfo(info);
  }, []);

  const onStopped = useCallback(() => {
    setStopped(true);
  }, []);

  const seek = useCallback(
    (pos: number) => {
      if (player.current) {
        resumeIfStopped();
        player.current.seek(pos);
      }
    },
    [resumeIfStopped],
  );

  return (
    <View style={styles.wrapper}>
      <ZoomableView>
        <VideoHUD
          paused={paused}
          currentTime={progressInfo?.currentTime}
          duration={progressInfo?.duration}
          onPaused={onPaused}
          onSeek={seek}>
          <VLCPlayer
            ref={player}
            paused={paused}
            source={{uri: clipUrl, headers: authorizationHeader(credentials)}}
            style={[styles.player]}
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
          onPausePress={onPaused}
          onSeek={seek}
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
