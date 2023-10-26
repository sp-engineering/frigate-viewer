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
    return () => {
      Navigation.mergeOptions(componentId, {
        sideMenu: {
          right: {
            enabled: false,
          },
        },
      });
    };
  }, [componentId]);
};

export const filterButton: (count?: number) => OptionsTopBarButton = count => ({
  id: 'filter',
  component: {
    id: 'FilterButton',
    name: 'TopBarButton',
    passProps: {
      icon: 'filter',
      count,
      onPress: () => {
        Navigation.mergeOptions('Menu', {
          sideMenu: {
            right: {
              visible: true,
            },
          },
        });
      },
    },
  },
});
