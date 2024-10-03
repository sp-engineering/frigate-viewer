import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import VLCPlayer, {State} from '@lunarr/vlc-player';
import RNFetchBlob from 'rn-fetch-blob';
import {ZoomableView} from '../../components/ZoomableView';
import {
  selectServerApiUrl,
  selectServerCredentials,
} from '../../store/settings';
import {useAppSelector} from '../../store/store';
import {ProgressBar} from './ProgressBar';
import {VideoHUD} from './VideoHUD';
import {authorizationHeader} from '../../helpers/rest';

interface ICameraEventClipProps {
  eventId: string;
}

const styles = StyleSheet.create({
  player: {
    width: '100%',
    height: '100%',
  },
  overlayWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  progressText: {
    color: 'white',
  },
});

interface IVideoPlayerProps {
  clipUrl: string;
}

const VideoPlayer: FC<IVideoPlayerProps> = ({clipUrl}) => {
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [progressInfo, setProgressInfo] = useState<State>();
  const player = useRef<VLCPlayer>(null);
  const credentials = useAppSelector(selectServerCredentials);
  const [uri, setUri] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>();

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

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const dirs = RNFetchBlob.fs.dirs;
        const filePath = `${dirs.CacheDir}/eventclip.mp4`;
        const downloader = RNFetchBlob.config({
          fileCache: true,
          path: filePath,
        });
        await downloader
          .fetch('GET', clipUrl, authorizationHeader(credentials))
          .progress((received, total) => {
            const progress = Math.round((received / total) * 100);
            setProgress(progress);
          });
        setUri(filePath);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(JSON.stringify(err));
      }
    })();
  }, [clipUrl, credentials]);

  if (error) {
    return (
      <View style={styles.overlayWrapper}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.overlayWrapper}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
    );
  }

  return (
    <View>
      {uri && (
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
              source={{uri}}
              style={[styles.player]}
              onProgress={onProgress}
              onStopped={onStopped}
            />
          </VideoHUD>
        </ZoomableView>
      )}
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
