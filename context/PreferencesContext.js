import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PreferencesContext = createContext(null);

export const PreferencesProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [isThemeDark, setIsThemeDark] = useState(() => systemTheme === 'dark');
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка сохраненной темы при монтировании
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme !== null) {
          setIsThemeDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, [systemTheme]);

  // Переключение темы с сохранением
  const toggleTheme = useCallback(async () => {
    const newTheme = !isThemeDark;
    setIsThemeDark(newTheme);
    try {
      await AsyncStorage.setItem('themePreference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  }, [isThemeDark]);

  // Мемоизация значений предпочтений
  const preferences = useMemo(() => ({
    toggleTheme,
    isThemeDark,
    isLoading,
  }), [toggleTheme, isThemeDark, isLoading]);

  if (isLoading) {
    return null; // или индикатор загрузки
  }

  return (
    <PreferencesContext.Provider value={preferences}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = React.useContext(PreferencesContext);
  if (context === null) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
};