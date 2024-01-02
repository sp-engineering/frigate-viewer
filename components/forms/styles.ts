import {StyleSheet} from 'react-native';
import { colors } from '../../store/colors';

export const formsStyles = StyleSheet.create({
  input: {
    borderBottomWidth: 2,
    borderColor: '#00000077',
    borderRadius: 5,
    backgroundColor: colors.background,
    color: colors.text,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  inputText: {
    color: colors.text,
  },
});
