import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme, IconButton } from 'react-native-paper';
import { format } from 'date-fns';

const NoteCard = ({ 
  note = {}, 
  onPress = () => {}, 
  onDelete = () => {}, 
  onTogglePin = () => {}
}) => {
  const theme = useTheme();
  const { colors, dark } = theme;

  // Проверка и нормализация данных заметки
  const normalizedNote = {
    title: note.title || 'Untitled Note',
    content: note.content || '',
    color: note.color || colors.surface,
    isPinned: !!note.isPinned,
    reminder: note.reminder ? new Date(note.reminder) : null
  };

  // Динамические стили
  const styles = StyleSheet.create({
    container: {
      margin: 8,
    },
    card: {
      elevation: 2,
      backgroundColor: normalizedNote.color,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    title: {
      flex: 1,
      fontSize: 16,
      fontWeight: 'bold',
      color: dark ? '#FFFFFF' : '#000000',
    },
    content: {
      fontSize: 14,
      color: dark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
      lineHeight: 20,
    },
    reminderContainer: {
      marginTop: 8,
      backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 12,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
    },
    reminderText: {
      fontSize: 12,
      color: colors.primary,
      marginLeft: 4,
    },
    actions: {
      justifyContent: 'flex-end',
      paddingHorizontal: 8,
      paddingBottom: 8,
    }
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Text 
                numberOfLines={2} 
                style={styles.title}
                ellipsizeMode="tail"
              >
                {normalizedNote.title}
              </Text>
              <IconButton
                icon={normalizedNote.isPinned ? 'pin' : 'pin-outline'}
                onPress={(e) => {
                  e.stopPropagation();
                  onTogglePin();
                }}
                size={20}
                color={colors.primary}
              />
            </View>
            
            <Text 
              numberOfLines={3} 
              style={styles.content}
              ellipsizeMode="tail"
            >
              {normalizedNote.content}
            </Text>
            
            {normalizedNote.reminder && (
              <View style={styles.reminderContainer}>
                <IconButton
                  icon="bell"
                  size={16}
                  color={colors.primary}
                  style={{ margin: 0 }}
                />
                <Text style={styles.reminderText}>
                  {format(normalizedNote.reminder, 'MMM d, yyyy - h:mm a')}
                </Text>
              </View>
            )}
          </Card.Content>
          
          <Card.Actions style={styles.actions}>
            <IconButton
              icon="delete"
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              size={20}
              color={colors.error}
            />
          </Card.Actions>
        </Card>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(NoteCard);