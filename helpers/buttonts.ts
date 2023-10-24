import { OptionsTopBarButton } from 'react-native-navigation';

export const refreshButton: (onPress?: () => void) => OptionsTopBarButton = onPress => ({
  id: 'refresh',
  component: {
    id: 'FilterButton',
    name: 'TopBarButton',
    passProps: {
      icon: 'sync',
      onPress,
    },
  },
});
