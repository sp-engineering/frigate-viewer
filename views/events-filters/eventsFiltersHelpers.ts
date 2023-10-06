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

export const filterButton: OptionsTopBarButton = {
  id: 'filter',
  component: {
    id: 'FilterButton',
    name: 'TopBarButton',
    passProps: {
      icon: 'filter',
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
};
