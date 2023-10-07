import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {
  Dimensions,
  Image,
  StyleSheet,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Colors, Drawer, DrawerItemProps} from 'react-native-ui-lib';
import {ZoomableImage} from '../../components/ZoomableImage';
import {del, post} from '../../helpers/rest';
import {
  selectServerApiUrl,
  selectEventsSnapshotHeight,
  selectEventsNumColumns,
} from '../../store/settings';
import {useAppSelector} from '../../store/store';
import {EventLabels} from './EventLabels';
import {EventTitle} from './EventTitle';
import {messages} from './messages';
import { EventSnapshot } from './EventSnapshot';

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
});

export const CameraEvent: FC<ICameraEventProps> = ({
  id,
  has_clip,
  has_snapshot,
  start_time,
  end_time,
  label,
  zones,
  top_score,
  retain_indefinitely,
  onDelete,
  onSnapshotHeight,
}) => {
  const [retained, setRetained] = useState(false);
  const apiUrl = useAppSelector(selectServerApiUrl);
  const snapshotHeight = useAppSelector(selectEventsSnapshotHeight);
  const numColumns = useAppSelector(selectEventsNumColumns);
  const intl = useIntl();

  useEffect(() => {
    setRetained(retain_indefinitely);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showEventClip = useCallback(() => {
    if (has_clip) {
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
    } else {
      ToastAndroid.showWithGravity(
        intl.formatMessage(messages['toast.noClip']),
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
  }, [id]);

  const onSnapshotLoad = useCallback(async (snapshot: string) => {
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
  }, [numColumns, snapshotHeight, onSnapshotHeight]);

  const deleteDrawerItem: DrawerItemProps = useMemo(
    () => ({
      text: intl.formatMessage(messages['action.delete']),
      background: Colors.red30,
      onPress: () => {
        del(`${apiUrl}/events/${id}`, undefined, false).subscribe(() => {
          onDelete([id]);
        });
      },
    }),
    [apiUrl, id, intl, onDelete],
  );

  const retainDrawerItem: DrawerItemProps = useMemo(
    () =>
      retained
        ? {
            text: intl.formatMessage(messages['action.unretain']),
            background: Colors.red40,
            onPress: () => {
              del(`${apiUrl}/events/${id}/retain`, undefined, false).subscribe(
                () => {
                  setRetained(false);
                },
              );
            },
          }
        : {
            text: intl.formatMessage(messages['action.retain']),
            background: Colors.green30,
            onPress: () => {
              post(`${apiUrl}/events/${id}/retain`, undefined, false).subscribe(
                () => {
                  setRetained(true);
                },
              );
            },
          },
    [apiUrl, id, intl, retained],
  );

  return (
    <Drawer leftItem={deleteDrawerItem} rightItems={[retainDrawerItem]}>
      <TouchableWithoutFeedback onPress={showEventClip}>
        <View
          style={[
            styles.cameraEvent,
            {
              width: `${100 / numColumns}%`,
              height: snapshotHeight,
            },
          ]}>
          <EventSnapshot
            id={id}
            hasSnapshot={has_snapshot}
            onSnapshotLoad={onSnapshotLoad} />
          <EventTitle
            startTime={start_time}
            endTime={end_time}
            retained={retained}
          />
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
