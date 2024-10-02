import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {Image, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Colors, Drawer, DrawerItemProps} from 'react-native-ui-lib';
import {del, post} from '../../helpers/rest';
import {
  selectServerApiUrl,
  selectEventsSnapshotHeight,
  selectEventsNumColumns,
  selectServerCredentials,
} from '../../store/settings';
import {useAppSelector} from '../../store/store';
import {EventLabels} from './EventLabels';
import {EventTitle} from './EventTitle';
import {messages} from './messages';
import {EventSnapshot} from './EventSnapshot';

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
}

const styles = StyleSheet.create({
  cameraEvent: {
    paddingVertical: 1,
    paddingHorizontal: 2,
    backgroundColor: 'white',
  },
});

export const CameraEvent: FC<ICameraEventProps> = props => {
  const {onDelete, onSnapshotDimensions, onEventPress, ...event} = props;
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
  const apiUrl = useAppSelector(selectServerApiUrl);
  const credentials = useAppSelector(selectServerCredentials);
  const snapshotHeight = useAppSelector(selectEventsSnapshotHeight);
  const numColumns = useAppSelector(selectEventsNumColumns);
  const intl = useIntl();

  useEffect(() => {
    setRetained(retain_indefinitely);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSnapshotLoad = useCallback(
    async (snapshot: string) => {
      if (snapshot) {
        try {
          Image.getSize(snapshot, (width, height) => {
            onSnapshotDimensions(width, height);
          });
        } catch (err) {}
      }
    },
    [numColumns, snapshotHeight, onSnapshotDimensions],
  );

  const deleteDrawerItem: DrawerItemProps = useMemo(
    () => ({
      text: intl.formatMessage(messages['action.delete']),
      background: Colors.red30,
      onPress: () => {
        del(`${apiUrl}/events/${id}`, credentials, undefined, false).then(
          () => {
            onDelete([id]);
          },
        );
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
              del(
                `${apiUrl}/events/${id}/retain`,
                credentials,
                undefined,
                false,
              ).then(() => {
                setRetained(false);
              });
            },
          }
        : {
            text: intl.formatMessage(messages['action.retain']),
            background: Colors.green30,
            onPress: () => {
              post(
                `${apiUrl}/events/${id}/retain`,
                credentials,
                undefined,
                false,
              ).then(() => {
                setRetained(true);
              });
            },
          },
    [apiUrl, id, intl, retained],
  );

  return (
    <Drawer
      leftItem={deleteDrawerItem}
      rightItems={[retainDrawerItem]}
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
