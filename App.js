import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
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

// Импорт контекста
import { PreferencesProvider, usePreferences } from './context/PreferencesContext';

// Адаптация тем навигации
const { LightTheme: NavLightTheme, DarkTheme: NavDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: {
    dark: false,
    colors: {
      primary: '#6750A4',
      background: '#FEF7FF',
      card: '#FFFBFE',
      text: '#1C1B1F',
      border: '#79747E',
      notification: '#B3261E',
    },
  },
  reactNavigationDark: {
    dark: true,
    colors: {
      primary: '#D0BCFF',
      background: '#141218',
      card: '#1D1B20',
      text: '#E6E1E5',
      border: '#938F99',
      notification: '#F2B8B5',
    },
  },
});

// Определение тем приложения
const AppLightTheme = {
  ...MD3LightTheme,
  ...NavLightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...NavLightTheme.colors,
    primary: '#6750A4',
    accent: '#E8DEF8',
    surface: '#FFFBFE',
    onSurface: '#1C1B1F',
    primaryContainer: '#EADDFF',
    secondaryContainer: '#E8DEF8',
    error: '#B3261E',
    outline: '#79747E',
  },
};

const AppDarkTheme = {
  ...MD3DarkTheme,
  ...NavDarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...NavDarkTheme.colors,
    primary: '#D0BCFF',
    accent: '#E8DEF8',
    surface: '#1D1B20',
    onSurface: '#E6E1E5',
    primaryContainer: '#4F378B',
    secondaryContainer: '#4A4458',
    error: '#F2B8B5',
    outline: '#938F99',
  },
};

// Настройка обработчика уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Создание навигаторов
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

function MainApp() {
  const { isThemeDark, isLoading } = usePreferences();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setAppIsReady(true);
    }
  }, [isLoading]);

  if (!appIsReady || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const theme = isThemeDark ? AppDarkTheme : AppLightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer 
        theme={theme}
        fallback={
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: theme.colors.background 
          }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        }
      >
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              switch (route.name) {
                case 'Notes':
                  iconName = focused ? 'note-text' : 'note-text-outline';
                  break;
                case 'Reminders':
                  iconName = focused ? 'bell' : 'bell-outline';
                  break;
                case 'Settings':
                  iconName = focused ? 'cog' : 'cog-outline';
                  break;
                default:
                  iconName = 'help-circle';
              }
              return (
                <MaterialCommunityIcons 
                  name={iconName} 
                  size={size}
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
          <Tab.Screen 
            name="Notes" 
            component={NotesStack} 
            options={{ headerShown: false }} 
          />
          <Tab.Screen 
            name="Reminders" 
            component={RemindersScreen} 
            options={{ headerShown: false }} 
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ headerShown: false }} 
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <MainApp />
    </PreferencesProvider>
  );
}