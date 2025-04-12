import * as Notifications from 'expo-notifications';

// Настройка обработки уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const scheduleNotification = async (reminder, noteTitle) => {
  const trigger = new Date(reminder.date);
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Напоминание',
      body: noteTitle,
      data: { reminderId: reminder.id },
    },
    trigger,
  });
};

export const cancelNotification = async (reminderId) => {
  await Notifications.cancelScheduledNotificationAsync(reminderId);
};

export const requestPermissions = async () => {
  return await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
};