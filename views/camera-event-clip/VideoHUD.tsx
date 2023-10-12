import {IconOutline} from '@ant-design/icons-react-native';
import React, {FC, useCallback, useMemo, useState} from 'react';
import Animated, {
  LightSpeedInLeft,
  LightSpeedInRight,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {StyleSheet, Text, View, ViewProps} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {formatVideoTime} from '../../helpers/locale';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
  },
  hud: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  left: {},
  center: {},
  right: {},
  icon: {
    textShadowRadius: 20,
  },
  bigText: {
    fontSize: 60,
    color: 'white',
    textShadowRadius: 20,
  },
});

interface IVideoHUDProps extends ViewProps {
  paused: boolean;
  currentTime?: number;
  duration?: number;
  onPaused?: (paused: boolean) => void;
  onSeek?: (pos: number) => void;
}

const Baunce = () => {
  'worklet';
  return {
    initialValues: {
      opacity: 0,
      transform: [{scale: 0}],
    },
    animations: {
      opacity: withSequence(withTiming(1), withDelay(500, withTiming(0))),
      transform: [{scale: withSpring(1)}],
    },
  };
};

const BackwardIcon: FC = () => (
  <Animated.View entering={LightSpeedInRight}>
    <IconOutline style={styles.icon} name="backward" color="white" size={80} />
  </Animated.View>
);

const ForwardIcon: FC = () => (
  <Animated.View entering={LightSpeedInLeft}>
    <IconOutline style={styles.icon} name="forward" color="white" size={80} />
  </Animated.View>
);

const PauseIcon: FC = () => (
  <Animated.View entering={Baunce}>
    <IconOutline style={styles.icon} name="pause" color="white" size={80} />
  </Animated.View>
);

const PlayIcon: FC = () => (
  <Animated.View entering={Baunce}>
    <IconOutline
      style={styles.icon}
      name="caret-right"
      color="white"
      size={80}
    />
  </Animated.View>
);

export const VideoHUD: FC<IVideoHUDProps> = ({
  paused,
  currentTime,
  duration,
  onPaused,
  onSeek,
  children,
}) => {
  const [seekTime, setSeekTime] = useState<number>();

  const play = useCallback(() => {
    if (onPaused) {
      onPaused(false);
    }
  }, [onPaused]);

  const pause = useCallback(() => {
    if (onPaused) {
      onPaused(true);
    }
  }, [onPaused]);

  const togglePlay = useCallback(() => {
    if (onPaused) {
      onPaused(!paused);
    }
  }, [paused, onPaused]);

  const seek = useCallback(
    (pos?: number) => {
      if (onSeek && pos !== undefined) {
        onSeek(pos);
      }
    },
    [onSeek],
  );

  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => {
      togglePlay();
    });

  const longPressGesture = Gesture.Pan()
    .runOnJS(true)
    .minDistance(50)
    .onStart(() => {
      pause();
    })
    .onUpdate(event => {
      if (currentTime !== undefined && duration !== undefined) {
        const position = currentTime / duration;
        const distance = event.translationX;
        const minmax = (value: number, min: number, max: number) =>
          Math.max(min, Math.min(max, value));
        const desiredPos = minmax(position + distance / 200, 0, 1);
        setSeekTime(desiredPos * duration);
      }
    })
    .onEnd(() => {
      seek(seekTime || 0);
      play();
      setSeekTime(undefined);
    });

  const formattedSeekTime = useMemo(
    () =>
      seekTime !== undefined && duration !== undefined && currentTime !== undefined
        ? `${seekTime > currentTime ? '+' : ''}${formatVideoTime(seekTime - currentTime)}`
        : undefined,
    [seekTime, duration, currentTime],
  );

  const direction = useMemo(
    () =>
      seekTime !== undefined && currentTime !== undefined
        ? seekTime < currentTime
          ? -1
          : 1
        : 0,
    [seekTime, currentTime],
  );

  const gestures = Gesture.Exclusive(longPressGesture, tapGesture);

  return (
    <GestureDetector gesture={gestures}>
      <View style={styles.wrapper}>
        {children}
        <View style={styles.hud}>
          <View style={styles.left}>
            {direction === -1 ? <BackwardIcon /> : <></>}
          </View>
          <View style={styles.center}>
            {formattedSeekTime ? (
              <Text style={styles.bigText}>{formattedSeekTime}</Text>
            ) : (
              <View>
                {paused && <PauseIcon />}
                {!paused && <PlayIcon />}
              </View>
            )}
          </View>
          <View style={styles.right}>
            {direction === 1 ? <ForwardIcon /> : <></>}
          </View>
        </View>
      </View>
    </GestureDetector>
  );
};
