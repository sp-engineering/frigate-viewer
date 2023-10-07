import { FC, useCallback, useEffect, useState } from 'react';
import { ZoomableImage } from '../../components/ZoomableImage';
import { StyleSheet } from 'react-native';
import { useAppSelector } from '../../store/store';
import { selectEventsPhotoPreference, selectServerApiUrl } from '../../store/settings';

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

export const EventSnapshot: FC<IEventSnapshotProps> = ({id, hasSnapshot, onSnapshotLoad}) => {
  const [snapshot, setSnapshot] = useState<string>();
  const photoPreference = useAppSelector(selectEventsPhotoPreference);
  const apiUrl = useAppSelector(selectServerApiUrl);

  useEffect(() => {
    const url = hasSnapshot && photoPreference === 'snapshot'
      ? `${apiUrl}/events/${id}/snapshot.jpg?bbox=1`
      : `${apiUrl}/events/${id}/thumbnail.jpg`;
    setSnapshot(url);
  }, [id, hasSnapshot, apiUrl]);

  const onLoad = useCallback(() => {
    if (onSnapshotLoad && snapshot) {
      onSnapshotLoad(snapshot);
    }
  }, [onSnapshotLoad, snapshot]);

  return snapshot
    ? (
      <ZoomableImage
        source={{uri: snapshot}}
        style={styles.image}
        fadeDuration={0}
        resizeMode="contain"
        resizeMethod="scale"
        onLoad={onLoad}
      />
      )
      : <></>;
};
