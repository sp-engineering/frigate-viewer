import {useEffect} from 'react';
import {Navigation, OptionsTopBarButton} from 'react-native-navigation';

export type MenuId = 'camerasList' | 'retained' | 'settings' | 'author';

export const useMenu = (navComponentId: string, current?: MenuId) => {
  useEffect(() => {
    const sub = Navigation.events().registerNavigationButtonPressedListener(
      event => {
        if (event.buttonId === 'menu') {
          Navigation.showModal({
            sideMenu: {
              center: {
                component: {
                  name: 'Menu',
                  passProps: {
                    current,
                    navComponentId,
                  },
                },
              },
            },
          });
        }
      },
    );
    return () => {
      sub.remove();
    };
  }, [navComponentId, current]);
};

export const menuButton: OptionsTopBarButton = {
  id: 'menu',
  text: 'Menu',
  color: 'white',
};
