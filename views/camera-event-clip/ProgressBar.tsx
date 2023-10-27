import {IconOutline} from '@ant-design/icons-react-native';
import React, {FC, useCallback, useMemo, useState} from 'react';
import {DimensionValue, LayoutChangeEvent, StyleSheet, Text, View} from 'react-native';
import {formatVideoTime} from '../../helpers/locale';
import { Gesture, GestureDetector, TouchableHighlight } from 'react-native-gesture-handler';

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
  playerProgressBarBall: {
    position: 'absolute',
    top: -2,
    width: 7,
    height: 7,
    backgroundColor: '#ffffff',
  },
});

interface IProgressBarProps {
  paused: boolean;
  currentTime: number;
  duration: number;
  onPausePress?: (paused: boolean) => void;
  onSeek?: (pos: number) => void;
}

export const ProgressBar: FC<IProgressBarProps> = ({
  paused,
  currentTime,
  duration,
  onPausePress,
  onSeek,
}) => {
  const [progressBarWidth, setProgressBarWidth] = useState<number>();
  const [ballPos, setBallPos] = useState<number>();

  const onProgressBarLayout = useCallback((event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    setProgressBarWidth(width);
  }, []);

  const currentTimeStr = useMemo(
    () => formatVideoTime(currentTime),
    [currentTime],
  );

  const durationStr = useMemo(() => formatVideoTime(duration), [duration]);

  const percentage = useMemo(() => `${currentTime / duration * 100}%`, [currentTime, duration]);

  const togglePause = () => {
    if (onPausePress) {
      onPausePress(!paused);
    }
  };

  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onBegin(event => {
      setBallPos(event.x);
    })
    .onTouchesMove(event => {
      setBallPos(event.allTouches[0].x);
    })
    .onEnd((event) => {
      if (progressBarWidth && onSeek) {
        const seekPos = event.x / progressBarWidth;
        const seekTime = seekPos * duration;
        onSeek(seekTime);
        setBallPos(undefined);
      }
    });

  return (
    <View style={[styles.playerBar]}>
      <TouchableHighlight onPress={togglePause}>
        {paused ? (
          <IconOutline name="pause" color="white" />
        ) : (
          <IconOutline name="caret-right" color="white" />
        )}
      </TouchableHighlight>
      <Text style={[styles.playerBarText]}>{currentTimeStr}</Text>
      <GestureDetector gesture={tapGesture}>
        <View style={[styles.playerProgressBar]} onLayout={onProgressBarLayout}>
          <View style={[styles.playerProgressBarTrack, {width: percentage as DimensionValue}]} />
          {ballPos !== undefined && <View style={[styles.playerProgressBarBall, {left: ballPos - 4}]} />}
        </View>
      </GestureDetector>
      <Text style={[styles.playerBarText]}>{durationStr}</Text>
    </View>
  );
};
