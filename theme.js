import { DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

// Базовые темы с полным набором обязательных свойств
const BaseLightTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
    surface: '#ffffff',
    text: '#000000',
    onSurface: '#000000',
    card: '#ffffff',
    border: '#e0e0e0',
    notification: '#f50057',
    primaryContainer: '#e0d7ff',
    secondaryContainer: '#f8f8f8',
    error: '#b00020',
    placeholder: '#9e9e9e',
    backdrop: '#f5f5f5',
  },
  fonts: {
    ...PaperDefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
  },
  roundness: 4,
  animation: {
    scale: 1.0,
  },
};

const BaseDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    primary: '#bb86fc',
    accent: '#03dac4',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    onSurface: '#ffffff',
    card: '#1e1e1e',
    border: '#333333',
    notification: '#ff80ab',
    primaryContainer: '#3700b3',
    secondaryContainer: '#2d2d2d',
    error: '#cf6679',
    placeholder: '#a0a0a0',
    backdrop: '#000000',
  },
  fonts: {
    ...PaperDarkTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
  },
  roundness: 4,
  animation: {
    scale: 1.0,
  },
};

// Проверка инициализации тем
const validateTheme = (theme) => {
  if (!theme || !theme.colors || !theme.fonts) {
    console.error('Invalid theme structure:', theme);
    throw new Error('Theme initialization failed');
  }
  return theme;
};

// Экспортируем проверенные темы
export const LightTheme = validateTheme(BaseLightTheme);
export const DarkTheme = validateTheme(BaseDarkTheme);