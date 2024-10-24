import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {Image, TouchableWithoutFeedback, View} from 'react-native';
import {Colors, Drawer, DrawerItemProps} from 'react-native-ui-lib';
import crashlytics from '@react-native-firebase/crashlytics';
import {useRest} from '../../helpers/rest';
import {
  selectEventsSnapshotHeight,
  selectEventsNumColumns,
  selectServer,
} from '../../store/settings';
import {useAppSelector} from '../../store/store';
import {EventLabels} from './EventLabels';
import {EventTitle} from './EventTitle';
import {messages} from './messages';
import {EventSnapshot} from './EventSnapshot';
import {useStyles} from '../../helpers/colors';

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
  data: {
    top_score: number; // float [0,1]
  };
  false_positive: null;
  ratio: null;
  region: null;
  retain_indefinitely: boolean;
}

interface ICameraEventProps extends ICameraEvent {
  componentId: string;
  onDelete: (id: string[]) => void;
  onSnapshotDimensions: (width: number, height: number) => void;
  onEventPress: (event: ICameraEvent) => void;
  onShare: (event: ICameraEvent) => void;
}

export const CameraEvent: FC<ICameraEventProps> = props => {
  const styles = useStyles(({theme}) => ({
    cameraEvent: {
      paddingVertical: 1,
      paddingHorizontal: 2,
      backgroundColor: theme.background,
    },
  }));

  const {onDelete, onSnapshotDimensions, onEventPress, onShare, ...event} =
    props;
  const {
    id,
    has_snapshot,
    start_time,
    end_time,
    label,
    zones,
    data,
    retain_indefinitely,
  } = event;
  const [retained, setRetained] = useState(false);
  const server = useAppSelector(selectServer);
  const snapshotHeight = useAppSelector(selectEventsSnapshotHeight);
  const numColumns = useAppSelector(selectEventsNumColumns);
  const intl = useIntl();
  const {del, post} = useRest();

  useEffect(() => {
    setRetained(retain_indefinitely);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSnapshotLoad = useCallback(
    async (snapshot: string) => {
      if (snapshot) {
        try {
          crashlytics().log(`Get image size of ${snapshot}`);
          Image.getSize(snapshot, (width, height) => {
            onSnapshotDimensions(width, height);
          });
        } catch (err) {
          crashlytics().recordError(err as Error);
        }
      }
    },
    [numColumns, snapshotHeight, onSnapshotDimensions],
  );

  const deleteDrawerItem: DrawerItemProps = useMemo(
    () => ({
      text: intl.formatMessage(messages['action.delete']),
      icon: require('./icons/delete.png'),
      background: Colors.red30,
      onPress: () => {
        del(server, `events/${id}`, {json: false}).then(() => {
          onDelete([id]);
        });
      },
    }),
    [server, id, intl, onDelete],
  );

  const retainDrawerItem: DrawerItemProps = useMemo(
    () =>
      retained
        ? {
            text: intl.formatMessage(messages['action.unretain']),
            icon: require('./icons/star.png'),
            background: Colors.red40,
            onPress: () => {
              del(server, `events/${id}/retain`, {json: false}).then(() => {
                setRetained(false);
              });
            },
          }
        : {
            text: intl.formatMessage(messages['action.retain']),
            icon: require('./icons/star.png'),
            background: Colors.green30,
            onPress: () => {
              post(server, `events/${id}/retain`, {json: false}).then(() => {
                setRetained(true);
              });
            },
          },
    [server, id, intl, retained],
  );

  const shareDrawerItem: DrawerItemProps = useMemo(
    () => ({
      text: intl.formatMessage(messages['action.share']),
      icon: require('./icons/share.png'),
      background: Colors.blue10,
      onPress: () => {
        onShare(event);
      },
    }),
    [intl],
  );

  return (
    <Drawer
      leftItem={deleteDrawerItem}
      rightItems={[shareDrawerItem, retainDrawerItem]}
      style={{
        width: `${100 / numColumns}%`,
        height: snapshotHeight,
      }}>
      <TouchableWithoutFeedback onPress={() => onEventPress(event)}>
        <View
          style={[
            styles.cameraEvent,
            {
              height: snapshotHeight,
            },
          ]}>
          <EventSnapshot
            id={id}
            hasSnapshot={has_snapshot}
            onSnapshotLoad={onSnapshotLoad}
          />
          <EventTitle
            startTime={start_time}
            endTime={end_time}
            retained={retained}
            numColumns={numColumns}
          />
          <EventLabels
            endTime={end_time}
            label={label}
            zones={zones}
            topScore={data.top_score}
            numColumns={numColumns}
          />
        </View>
      </TouchableWithoutFeedback>
    </Drawer>
  );
};
