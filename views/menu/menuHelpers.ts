import {useEffect} from 'react';
import {Navigation, OptionsTopBarButton} from 'react-native-navigation';

export type MenuId =
  | 'camerasList'
  | 'cameraEvents'
  | 'retained'
  | 'storage'
  | 'system'
  | 'logs'
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
    return () => {
      Navigation.mergeOptions(componentId, {
        sideMenu: {
          left: {
            enabled: false,
          },
        },
      });
    };
  }, [componentId, current]);
};

export const menuButton: OptionsTopBarButton = {
  id: 'menu',
  component: {
    name: 'TopBarButton',
    passProps: {
      icon: 'menu',
      onPress: () => {
        Navigation.mergeOptions('Menu', {
          sideMenu: {
            left: {
              visible: true,
            },
          },
        });
      },
    },
  },
};
