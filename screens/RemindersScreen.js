import React, { useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useTheme, Text, Card, Button, IconButton } from 'react-native-paper';
import { useNotes } from '../hooks/useNotes';
import { format } from 'date-fns';

const RemindersScreen = ({ navigation }) => {
  const theme = useTheme();
  const { colors, dark } = theme;
  const { reminders, notes, removeReminder, refreshNotes } = useNotes();

  // Обновляем данные при фокусе экрана
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', refreshNotes);
    return unsubscribe;
  }, [navigation]);

  // Оптимизированное объединение и сортировка напоминаний
  const sortedReminders = useMemo(() => {
    return reminders
      .map(reminder => {
        const note = notes.find(n => n.id === reminder.noteId);
        return {
          ...reminder,
          noteTitle: note?.title || 'Untitled Note',
          noteContent: note?.content || '',
          noteColor: dark ? '#2d2d2d' : '#ffffff'
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [reminders, notes, dark]);

  const handleRemoveReminder = useCallback(async (id) => {
    try {
      await removeReminder(id);
    } catch (error) {
      console.error('Failed to remove reminder:', error);
    }
  }, [removeReminder]);

  const handleOpenNote = useCallback((noteId) => {
    navigation.navigate('Notes', { 
      screen: 'NoteEditor',
      params: { noteId } 
    });
  }, [navigation]);

  // Динамические стили
  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    listContainer: {
      paddingBottom: 80,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
      color: colors.text,
    },
    createButton: {
      marginTop: 10,
      borderRadius: 8,
      backgroundColor: colors.primary,
    },
    card: {
      marginBottom: 16,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    timeText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.primary,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: colors.text,
    },
    content: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
      opacity: 0.8,
    },
    actions: {
      justifyContent: 'flex-end',
    },
  }), [colors]);

  const renderReminderItem = useCallback(({ item }) => (
    <Card style={[dynamicStyles.card, { backgroundColor: item.noteColor }]}>
      <Card.Content>
        <View style={dynamicStyles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton
              icon="bell"
              size={16}
              color={colors.primary}
              style={{ margin: 0, marginRight: 8 }}
            />
            <Text style={dynamicStyles.timeText}>
              {format(new Date(item.date), 'MMM d, yyyy - h:mm a')}
            </Text>
          </View>
          <IconButton
            icon="delete"  // Изменил иконку с "close" на "delete" для ясности
            size={20}
            onPress={() => handleRemoveReminder(item.id)}
            iconColor={colors.error}
          />
        </View>
        <Text 
          style={dynamicStyles.title}
          numberOfLines={1}
        >
          {item.noteTitle}
        </Text>
        <Text 
          numberOfLines={2} 
          style={dynamicStyles.content}
        >
          {item.noteContent}
        </Text>
      </Card.Content>
      <Card.Actions style={dynamicStyles.actions}>
        <Button 
          mode="text"
          onPress={() => handleOpenNote(item.noteId)}
          textColor={colors.primary}
          style={{ marginRight: 8 }}
        >
          Open Note
        </Button>
      </Card.Actions>
    </Card>
  ), [dynamicStyles, handleRemoveReminder, handleOpenNote, colors]);

  if (sortedReminders.length === 0) {
    return (
      <View style={dynamicStyles.emptyContainer}>
        <Text style={dynamicStyles.emptyText}>
        Пока никаких напоминаний...
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Notes')}
          style={dynamicStyles.createButton}
          labelStyle={{ color: colors.onPrimary }}
          icon="plus"
        >
          Создайте заметку с напоминанием
        </Button>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <FlatList
        data={sortedReminders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={dynamicStyles.listContainer}
        renderItem={renderReminderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default React.memo(RemindersScreen);