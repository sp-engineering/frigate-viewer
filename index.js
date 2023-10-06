import {Navigation} from 'react-native-navigation';
import CamerasList from './views/cameras-list/CamerasList';

Navigation.registerComponent(
  'com.frigateViewer.CamerasList',
  () => CamerasList,
);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'com.frigateViewer.CamerasList',
            },
          },
        ],
      },
    },
  });
});
