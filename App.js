import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

// Импорты экранов
import HomeScreen from './screens/HomeScreen';
import NoteEditorScreen from './screens/NoteEditorScreen';
import SettingsScreen from './screens/SettingsScreen';
import RemindersScreen from './screens/RemindersScreen';

// Адаптация тем навигации
const { LightTheme: NavLightTheme, DarkTheme: NavDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: {
    dark: false,
    colors: {
      primary: '#6200ee',
      background: '#f6f6f6',
      card: '#ffffff',
      text: '#000000',
      border: '#e0e0e0',
      notification: '#f50057',
    },
  },
  reactNavigationDark: {
    dark: true,
    colors: {
      primary: '#bb86fc',
      background: '#121212',
      card: '#1e1e1e',
      text: '#ffffff',
      border: '#333333',
      notification: '#ff80ab',
    },
  },
});

// Полное определение тем
const AppLightTheme = {
  ...MD3LightTheme,
  ...NavLightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...NavLightTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
    surface: '#ffffff',
    onSurface: '#000000',
    primaryContainer: '#e0d7ff',
    secondaryContainer: '#f8f8f8',
    error: '#b00020',
    outline: '#e0e0e0',
  },
};

const AppDarkTheme = {
  ...MD3DarkTheme,
  ...NavDarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...NavDarkTheme.colors,
    primary: '#bb86fc',
    accent: '#03dac4',
    surface: '#1e1e1e',
    onSurface: '#ffffff',
    primaryContainer: '#3700b3',
    secondaryContainer: '#2d2d2d',
    error: '#cf6679',
    outline: '#333333',
  },
};

// Контекст темы
export const ThemeContext = React.createContext({
  toggleTheme: () => console.warn('ThemeProvider not found'),
  isDarkTheme: true, // По умолчанию true для темной темы
});

// Настройка уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function NotesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NoteEditor" component={NoteEditorScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  // По умолчанию включена темная тема
  const [isDarkTheme, setIsDarkTheme] = React.useState(true);
  const theme = isDarkTheme ? AppDarkTheme : AppLightTheme;

  const toggleTheme = React.useCallback(() => {
    setIsDarkTheme(prev => !prev);
  }, []);

  const themeContextValue = React.useMemo(() => ({
    toggleTheme,
    isDarkTheme,
  }), [toggleTheme, isDarkTheme]);

  // Fallback при ошибке темы
  if (!theme || !theme.colors || !theme.fonts) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <Text style={{ color: '#ffffff' }}>Application initialization error. Please restart the app.</Text>
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <PaperProvider theme={theme}>
        <NavigationContainer 
          theme={theme}
          fallback={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
              <ActivityIndicator size="large" color="#bb86fc" />
            </View>
          }
        >
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color }) => {
                const iconMap = {
                  Notes: focused ? 'note-text' : 'note-text-outline',
                  Reminders: focused ? 'bell' : 'bell-outline',
                  Settings: focused ? 'cog' : 'cog-outline',
                };
                return (
                  <MaterialCommunityIcons 
                    name={iconMap[route.name] || 'alert'} 
                    size={24}
                    color={color}
                  />
                );
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: theme.colors.onSurface,
              tabBarStyle: {
                backgroundColor: theme.colors.surface,
                borderTopWidth: 1,
                borderTopColor: theme.colors.outline,
                height: 60,
                paddingBottom: 8,
              },
              tabBarLabelStyle: {
                fontSize: 12,
                marginTop: -4,
              },
            })}
          >
            <Tab.Screen name="Notes" component={NotesStack} options={{ headerShown: false }} />
            <Tab.Screen name="Reminders" component={RemindersScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
}