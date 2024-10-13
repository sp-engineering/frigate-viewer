import {useEffect} from 'react';
import {Navigation, OptionsTopBarButton} from 'react-native-navigation';
import crashlytics from '@react-native-firebase/crashlytics';

export type MenuId =
  | 'camerasList'
  | 'cameraEvents'
  | 'retained'
  | 'storage'
  | 'system'
  | 'logs'
  | 'settings'
  | 'author'
  | 'report';

export const useSelectedMenuItem = (current?: MenuId) => {
  useEffect(() => {
    Navigation.updateProps('Menu', {
      current,
    });
  }, [current]);
};

export const useMenu = (componentId: string, current?: MenuId) => {
  crashlytics().log(`View change: ${current}`);
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
