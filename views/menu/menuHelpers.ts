import {useEffect} from 'react';
import {Navigation, OptionsTopBarButton} from 'react-native-navigation';

export type MenuId =
  | 'camerasList'
  | 'cameraEvents'
  | 'retained'
  | 'settings'
  | 'author';

export const useMenu = (componentId: string, current?: MenuId) => {
  useEffect(() => {
    const sub = Navigation.events().registerNavigationButtonPressedListener(
      event => {
        if (event.buttonId === 'menu') {
          Navigation.updateProps('Menu', {
            current,
          });
          Navigation.mergeOptions(componentId, {
            sideMenu: {
              left: {
                visible: true,
              },
            },
          });
        }
      },
    );
    return () => {
      sub.remove();
    };
  }, [componentId, current]);
};

export const menuButton: OptionsTopBarButton = {
  id: 'menu',
  text: 'Menu',
  color: 'white',
};
