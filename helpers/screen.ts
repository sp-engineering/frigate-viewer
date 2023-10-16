import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>();

  useEffect(() => {
    const checkOrientation = () => {
      const screen = Dimensions.get('screen');
      const newOrientation = screen.width > screen.height ? 'landscape' : 'portrait';
      if (orientation !== newOrientation) {
        setOrientation(newOrientation);
      }
    };
    checkOrientation();
    const sub = Dimensions.addEventListener('change', checkOrientation);
    return () => {
      sub.remove();
    };
  }, []);

  return orientation;
};
