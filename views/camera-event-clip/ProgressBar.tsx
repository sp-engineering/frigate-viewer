import {IconOutline} from '@ant-design/icons-react-native';
import React, {FC, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {formatVideoTime} from '../../helpers/locale';

const styles = StyleSheet.create({
  playerBar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    padding: 1,
    backgroundColor: '#00000055',
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerBarText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  playerProgressBar: {
    height: 3,
    flex: 1,
    marginVertical: 1,
    marginHorizontal: 8,
    borderColor: '#ffffff',
    borderBottomWidth: 1,
  },
  playerProgressBarTrack: {
    backgroundColor: '#ffffff',
    height: '100%',
  },
});

interface IProgressBarProps {
  paused: boolean;
  currentTime: number;
  duration: number;
}

export const ProgressBar: FC<IProgressBarProps> = ({
  paused,
  currentTime,
  duration,
}) => {
  const currentTimeStr = useMemo(
    () => formatVideoTime(currentTime),
    [currentTime],
  );

  const durationStr = useMemo(() => formatVideoTime(duration), [duration]);

  const percentage = useMemo(() => `${currentTime / duration * 100}%`, [currentTime, duration]);

  return (
    <View style={[styles.playerBar]}>
      {paused ? (
        <IconOutline name="pause" color="white" />
      ) : (
        <IconOutline name="caret-right" color="white" />
      )}
      <Text style={[styles.playerBarText]}>{currentTimeStr}</Text>
      <View style={[styles.playerProgressBar]}>
        <View style={[styles.playerProgressBarTrack, {width: percentage}]} />
      </View>
      <Text style={[styles.playerBarText]}>{durationStr}</Text>
    </View>
  );
};
