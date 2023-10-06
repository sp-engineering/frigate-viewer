import {formatDistance, formatRelative} from 'date-fns';
import {enGB} from 'date-fns/locale';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {apiUrl} from '../../config';

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
}

const styles = StyleSheet.create({
  cameraEvent: {
    paddingVertical: 1,
    paddingHorizontal: 2,
    width: '100%',
    height: 222,
  },
  cameraEventTitle: {
    position: 'absolute',
    left: 2,
    top: 1,
    width: '100%',
    padding: 5,
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#00000040',
  },
  cameraEventImage: {
    flex: 1,
  },
  cameraEventLabels: {
    position: 'absolute',
    left: 2,
    bottom: 1,
    width: '100%',
    padding: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cameraEventLabel: {
    paddingVertical: 1,
    paddingHorizontal: 2,
    margin: 1,
    color: 'white',
    backgroundColor: 'blue',
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.7,
  },
  cameraEventZone: {
    backgroundColor: 'black',
  },
  cameraEventScore: {
    backgroundColor: 'gray',
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
}) => {
  const [snapshot, setSnapshot] = useState<string>();

  useEffect(() => {
    const url = has_snapshot
      ? `${apiUrl}/events/${id}/snapshot.jpg?bbox=1`
      : `${apiUrl}/events/${id}/thumbnail.jpg`;
    setSnapshot(url);
  }, [id, has_snapshot]);

  const startDate = useMemo(
    () =>
      formatRelative(new Date(start_time * 1000), new Date(), {locale: enGB}),
    [start_time],
  );

  const duration = useMemo(
    () =>
      formatDistance(new Date(end_time * 1000), new Date(start_time * 1000), {
        includeSeconds: true,
        locale: enGB,
      }),
    [start_time, end_time],
  );

  const score = useMemo(() => `${Math.round(top_score * 100)}%`, [top_score]);

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

  return (
    <TouchableWithoutFeedback onPress={showEventClip}>
      <View style={styles.cameraEvent}>
        {snapshot && (
          <Image
            source={{uri: snapshot}}
            style={styles.cameraEventImage}
            fadeDuration={0}
            resizeMode="contain"
            resizeMethod="scale"
          />
        )}
        <Text style={[styles.cameraEventTitle]}>
          {startDate} ({duration})
        </Text>
        <View style={[styles.cameraEventLabels]}>
          <Text style={[styles.cameraEventLabel]}>{label}</Text>
          {zones.map(zone => (
            <Text
              style={[styles.cameraEventLabel, styles.cameraEventZone]}
              key={zone}>
              {zone}
            </Text>
          ))}
          <Text style={[styles.cameraEventLabel, styles.cameraEventScore]}>
            {score}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
