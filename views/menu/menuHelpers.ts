import {useEffect} from 'react';
import {Navigation, OptionsTopBarButton} from 'react-native-navigation';

export type MenuId =
  | 'camerasList'
  | 'cameraEvents'
  | 'retained'
  | 'settings'
  | 'author';

export const useSelectedMenuItem = (current?: MenuId) => {
  useEffect(() => {
    Navigation.updateProps('Menu', {
      current,
    });
  }, [current]);
};

export const useMenu = (componentId: string, current?: MenuId) => {
  useSelectedMenuItem(current);

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      sideMenu: {
        left: {
          enabled: true,
        },
      },
    });
    const sub = Navigation.events().registerNavigationButtonPressedListener(
      event => {
        if (event.buttonId === 'menu') {
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
      Navigation.mergeOptions(componentId, {
        sideMenu: {
          left: {
            enabled: false,
          },
        },
      });
      sub.remove();
    };
  }, [componentId, current]);
};

export const menuButton: OptionsTopBarButton = {
  id: 'menu',
  text: 'Menu',
  color: 'white',
};
