import {useStyles} from '../../helpers/colors';

export const useFormsStyles = () =>
  useStyles(({theme}) => ({
    input: {
      borderBottomWidth: 2,
      borderColor: theme.border,
      borderRadius: 5,
      backgroundColor: theme.background,
      paddingHorizontal: 4,
      paddingVertical: 8,
    },
    inputText: {
      color: theme.text,
    },
  }));
