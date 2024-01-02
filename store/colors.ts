import { Appearance, useColorScheme } from 'react-native';

type Colors = {
  text: string;
  textAccent: string;
  background: string;
  backgroundAccent: string;
  dark: boolean;
}

export const lightModeColors: Colors = {
  text: '#222',
  textAccent: '#444',
  background: '#fff',
  backgroundAccent: '#f5f5f5',
  dark: false,
}

export const darkModeColors: Colors = {
  text: '#fff',
  textAccent: '#ccc',
  background: '#222',
  backgroundAccent: '#f5f5f5',
  dark: true,
}

const isDark = Appearance.getColorScheme() === 'dark'

function useColors() {
  const colorTheme = useColorScheme();

  return colorTheme === 'dark' ? darkModeColors : lightModeColors;
}

// will always be the color theme from when file was first initialized
export const colors = isDark ? darkModeColors : lightModeColors;
