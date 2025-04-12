import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, TextInput, Text } from 'react-native';
import { useTheme, Appbar, FAB } from 'react-native-paper';
import { useNotes } from '../hooks/useNotes';
import NoteCard from '../components/NoteCard';

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const { colors, dark } = useTheme();
  const { notes, isLoading } = useNotes();
  
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
      backgroundColor: dark ? '#424242' : '#f5f5f5', // Темно-серый в темной теме, светлый в светлой
      color: dark ? '#ffffff' : '#000000', // Белый текст в темной теме, черный в светлой
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
        <Appbar.Content title="My Notes" color={colors.text} />
        <Appbar.Action 
          icon="magnify" 
          onPress={() => {}} 
          color={colors.text}
        />
      </Appbar.Header>

      <TextInput
        style={dynamicStyles.searchInput}
        placeholder="Search notes..."
        placeholderTextColor={dark ? '#b0b0b0' : '#757575'} // Серый плейсхолдер
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {notes.length === 0 ? (
        <View style={dynamicStyles.emptyState}>
          <Text style={dynamicStyles.emptyText}>
            You don't have any notes yet.{'\n'}
            Tap the + button to create your first note!
          </Text>
        </View>
      ) : (
        <>
          {pinnedNotes.length > 0 && (
            <FlatList
              data={pinnedNotes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <NoteCard
                  note={{
                    ...item,
                    color: dark ? '#2d2d2d' : '#ffffff' // Темный фон в темной теме
                  }}
                  onPress={() => navigation.navigate('NoteEditor', { noteId: item.id })}
                />
              )}
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
            renderItem={({ item }) => (
              <NoteCard
                note={{
                  ...item,
                  color: dark ? '#2d2d2d' : '#ffffff' // Темный фон в темной теме
                }}
                onPress={() => navigation.navigate('NoteEditor', { noteId: item.id })}
              />
            )}
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