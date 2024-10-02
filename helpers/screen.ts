import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import {EventSubscription, Navigation} from 'react-native-navigation';

export const useOrientation = () => {
  const [componentId, setComponentId] = useState<string>();
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>();

  const checkOrientation = () => {
    const screen = Dimensions.get('screen');
    const newOrientation =
      screen.width > screen.height ? 'landscape' : 'portrait';
    if (orientation !== newOrientation) {
      setOrientation(newOrientation);
    }
  };

  useEffect(() => {
    checkOrientation();
    const sub = Dimensions.addEventListener('change', checkOrientation);
    return () => {
      sub.remove();
    };
  }, []);

  useEffect(() => {
    let listener: EventSubscription | undefined;
    if (componentId) {
      listener = Navigation.events().registerComponentListener(
        {
          componentDidDisappear() {
            checkOrientation();
          },
        },
        componentId,
      );
    }
    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [componentId]);

  return {
    orientation,
    setComponentId,
  };
};
