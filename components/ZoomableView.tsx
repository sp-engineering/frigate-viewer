import React, {FC} from 'react';
import {ViewProps} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type IZoomableViewProps = ViewProps;

export const ZoomableView: FC<IZoomableViewProps> = ({style, ...viewProps}) => {
  const offset = useSharedValue({x: 0, y: 0});
  const scale = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: scale.value * offset.value.x},
        {translateY: scale.value * offset.value.y},
        {scale: withSpring(Math.max(scale.value, 1))},
      ],
    };
  });

  const nativeGesture = Gesture.Native();

  const zoomGesture = Gesture.Pinch()
    .manualActivation(true)
    .onTouchesDown((event, manager) => {
      if (event.numberOfTouches > 1) {
        manager.activate();
      }
    })
    .onUpdate(event => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = 1;
    });

  const dragGesture = Gesture.Pan()
    .averageTouches(true)
    .manualActivation(true)
    .onTouchesDown((event, manager) => {
      if (event.numberOfTouches > 1) {
        manager.activate();
      }
    })
    .onUpdate(event => {
      if (event.numberOfPointers > 1) {
        offset.value = {
          x: event.translationX,
          y: event.translationY,
        };
      }
    })
    .onEnd(() => {
      offset.value = {x: 0, y: 0};
    });

  const gestures = Gesture.Race(
    nativeGesture,
    Gesture.Simultaneous(zoomGesture, dragGesture),
  );

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View style={[style, animatedStyles]} {...viewProps} />
    </GestureDetector>
  );
};
