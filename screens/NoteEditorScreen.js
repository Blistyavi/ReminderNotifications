import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useTheme, TextInput, Button, IconButton, Snackbar } from 'react-native-paper';
import { useNotes } from '../hooks/useNotes';
import ColorPicker from '../components/ColorPicker';
import ReminderModal from '../components/ReminderModal';
import { format } from 'date-fns';

const NoteEditorScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { colors, dark } = theme;
  const { noteId } = route.params;
  const { notes, addNote, updateNote, addReminder, removeReminder } = useNotes();
  
  const [noteData, setNoteData] = useState({
    title: '',
    content: '',
    textColor: dark ? '#FFFFFF' : '#000000', // Цвет текста по умолчанию
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [currentReminder, setCurrentReminder] = useState(null);

  // Загрузка данных заметки
  useEffect(() => {
    if (noteId) {
      const existingNote = notes.find(n => n.id === noteId);
      if (existingNote) {
        setNoteData({
          title: existingNote.title,
          content: existingNote.content,
          textColor: existingNote.textColor || (dark ? '#FFFFFF' : '#000000'),
        });
        setCurrentReminder(existingNote.reminder || null);
      }
    }
  }, [noteId, notes, dark]);

  const showSnackbar = useCallback((message) => {
    setSnackbar({ visible: true, message });
    const timer = setTimeout(() => setSnackbar(prev => ({ ...prev, visible: false })), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const updatedNote = {
        ...noteData,
        reminder: currentReminder,
        updatedAt: new Date(),
      };

      if (noteId) {
        const existingNote = notes.find(n => n.id === noteId);
        await updateNote({ ...existingNote, ...updatedNote });
        showSnackbar('Note updated!');
      } else {
        await addNote(updatedNote);
        showSnackbar('Note created!');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Save error:', error);
      showSnackbar('Error saving note');
    }
  }, [noteData, currentReminder, noteId, notes]);

  const handleSetReminder = useCallback(async (date) => {
    try {
      if (currentReminder) {
        await removeReminder(currentReminder.id);
      }

      const newReminder = {
        id: Date.now().toString(),
        noteId: noteId || (await addNote({ ...noteData, reminder: null })).id,
        date,
        isCompleted: false,
      };

      await addReminder(newReminder);
      setCurrentReminder(newReminder);
      showSnackbar('Reminder set!');
      setShowReminderModal(false);
    } catch (error) {
      console.error('Reminder error:', error);
      showSnackbar('Error setting reminder');
    }
  }, [currentReminder, noteData, noteId]);

  const handleRemoveReminder = useCallback(async () => {
    if (!currentReminder) return;
    
    try {
      await removeReminder(currentReminder.id);
      setCurrentReminder(null);
      showSnackbar('Reminder removed');
    } catch (error) {
      console.error('Remove reminder error:', error);
      showSnackbar('Error removing reminder');
    }
  }, [currentReminder]);

  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: dark ? '#121212' : '#f5f5f5', // Темный фон в темной теме
      paddingTop: StatusBar.currentHeight, // Учет статус бара
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      paddingTop: 8,
      backgroundColor: dark ? '#1E1E1E' : '#FFFFFF',
    },
    saveButton: {
      marginRight: 8,
      backgroundColor: colors.primary,
    },
    content: {
      padding: 16,
      flexGrow: 1,
    },
    input: {
      marginBottom: 16,
      backgroundColor: dark ? '#2D2D2D' : '#FFFFFF',
    },
    inputText: {
      color: noteData.textColor, // Динамический цвет текста
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      paddingBottom: 24, // Дополнительный отступ снизу
      borderTopWidth: 1,
      borderTopColor: dark ? '#333333' : '#e0e0e0',
      backgroundColor: dark ? '#1E1E1E' : '#FFFFFF',
    },
    reminderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    reminderText: {
      marginHorizontal: 8,
      fontSize: 14,
      color: colors.text,
    },
  }), [noteData.textColor, colors, dark]);

  return (
    <View style={dynamicStyles.container}>
      {/* Шапка с кнопками */}
      <View style={dynamicStyles.header}>
        <IconButton
          icon="arrow-left"
          onPress={navigation.goBack}
          iconColor={colors.text}
          size={24}
        />
        <Button 
          mode="contained" 
          onPress={handleSave}
          style={dynamicStyles.saveButton}
          labelStyle={{ color: colors.onPrimary }}
        >
          Сохранить
        </Button>
      </View>

      {/* Основное содержимое */}
      <ScrollView contentContainerStyle={dynamicStyles.content}>
        <TextInput
          label="Название"
          value={noteData.title}
          onChangeText={(text) => setNoteData(prev => ({ ...prev, title: text }))}
          style={dynamicStyles.input}
          textColor={noteData.textColor} // Применяем цвет текста
          mode="outlined"
          outlineColor={colors.primary}
          activeOutlineColor={colors.primary}
          theme={{
            colors: {
              text: noteData.textColor, // Цвет текста
              placeholder: dark ? '#B0B0B0' : '#757575', // Цвет плейсхолдера
            }
          }}
        />
        
        <TextInput
          label="Содержание"
          value={noteData.content}
          onChangeText={(text) => setNoteData(prev => ({ ...prev, content: text }))}
          multiline
          style={[dynamicStyles.input, { minHeight: 200 }]}
          textColor={noteData.textColor} // Применяем цвет текста
          mode="outlined"
          outlineColor={colors.primary}
          activeOutlineColor={colors.primary}
          scrollEnabled={false}
          theme={{
            colors: {
              text: noteData.textColor, // Цвет текста
              placeholder: dark ? '#B0B0B0' : '#757575', // Цвет плейсхолдера
            }
          }}
        />
      </ScrollView>

      {/* Нижняя панель */}
      <View style={dynamicStyles.footer}>
        <IconButton
          icon="palette"
          onPress={() => setShowColorPicker(true)}
          iconColor={colors.primary}
          size={24}
        />
        
        <View style={dynamicStyles.reminderContainer}>
          <IconButton
            icon={currentReminder ? "bell" : "bell-outline"}
            onPress={() => setShowReminderModal(true)}
            iconColor={colors.primary}
            size={24}
          />
          
          {currentReminder && (
            <>
              <Text style={dynamicStyles.reminderText}>
                {format(new Date(currentReminder.date), 'MMM d, yyyy - h:mm a')}
              </Text>
              <IconButton
                icon="close"
                onPress={handleRemoveReminder}
                iconColor={colors.error}
                size={20}
              />
            </>
          )}
        </View>
      </View>

      {/* Модальные окна */}
      <ColorPicker
        visible={showColorPicker}
        onDismiss={() => setShowColorPicker(false)}
        onColorSelect={(color) => setNoteData(prev => ({ ...prev, textColor: color }))}
        selectedColor={noteData.textColor}
      />

      <ReminderModal
        visible={showReminderModal}
        onDismiss={() => setShowReminderModal(false)}
        onSetReminder={handleSetReminder}
        initialDate={currentReminder?.date || new Date(Date.now() + 3600000)}
      />

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar(prev => ({ ...prev, visible: false }))}
        duration={2000}
        style={{ backgroundColor: colors.surface }}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
};

export default NoteEditorScreen;