import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Divider, useTheme, Switch, Text } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import { usePreferences } from '../context/PreferencesContext';

const SettingsScreen = () => {
  const theme = useTheme();
  const { colors } = theme;
  const { toggleTheme, isThemeDark } = usePreferences();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Проверка разрешений для уведомлений
  useEffect(() => {
    let isMounted = true;

    const checkPermissions = async () => {
      try {
        const { status } = await Notifications.getPermissionsAsync();
        if (isMounted) {
          setNotificationsEnabled(status === 'granted');
        }
      } catch (error) {
        console.error('Permission check error:', error);
      }
    };

    checkPermissions();

    return () => {
      isMounted = false;
    };
  }, []);

  // Обработчик уведомлений
  const handleNotificationToggle = async (newValue) => {
    try {
      if (newValue) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Для работы напоминаний необходимо разрешение на уведомления');
        }
        setNotificationsEnabled(status === 'granted');
      } else {
        setNotificationsEnabled(false);
      }
    } catch (error) {
      console.error('Notification toggle error:', error);
    }
  };

  // Динамические стили
  const styles = StyleSheet.create({
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
      paddingVertical: 12,
    },
    listItemTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.onSurface,
    },
    listItemDescription: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
    divider: {
      marginVertical: 8,
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.outline,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      color: colors.error,
      textAlign: 'center',
      fontSize: 16,
    }
  });

  return (
    <View style={styles.container}>
      <List.Section>
        {/* Appearance Section */}
        <List.Subheader style={styles.sectionHeader}>
          Внешний вид
        </List.Subheader>
        
        <List.Item
          title="Темная тема"
          titleStyle={styles.listItemTitle}
          description="Переключение между светлой и темной темой"
          descriptionStyle={styles.listItemDescription}
          style={styles.listItem}
          left={() => (
            <List.Icon 
              icon={isThemeDark ? 'weather-night' : 'weather-sunny'} 
              color={colors.primary} 
            />
          )}
          right={() => (
            <Switch 
              value={isThemeDark}
              onValueChange={toggleTheme}
              color={colors.primary}
              trackColor={{
                true: colors.primaryContainer,
                false: colors.surfaceVariant
              }}
            />
          )}
        />
        
        <Divider style={styles.divider} />

        {/* Notifications Section */}
        <List.Subheader style={styles.sectionHeader}>
          Уведомления
        </List.Subheader>
        
        <List.Item
          title="Разрешить уведомления"
          titleStyle={styles.listItemTitle}
          description="Получать напоминания для заметок"
          descriptionStyle={styles.listItemDescription}
          style={styles.listItem}
          left={() => (
            <List.Icon 
              icon={notificationsEnabled ? 'bell' : 'bell-off'} 
              color={colors.primary} 
            />
          )}
          right={() => (
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              color={colors.primary}
              trackColor={{
                true: colors.primaryContainer,
                false: colors.surfaceVariant
              }}
            />
          )}
        />
        
        <Divider style={styles.divider} />

        {/* About Section */}
        <List.Subheader style={styles.sectionHeader}>
          О приложении
        </List.Subheader>
        
        <List.Item
          title="Версия приложения"
          titleStyle={styles.listItemTitle}
          description="ReminderNotes v1.0.0"
          descriptionStyle={styles.listItemDescription}
          style={styles.listItem}
          left={() => (
            <List.Icon icon="information" color={colors.primary} />
          )}
        />
      </List.Section>
    </View>
  );
};

export default SettingsScreen;