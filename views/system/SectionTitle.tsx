import {FC, PropsWithChildren} from 'react';
import {Text} from 'react-native-ui-lib';
import {useStyles} from '../../helpers/colors';

export const SectionTitle: FC<PropsWithChildren> = ({children}) => {
  const styles = useStyles(({theme}) => ({
    text: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '600',
      marginVertical: 10,
    },
  }));

  return <Text style={styles.text}>{children}</Text>;
};
