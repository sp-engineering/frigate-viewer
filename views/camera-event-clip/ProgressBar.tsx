import {IconOutline} from '@ant-design/icons-react-native';
import React, {FC, useCallback, useMemo, useState} from 'react';
import {DimensionValue, LayoutChangeEvent, StyleSheet, Text, View} from 'react-native';
import {formatVideoTime} from '../../helpers/locale';
import { Gesture, GestureDetector, TouchableHighlight } from 'react-native-gesture-handler';
import Animated, { clamp, measure, runOnJS, useAnimatedRef, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { colors } from '../../store/colors';

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
    flex: 1,
    marginHorizontal: 8,
  },
  playerProgressBarTrack: {
    height: 3,
    borderColor: '#ffffff',
    borderBottomWidth: 1,
  },
  playerProgressBarProgress: {
    backgroundColor: '#ffffff',
    height: '100%',
  },
  playerProgressBarBall: {
    position: 'absolute',
    top: -2,
    left: -4,
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
  const ballPos = useSharedValue<number | undefined>(undefined);
  const trackRef = useAnimatedRef();

  const animatedBall = useAnimatedStyle(() => ({
    display: ballPos.value !== undefined ? 'flex' : 'none',
    transform: [
      { translateX: ballPos.value || 0 },
    ],
  }));

  const currentTimeStr = useMemo(
    () => formatVideoTime(currentTime),
    [currentTime],
  );

  const durationStr = useMemo(() => formatVideoTime(duration), [duration]);

  const percentage = useMemo(() => `${currentTime / duration * 100}%`, [currentTime, duration]);

  const play = useCallback(() => {
    if (onPausePress) {
      onPausePress(false);
    }
  }, [onPausePress]);

  const pause = useCallback(() => {
    if (onPausePress) {
      onPausePress(true);
    }
  }, [onPausePress]);

  const togglePause = useCallback(() => {
    if (onPausePress) {
      onPausePress(!paused);
    }
  }, [onPausePress]);

  const seek = useCallback((seekPos: number) => {
    if (onSeek) {
      const seekTime = seekPos * duration;
      onSeek(seekTime);
    }
  }, []);

  const tapGesture = Gesture.Manual()
    .hitSlop({ top: 26, bottom: 6 })
    .onTouchesDown((event, manager) => {
      manager.activate();
      const trackMeasurements = measure(trackRef);
      if (trackMeasurements) {
        ballPos.value = clamp(event.allTouches[0].x, 0, trackMeasurements.width);
        runOnJS(pause)();
        runOnJS(seek)(ballPos.value / trackMeasurements.width);
      }
    })
    .onTouchesMove(event => {
      const trackMeasurements = measure(trackRef);
      if (trackMeasurements && ballPos.value !== undefined) {
        ballPos.value = clamp(event.allTouches[0].x, 0, trackMeasurements.width);
        runOnJS(seek)(ballPos.value / trackMeasurements.width);
      }
    })
    .onTouchesUp((event, manager) => {
      if (event.numberOfTouches === 0) {
        manager.end();
        runOnJS(play)();
        ballPos.value = undefined;
      }
    });

  return (
    <View style={[styles.playerBar]}>
      <TouchableHighlight onPress={togglePause}>
        {paused ? (
          <IconOutline name="pause" color={colors.text} />
        ) : (
            <IconOutline name="caret-right" color={colors.text} />
        )}
      </TouchableHighlight>
      <Text style={[styles.playerBarText]}>{currentTimeStr}</Text>
      <GestureDetector gesture={tapGesture}>
        <View style={[styles.playerProgressBar]}>
          <Animated.View style={styles.playerProgressBarTrack} ref={trackRef}>
            <View style={[styles.playerProgressBarProgress, {width: percentage as DimensionValue}]} />
            <Animated.View style={[styles.playerProgressBarBall, animatedBall]} />
          </Animated.View>
        </View>
      </GestureDetector>
      <Text style={[styles.playerBarText]}>{durationStr}</Text>
    </View>
  );
};
