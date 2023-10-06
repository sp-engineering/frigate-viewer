import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Colors, Drawer, DrawerItemProps} from 'react-native-ui-lib';
import {ZoomableImage} from '../../components/ZoomableImage';
import {del} from '../../helpers/rest';
import {
  selectServerApiUrl,
  selectEventsSnapshotHeight,
  selectEventsNumColumns,
} from '../../store/settings';
import {useAppSelector} from '../../store/store';
import {EventLabels} from './EventLabels';
import {EventTitle} from './EventTitle';
import {messages} from './messages';

export interface ICameraEvent {
  id: string;
  camera: string;
  thumbnail: string;
  start_time: number;
  end_time: number; // timestamp
  zones: string[];
  area: string | null;
  box: string | null;
  has_clip: boolean;
  has_snapshot: boolean;
  label: string;
  sub_label: string | null;
  plus_id: string | null;
  top_score: number; // float [0,1]
  false_positive: null;
  ratio: null;
  region: null;
  retain_indefinitely: boolean;
}

interface ICameraEventProps extends ICameraEvent {
  componentId: string;
  onDelete: (id: string[]) => void;
  onSnapshotHeight: (height: number) => void;
}

const styles = StyleSheet.create({
  cameraEvent: {
    paddingVertical: 1,
    paddingHorizontal: 2,
  },
  cameraEventImage: {
    flex: 1,
  },
});

export const CameraEvent: FC<ICameraEventProps> = ({
  id,
  has_snapshot,
  start_time,
  end_time,
  label,
  zones,
  top_score,
  onDelete,
  onSnapshotHeight,
}) => {
  const [snapshot, setSnapshot] = useState<string>();
  const apiUrl = useAppSelector(selectServerApiUrl);
  const snapshotHeight = useAppSelector(selectEventsSnapshotHeight);
  const numColumns = useAppSelector(selectEventsNumColumns);
  const intl = useIntl();

  useEffect(() => {
    const url = has_snapshot
      ? `${apiUrl}/events/${id}/snapshot.jpg?bbox=1`
      : `${apiUrl}/events/${id}/thumbnail.jpg`;
    setSnapshot(url);
  }, [id, has_snapshot, apiUrl]);

  const showEventClip = useCallback(() => {
    Navigation.showModal({
      component: {
        name: 'CameraEventClip',
        passProps: {
          eventId: id,
        },
        options: {
          layout: {
            orientation: ['landscape'],
          },
        },
      },
    });
  }, [id]);

  const onSnapshotLoad = useCallback(async () => {
    if (snapshot) {
      try {
        Image.getSize(snapshot, (width, height) => {
          const proportion = height / width;
          const windowWidth = Dimensions.get('window').width;
          const newHeight = (windowWidth * proportion) / numColumns;
          if (newHeight !== snapshotHeight) {
            onSnapshotHeight(newHeight);
          }
        });
      } catch (err) {}
    }
  }, [snapshot, numColumns, snapshotHeight, onSnapshotHeight]);

  const deleteDrawerItem: DrawerItemProps = useMemo(
    () => ({
      text: intl.formatMessage(messages['action.delete']),
      background: Colors.red30,
      onPress: () => {
        del(`${apiUrl}/events/${id}`).subscribe(() => {
          onDelete([id]);
        });
      },
    }),
    [apiUrl, id, intl, onDelete],
  );

  return (
    <Drawer leftItem={deleteDrawerItem}>
      <TouchableWithoutFeedback onPress={showEventClip}>
        <View
          style={[
            styles.cameraEvent,
            {
              width: `${100 / numColumns}%`,
              height: snapshotHeight,
            },
          ]}>
          {snapshot && (
            <ZoomableImage
              source={{uri: snapshot}}
              style={styles.cameraEventImage}
              fadeDuration={0}
              resizeMode="contain"
              resizeMethod="scale"
              onLoad={onSnapshotLoad}
            />
          )}
          <EventTitle startTime={start_time} endTime={end_time} />
          <EventLabels
            endTime={end_time}
            label={label}
            zones={zones}
            topScore={top_score}
          />
        </View>
      </TouchableWithoutFeedback>
    </Drawer>
  );
};
