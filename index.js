import {Navigation} from 'react-native-navigation';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {TopBarButton} from './components/icons/TopBarButton';
import {Author} from './views/author/Author';
import {CameraEventClip} from './views/camera-event-clip/CameraEventClip';
import {CameraEvents} from './views/camera-events/CameraEvents';
import {CamerasList} from './views/cameras-list/CamerasList';
import {EventsFilters} from './views/events-filters/EventsFilters';
import {Menu} from './views/menu/Menu';
import {Settings} from './views/settings/Settings';

const registerView = (name, component) => {
  Navigation.registerComponent(
    name,
    () => gestureHandlerRootHOC(component),
    () => component,
  );
};

registerView('CamerasList', CamerasList);
registerView('CameraEvents', CameraEvents);
registerView('CameraEventClip', CameraEventClip);
registerView('Settings', Settings);
registerView('Author', Author);

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
