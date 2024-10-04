import {StyleSheet, useColorScheme} from 'react-native';
import {selectAppColorScheme} from '../store/settings';
import {useAppSelector} from '../store/store';
import {useMemo} from 'react';

const defaultColorScheme = 'light';

type ColorName =
  | 'background'
  | 'text'
  | 'link'
  | 'border'
  | 'highlighted'
  | 'disabled'
  | 'overlay'
  | 'error'
  | 'tableColumnHeaderBg'
  | 'tableRowHeaderBg'
  | 'tableCellBg'
  | 'tableText';

type Theme = Record<ColorName, string>;

export const palette = {
  white: 'white',
  black: 'black',
  darkgray: '#222',
  blue: 'blue',
  lightblue: 'lightblue',
};

const lightTheme: Theme = {
  background: palette.white,
  text: palette.darkgray,
  link: palette.blue,
  border: '#00000088',
  highlighted: '#f5f5f5',
  disabled: '#888',
  overlay: '#ffffff88',
  error: 'red',
  tableColumnHeaderBg: '#ddd',
  tableRowHeaderBg: '#eee',
  tableCellBg: palette.white,
  tableText: palette.black,
};

const darkTheme: Theme = {
  background: palette.darkgray,
  text: palette.white,
  link: palette.lightblue,
  border: '#ffffff88',
  highlighted: '#353535',
  disabled: '#888',
  overlay: '#00000088',
  error: 'red',
  tableColumnHeaderBg: '#111',
  tableRowHeaderBg: '#333',
  tableCellBg: '#222',
  tableText: palette.white,
};

export const useAppColorScheme = () => {
  const colorScheme = useAppSelector(selectAppColorScheme);
  const systemColorScheme = useColorScheme();

  const appColorScheme = useMemo(
    () =>
      colorScheme === 'auto'
        ? systemColorScheme
          ? systemColorScheme
          : defaultColorScheme
        : colorScheme,
    [colorScheme, systemColorScheme],
  );

  return appColorScheme;
};

export const useTheme = () => {
  const colorScheme = useAppColorScheme();
  const palette = useMemo(
    () => (colorScheme === 'light' ? lightTheme : darkTheme),
    [colorScheme],
  );
  return palette;
};

export const useStyles = <T>(
  styles: (helpers: {theme: Theme}) => StyleSheet.NamedStyles<T>,
) => {
  const theme = useTheme();
  const computedStyles = useMemo(
    () => StyleSheet.create(styles({theme})),
    [theme],
  );
  return computedStyles;
};
