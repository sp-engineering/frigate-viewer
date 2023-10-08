import { FC, useCallback } from 'react';
import { ICameraEvent } from '../camera-events/CameraEvent';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { EventSnapshot } from '../camera-events/EventSnapshot';
import { EventLabels } from '../camera-events/EventLabels';
import { EventTitle } from '../camera-events/EventTitle';
import { useAppSelector } from '../../store/store';
import { selectCamerasNumColumns, selectCamerasPreviewHeight } from '../../store/settings';

const styles = StyleSheet.create({
  eventMetadata: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  eventTitle: {
    position: 'relative',
  },
  eventLabels: {
    position: 'relative',
  },
});

interface ILastEventProps {
  event?: ICameraEvent;
  onPress?: () => void;
}

export const LastEvent: FC<ILastEventProps> = ({event, onPress}) => {
  const previewHeight = useAppSelector(selectCamerasPreviewHeight);
  const numColumns = useAppSelector(selectCamerasNumColumns);

  const onEventPress = useCallback(() => {
    if (onPress) {
      onPress();
    }
  }, [onPress]);

  return (
    <TouchableWithoutFeedback onPress={onEventPress}>
      <View
        style={{
          width: '100%',
          height: previewHeight
        }}>
        {event && (
          <>
            <EventSnapshot
              id={event.id}
              hasSnapshot={event.has_snapshot} />
            <View style={styles.eventMetadata}>
              <EventLabels
                endTime={event.end_time}
                label={event.label}
                zones={event.zones}
                topScore={event.top_score}
                style={styles.eventLabels}
                numColumns={numColumns}
              />
              <EventTitle
                startTime={event.start_time}
                endTime={event.end_time}
                retained={event.retain_indefinitely}
                style={styles.eventTitle}
                numColumns={numColumns}
              />
            </View>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
