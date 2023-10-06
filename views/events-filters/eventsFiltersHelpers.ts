import {useEffect} from 'react';
import {Navigation, OptionsTopBarButton} from 'react-native-navigation';

export const useEventsFilters = (
  componentId: string,
  cameraNames?: string[],
) => {
  useEffect(() => {
    Navigation.updateProps('EventsFilters', {
      viewedCameraNames: cameraNames,
    });
  }, [cameraNames]);

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      sideMenu: {
        right: {
          enabled: true,
        },
      },
    });
    const sub = Navigation.events().registerNavigationButtonPressedListener(
      event => {
        if (event.buttonId === 'filter') {
          Navigation.mergeOptions(componentId, {
            sideMenu: {
              right: {
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
          right: {
            enabled: false,
          },
        },
      });
      sub.remove();
    };
  }, [componentId]);
};

export const filterButton: OptionsTopBarButton = {
  id: 'filter',
  text: 'Filter',
  color: 'white',
};
