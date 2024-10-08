import {FC} from 'react';
import {View, ViewProps} from 'react-native';
import {useStyles} from '../helpers/colors';

export const Background: FC<ViewProps> = ({children}) => {
  const styles = useStyles(({theme}) => ({
    wrapper: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.background,
    },
  }));

  return <View style={styles.wrapper}>{children}</View>;
};
