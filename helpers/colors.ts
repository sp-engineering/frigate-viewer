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
  | 'disabled';

type ColorScheme = Record<ColorName, string>;

export const palette = {
  white: 'white',
  black: 'black',
  darkgray: '#222',
  blue: 'blue',
  lightblue: 'lightblue',
};

const lightColorScheme: ColorScheme = {
  background: palette.white,
  text: palette.darkgray,
  link: palette.blue,
  border: '#00000088',
  highlighted: '#f5f5f5',
  disabled: '#888',
};

const darkColorScheme: ColorScheme = {
  background: palette.darkgray,
  text: palette.white,
  link: palette.lightblue,
  border: '#ffffff88',
  highlighted: '#353535',
  disabled: '#888',
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

export const usePalette = () => {
  const colorScheme = useAppColorScheme();
  const palette = useMemo(
    () => (colorScheme === 'light' ? lightColorScheme : darkColorScheme),
    [colorScheme],
  );
  return palette;
};

export const useStyles = <T>(
  styles: (helpers: {colorScheme: ColorScheme}) => StyleSheet.NamedStyles<T>,
) => {
  const colorScheme = usePalette();
  const computedStyles = useMemo(
    () => StyleSheet.create(styles({colorScheme})),
    [colorScheme],
  );
  return computedStyles;
};
