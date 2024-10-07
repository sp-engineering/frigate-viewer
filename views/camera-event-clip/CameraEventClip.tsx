import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
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
import Share from 'react-native-share';
import {clipFilename} from '../camera-events/eventHelpers';
import {ICameraEvent} from '../camera-events/CameraEvent';
import {IconOutline} from '@ant-design/icons-react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {useTheme, useStyles} from '../../helpers/colors';

interface ICameraEventClipProps {
  event: ICameraEvent;
}

interface IVideoPlayerProps {
  clipUrl: string;
  fileName?: string;
}

const VideoPlayer: FC<IVideoPlayerProps> = ({
  clipUrl,
  fileName = 'clip.mp4',
}) => {
  const styles = useStyles(({theme}) => ({
    wrapper: {
      backgroundColor: theme.background,
    },
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
      backgroundColor: theme.background,
    },
    errorText: {
      color: theme.text,
      fontSize: 18,
      textAlign: 'center',
    },
    progressText: {
      color: theme.text,
    },
    tools: {
      position: 'absolute',
      left: 0,
      top: 0,
    },
  }));
  const theme = useTheme();

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
        const filePath = `${dirs.CacheDir}/${fileName}`;
        RNFetchBlob.session('playback').dispose();
        const downloader = RNFetchBlob.config({
          fileCache: true,
          session: 'playback',
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

  const share = () => {
    Share.open({
      url: `file://${uri}`,
    });
  };

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
        <ActivityIndicator size="large" color={theme.text} />
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
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
      <View style={styles.tools}>
        <TouchableHighlight onPress={share}>
          <IconOutline name="share-alt" color="white" size={20} />
        </TouchableHighlight>
      </View>
    </View>
  );
};

export const CameraEventClip: NavigationFunctionComponent<
  ICameraEventClipProps
> = ({event}) => {
  const apiUrl = useAppSelector(selectServerApiUrl);

  const clipUrl = useMemo(
    () => `${apiUrl}/events/${event.id}/clip.mp4`,
    [event.id, apiUrl],
  );

  const fileName = useMemo(() => clipFilename(event), [event]);

  return <VideoPlayer clipUrl={clipUrl} fileName={fileName} />;
};
