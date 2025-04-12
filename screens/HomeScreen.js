import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, TextInput, Text } from 'react-native';
import { useTheme, Appbar, FAB } from 'react-native-paper';
import { useNotes } from '../hooks/useNotes';
import NoteCard from '../components/NoteCard';

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const { colors, dark } = theme;
  const { notes, isLoading, addNote, updateNote, removeNote, removeReminder } = useNotes();
  
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация и разделение заметок
  const { pinnedNotes, otherNotes } = useMemo(() => {
    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return {
      pinnedNotes: filtered.filter(note => note.isPinned),
      otherNotes: filtered.filter(note => !note.isPinned)
    };
  }, [notes, searchQuery]);

  const handleDeleteNote = async (id) => {
    try {
      const noteToDelete = notes.find(n => n.id === id);
      if (noteToDelete?.reminder) {
        await removeReminder(noteToDelete.reminder.id);
      }
      await removeNote(id);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleTogglePin = async (note) => {
    try {
      await updateNote({
        ...note,
        isPinned: !note.isPinned,
      });
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  // Динамические стили
  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchInput: {
      margin: 16,
      padding: 12,
      borderRadius: 8,
      fontSize: 16,
      backgroundColor: dark ? '#424242' : '#f5f5f5',
      color: dark ? '#ffffff' : '#000000',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    sectionHeader: {
      padding: 16,
      paddingBottom: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary,
    },
    fab: {
      position: 'absolute',
      margin: 24,
      right: 0,
      bottom: 0,
      borderRadius: 28,
      backgroundColor: colors.primary,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
      color: colors.text,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
  }), [colors, dark]);

  const renderNoteItem = ({ item }) => (
    <NoteCard
      note={{
        ...item,
        color: dark ? '#2d2d2d' : '#ffffff'
      }}
      onPress={() => navigation.navigate('NoteEditor', { noteId: item.id })}
      onDelete={() => handleDeleteNote(item.id)}
      onTogglePin={() => handleTogglePin(item)}
    />
  );

  if (isLoading) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <Text style={{ color: colors.text }}>Loading your notes...</Text>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.Content title="Мои заметки" color={colors.text} />
        <Appbar.Action 
          icon="magnify" 
          onPress={() => {}} 
          color={colors.text}
        />
      </Appbar.Header>

      <TextInput
        style={dynamicStyles.searchInput}
        placeholder="Поиск заметок..."
        placeholderTextColor={dark ? '#b0b0b0' : '#757575'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {notes.length === 0 ? (
        <View style={dynamicStyles.emptyState}>
          <Text style={dynamicStyles.emptyText}>
          У вас еще нет заметок.{'\n'}
          Нажмите на кнопку +, чтобы создать свою первую заметку!
          </Text>
        </View>
      ) : (
        <>
          {pinnedNotes.length > 0 && (
            <FlatList
              data={pinnedNotes}
              keyExtractor={(item) => item.id}
              renderItem={renderNoteItem}
              ListHeaderComponent={
                <View style={dynamicStyles.sectionHeader}>
                  <Text style={dynamicStyles.sectionTitle}>Pinned Notes</Text>
                </View>
              }
            />
          )}

          <FlatList
            data={otherNotes}
            keyExtractor={(item) => item.id}
            renderItem={renderNoteItem}
            ListHeaderComponent={
              otherNotes.length > 0 && (
                <View style={dynamicStyles.sectionHeader}>
                  <Text style={dynamicStyles.sectionTitle}>All Notes</Text>
                </View>
              )
            }
          />
        </>
      )}

      <FAB
        style={dynamicStyles.fab}
        icon="plus"
        color={colors.onPrimary}
        onPress={() => navigation.navigate('NoteEditor', { noteId: null })}
      />
    </View>
  );
};

export default HomeScreen;