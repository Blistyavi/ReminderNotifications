import React from 'react';
import { Appearance } from 'react-native';

export const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  isThemeDark: false,
});

export const PreferencesProvider = ({ children }) => {
  const [isThemeDark, setIsThemeDark] = React.useState(
    Appearance.getColorScheme() === 'dark'
  );

  const toggleTheme = React.useCallback(() => {
    setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  return (
    <PreferencesContext.Provider value={preferences}>
      {children}
    </PreferencesContext.Provider>
  );
};