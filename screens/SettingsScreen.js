import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Divider, useTheme, Switch, Text } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import { PreferencesContext } from '../context/PreferencesContext';

const SettingsScreen = () => {
  const theme = useTheme();
  const { colors } = theme;
  const preferencesContext = useContext(PreferencesContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Проверка разрешений при монтировании
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const { status } = await Notifications.getPermissionsAsync();
        setNotificationsEnabled(status === 'granted');
      } catch (error) {
        console.error('Permission check error:', error);
      }
    };

    checkPermissions();
  }, []);

  // Обработчик переключения уведомлений
  const handleNotificationToggle = async (newValue) => {
    try {
      if (newValue) {
        const { status } = await Notifications.requestPermissionsAsync();
        setNotificationsEnabled(status === 'granted');
        
        if (status !== 'granted') {
          alert('Notifications permission is required for reminders');
        }
      } else {
        setNotificationsEnabled(false);
      }
    } catch (error) {
      console.error('Notification toggle error:', error);
    }
  };

  const {
    toggleTheme = () => console.warn('Theme toggle not available'),
    isThemeDark = false
  } = preferencesContext || {};

  // Динамические стили
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    sectionHeader: {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 8,
      color: colors.onSurface,
    },
    listItem: {
      paddingVertical: 8,
    },
    listItemTitle: {
      fontSize: 16,
      color: colors.onSurface,
    },
    listItemDescription: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
    },
    divider: {
      marginVertical: 8,
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.outline,
    },
    errorText: {
      color: colors.error,
      textAlign: 'center',
      padding: 20,
    }
  });

  if (!preferencesContext) {
    return (
      <View style={dynamicStyles.container}>
        <Text style={dynamicStyles.errorText}>
          Theme configuration error. Please restart the app.
        </Text>
      </View>
    );
  }

  const SettingsSwitch = ({ value, onValueChange }) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      color={colors.primary}
      trackColor={{
        false: colors.surfaceVariant,
        true: colors.primaryContainer
      }}
    />
  );

  return (
    <View style={dynamicStyles.container}>
      <List.Section>
        <List.Subheader style={dynamicStyles.sectionHeader}>
          Appearance
        </List.Subheader>
        
        <List.Item
          title="Dark Theme"
          titleStyle={dynamicStyles.listItemTitle}
          description="Switch between light and dark mode"
          descriptionStyle={dynamicStyles.listItemDescription}
          style={dynamicStyles.listItem}
          right={() => (
            <SettingsSwitch 
              value={isThemeDark} 
              onValueChange={toggleTheme} 
            />
          )}
        />
        
        <Divider style={dynamicStyles.divider} />

        <List.Subheader style={dynamicStyles.sectionHeader}>
          Notifications
        </List.Subheader>
        
        <List.Item
          title="Enable Notifications"
          titleStyle={dynamicStyles.listItemTitle}
          description="Get reminders for your notes"
          descriptionStyle={dynamicStyles.listItemDescription}
          style={dynamicStyles.listItem}
          right={() => (
            <SettingsSwitch 
              value={notificationsEnabled} 
              onValueChange={handleNotificationToggle} 
            />
          )}
        />
        
        <Divider style={dynamicStyles.divider} />

        <List.Subheader style={dynamicStyles.sectionHeader}>
          About
        </List.Subheader>
        
        <List.Item
          title="App Version"
          titleStyle={dynamicStyles.listItemTitle}
          description="ReminderNotes v1.0"
          descriptionStyle={dynamicStyles.listItemDescription}
          style={dynamicStyles.listItem}
          left={() => (
            <List.Icon icon="information" color={colors.primary} />
          )}
        />
      </List.Section>
    </View>
  );
};

export default SettingsScreen;