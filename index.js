import {Navigation} from 'react-native-navigation';
import {TopBarButton} from './components/icons/TopBarButton';
import {Author} from './views/author/Author';
import {CameraEventClip} from './views/camera-event-clip/CameraEventClip';
import {CameraEvents} from './views/camera-events/CameraEvents';
import {CamerasList} from './views/cameras-list/CamerasList';
import {EventsFilters} from './views/events-filters/EventsFilters';
import {Menu} from './views/menu/Menu';
import {Settings} from './views/settings/Settings';

Navigation.registerComponent('CamerasList', () => CamerasList);
Navigation.registerComponent('CameraEvents', () => CameraEvents);
Navigation.registerComponent('CameraEventClip', () => CameraEventClip);
Navigation.registerComponent('Settings', () => Settings);
Navigation.registerComponent('Author', () => Author);
Navigation.registerComponent('Menu', () => Menu);
Navigation.registerComponent('EventsFilters', () => EventsFilters);
Navigation.registerComponent('TopBarButton', () => TopBarButton);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      sideMenu: {
        center: {
          stack: {
            id: 'MainMenu',
            children: [
              {
                component: {
                  name: 'CamerasList',
                },
              },
            ],
          },
        },
        left: {
          component: {
            id: 'Menu',
            name: 'Menu',
          },
        },
        right: {
          component: {
            id: 'EventsFilters',
            name: 'EventsFilters',
          },
        },
        options: {
          sideMenu: {
            left: {
              enabled: false,
            },
            right: {
              enabled: false,
            },
          },
        },
      },
    },
  });
});

Navigation.setDefaultOptions({
  statusBar: {
    backgroundColor: 'black',
  },
  topBar: {
    title: {
      color: 'white',
    },
    backButton: {
      color: 'white',
    },
    background: {
      color: 'black',
    },
  },
});
