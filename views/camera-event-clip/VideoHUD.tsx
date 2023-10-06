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
  duration?: number;
  position?: number;
  onPaused?: (paused: boolean) => void;
  onSeek?: (pos: number) => void;
}

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
  <IconOutline style={styles.icon} name="pause" color="white" size={80} />
);

const PlayIcon: FC = () => (
  <IconOutline style={styles.icon} name="caret-right" color="white" size={80} />
);

const Baunce: FC<ViewProps> = ({children, ...restProps}) => {
  const baunce = () => {
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

  return (
    <Animated.View entering={baunce} {...restProps}>
      {children}
    </Animated.View>
  );
};

const PlaybackIndicator: FC<{paused: boolean}> = ({paused}) => {
  return (
    <View>
      {paused && (
        <Baunce>
          <PauseIcon />
        </Baunce>
      )}
      {!paused && (
        <Baunce>
          <PlayIcon />
        </Baunce>
      )}
    </View>
  );
};

export const VideoHUD: FC<IVideoHUDProps> = ({
  paused,
  duration,
  position,
  onPaused,
  onSeek,
  children,
}) => {
  const [seekPos, setSeekPos] = useState<number>();

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
      if (position !== undefined) {
        const distance = event.translationX - 50;
        const minmax = (value: number, min: number, max: number) =>
          Math.max(min, Math.min(max, value));
        const desiredPos = minmax(position + distance / 200, 0, 1);
        setSeekPos(desiredPos);
      }
    })
    .onEnd(() => {
      seek(((seekPos || 0) * (duration || 0)) / 10000);
      play();
      setSeekPos(undefined);
    });

  const seekTime = useMemo(
    () =>
      seekPos !== undefined && duration !== undefined && position !== undefined
        ? `${seekPos - position > 0 ? '+' : ''}${formatVideoTime(
            duration * (seekPos - position),
          )}`
        : undefined,
    [seekPos, duration, position],
  );

  const direction = useMemo(
    () =>
      seekPos !== undefined && position !== undefined
        ? seekPos < position
          ? -1
          : 1
        : 0,
    [seekPos, position],
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
            {seekTime ? (
              <Text style={styles.bigText}>{seekTime}</Text>
            ) : (
              <PlaybackIndicator paused={paused} />
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
