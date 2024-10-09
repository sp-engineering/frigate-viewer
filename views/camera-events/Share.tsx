import {FC, useEffect, useMemo, useState} from 'react';
import {ActionSheet, Dialog} from 'react-native-ui-lib';
import {ICameraEvent} from './CameraEvent';
import {useIntl} from 'react-intl';
import RNFetchBlob from 'rn-fetch-blob';
import RNShare from 'react-native-share';
import {messages} from './messages';
import {authorizationHeader} from '../../helpers/rest';
import {useAppSelector} from '../../store/store';
import {
  selectServerApiUrl,
  selectServerCredentials,
} from '../../store/settings';
import {ActivityIndicator, Text, ToastAndroid} from 'react-native';
import {clipFilename, snapshotFilename} from './eventHelpers';
import {useStyles} from '../../helpers/colors';

interface ShareProps {
  event?: ICameraEvent;
  onDismiss?: () => void;
}

const stall = (ms: number = 0) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const Share: FC<ShareProps> = ({event, onDismiss}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const intl = useIntl();
  const apiUrl = useAppSelector(selectServerApiUrl);
  const credentials = useAppSelector(selectServerCredentials);

  const styles = useStyles(({theme}) => ({
    loadingText: {
      textAlign: 'center',
      color: 'white',
    },
  }));

  useEffect(() => {
    if (event) {
      setIsVisible(true);
    }
  }, [event]);

  const options = useMemo(() => {
    return [
      ...(event?.has_snapshot
        ? [
            {
              label: intl.formatMessage(messages['share.snapshot.label']),
              onPress: () => shareSnapshot(),
            },
          ]
        : []),
      ...(event?.has_clip
        ? [
            {
              label: intl.formatMessage(messages['share.clip.label']),
              onPress: () => shareClip(),
            },
          ]
        : []),
    ];
  }, [event]);

  const download = async (filename: string, url: string) => {
    try {
      setLoading(true);
      const dirs = RNFetchBlob.fs.dirs;
      const filePath = `${dirs.CacheDir}/${filename}`;
      const downloader = RNFetchBlob.config({
        fileCache: true,
        session: 'share',
        path: filePath,
      });
      await downloader
        .fetch('GET', url, authorizationHeader(credentials))
        .progress((received, total) => {
          const progress = Math.round((received / total) * 100);
          setProgress(progress);
        });
      setLoading(false);
      return filePath;
    } catch (err) {
      setLoading(false);
      ToastAndroid.show(JSON.stringify(err), ToastAndroid.LONG);
    }
  };

  const shareSnapshot = async () => {
    const filename = snapshotFilename(event!);
    const path = await download(
      filename,
      `${apiUrl}/events/${event!.id}/snapshot.jpg?bbox=1`,
    );
    await stall(200);
    RNShare.open({
      url: `file://${path}`,
    }).then(() => {
      RNFetchBlob.session('share').dispose();
    });
  };

  const shareClip = async () => {
    const filename = clipFilename(event!);
    const path = await download(
      filename,
      `${apiUrl}/events/${event!.id}/clip.mp4`,
    );
    await stall(200);
    RNShare.open({
      url: `file://${path}`,
    }).then(() => {
      RNFetchBlob.session('share').dispose();
    });
  };

  const close = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <>
      <ActionSheet
        title={intl.formatMessage(messages['action.share'])}
        visible={isVisible}
        options={options}
        onDismiss={close}
      />
      <Dialog visible={loading} ignoreBackgroundPress>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loadingText}>{progress}%</Text>
      </Dialog>
    </>
  );
};
