import {RefreshControl} from 'react-native-gesture-handler';
import {useTheme} from '../helpers/colors';
import {FC} from 'react';
import {RefreshControlProps} from 'react-native';

export const Refresh: FC<RefreshControlProps> = refreshControlProps => {
  const theme = useTheme();

  return (
    <RefreshControl
      {...refreshControlProps}
      colors={[theme.text]}
      progressBackgroundColor={theme.background}
      tintColor={theme.text}
    />
  );
};
