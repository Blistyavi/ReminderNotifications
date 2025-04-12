import { useState, useEffect } from 'react';
import { getNotes, saveNote, deleteNote, getReminders, saveReminder, deleteReminder } from '../utils/storage';
import { scheduleNotification, cancelNotification } from '../utils/notifications';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const loadedNotes = await getNotes();
      const loadedReminders = await getReminders();
      setNotes(loadedNotes);
      setReminders(loadedReminders);
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Загружаем данные при первом рендере
  useEffect(() => {
    loadData();
  }, []);

  const addNote = async (note) => {
    const newNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
    };
    await saveNote(newNote);
    await loadData(); // Обновляем данные после добавления
    return newNote;
  };

  const updateNote = async (note) => {
    const updatedNote = {
      ...note,
      updatedAt: new Date(),
    };
    await saveNote(updatedNote);
    await loadData(); // Обновляем данные после изменения
    return updatedNote;
  };

  const removeNote = async (id) => {
    await deleteNote(id);
    await loadData(); // Обновляем данные после удаления
  };

  const addReminder = async (noteId, date) => {
    const reminder = {
      id: Date.now().toString(),
      noteId,
      date,
      isCompleted: false,
    };
    await saveReminder(reminder);
    
    const note = notes.find(n => n.id === noteId);
    if (note) {
      await scheduleNotification(reminder, note.title);
    }
    
    await loadData();
    return reminder;
  };

  const removeReminder = async (id) => {
    await cancelNotification(id);
    await deleteReminder(id);
    await loadData();
  };

  return {
    notes,
    reminders,
    isLoading,
    addNote,
    updateNote,
    removeNote,
    addReminder,
    removeReminder,
    refreshNotes: loadData, // Добавляем функцию refreshNotes
  };
};