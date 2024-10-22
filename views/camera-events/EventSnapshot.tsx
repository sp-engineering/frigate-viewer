import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {ZoomableImage} from '../../components/ZoomableImage';
import {
  ImageLoadEventData,
  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';
import {useAppSelector} from '../../store/store';
import {selectEventsPhotoPreference, selectServer} from '../../store/settings';
import {authorizationHeader, buildServerApiUrl} from '../../helpers/rest';

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

interface IEventSnapshotProps {
  id: string;
  hasSnapshot: boolean;
  onSnapshotLoad?: (url: string) => void;
}

export const EventSnapshot: FC<IEventSnapshotProps> = ({
  id,
  hasSnapshot,
  onSnapshotLoad,
}) => {
  const [snapshot, setSnapshot] = useState<string>();
  const photoPreference = useAppSelector(selectEventsPhotoPreference);
  const server = useAppSelector(selectServer);

  useEffect(() => {
    const apiUrl = buildServerApiUrl(server);
    const url =
      hasSnapshot && photoPreference === 'snapshot'
        ? `${apiUrl}/events/${id}/snapshot.jpg?bbox=1`
        : `${apiUrl}/events/${id}/thumbnail.jpg`;
    setSnapshot(url);
  }, [id, hasSnapshot, server]);

  const onLoad = (event: NativeSyntheticEvent<ImageLoadEventData>) => {
    if (onSnapshotLoad && snapshot) {
      onSnapshotLoad(snapshot);
    }
  };

  return snapshot ? (
    <ZoomableImage
      source={{uri: snapshot, headers: authorizationHeader(server)}}
      style={styles.image}
      fadeDuration={0}
      resizeMode="cover"
      resizeMethod="scale"
      onLoad={onLoad}
    />
  ) : (
    <></>
  );
};
