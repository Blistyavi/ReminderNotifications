import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = '@notes';
const REMINDERS_KEY = '@reminders';

export const saveNote = async (note) => {
  try {
    const existingNotes = await getNotes();
    const updatedNotes = existingNotes.filter(n => n.id !== note.id);
    updatedNotes.push(note);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    return note;
  } catch (e) {
    console.error('Failed to save note', e);
    throw e;
  }
};

export const getNotes = async () => {
  try {
    const notesJson = await AsyncStorage.getItem(NOTES_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (e) {
    console.error('Failed to get notes', e);
    return [];
  }
};

export const deleteNote = async (id) => {
  try {
    const existingNotes = await getNotes();
    const updatedNotes = existingNotes.filter(note => note.id !== id);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
  } catch (e) {
    console.error('Failed to delete note', e);
    throw e;
  }
};

export const saveReminder = async (reminder) => {
  try {
    const existingReminders = await getReminders();
    const updatedReminders = existingReminders.filter(r => r.id !== reminder.id);
    updatedReminders.push(reminder);
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(updatedReminders));
    return reminder;
  } catch (e) {
    console.error('Failed to save reminder', e);
    throw e;
  }
};

export const getReminders = async () => {
  try {
    const remindersJson = await AsyncStorage.getItem(REMINDERS_KEY);
    return remindersJson ? JSON.parse(remindersJson) : [];
  } catch (e) {
    console.error('Failed to get reminders', e);
    return [];
  }
};

export const deleteReminder = async (id) => {
  try {
    const existingReminders = await getReminders();
    const updatedReminders = existingReminders.filter(r => r.id !== id);
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(updatedReminders));
  } catch (e) {
    console.error('Failed to delete reminder', e);
    throw e;
  }
};