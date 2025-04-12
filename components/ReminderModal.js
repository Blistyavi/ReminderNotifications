import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Modal, Portal, Button, Text, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNotes } from '../hooks/useNotes';

const ReminderModal = ({ visible, onDismiss, noteId }) => {
  const { colors } = useTheme();
  const { notes, addReminder, removeReminder } = useNotes();
  
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const note = notes.find(n => n.id === noteId);
  const hasReminder = note?.reminder;

  const handleSetReminder = async () => {
    try {
      if (hasReminder) {
        await removeReminder(note.reminder.id);
      } else {
        await addReminder(noteId, date);
      }
      onDismiss();
    } catch (error) {
      console.error('Failed to set reminder', error);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      if (Platform.OS === 'android') {
        setShowTimePicker(true);
      }
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modal, 
          { backgroundColor: colors.surface }
        ]}
      >
        <Text style={styles.title}>
          {hasReminder ? 'Edit Reminder' : 'Set Reminder'}
        </Text>
        
        <View style={styles.datetimeContainer}>
          <Button 
            mode="outlined" 
            onPress={() => setShowDatePicker(true)}
            style={styles.button}
          >
            {date.toLocaleDateString()}
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => setShowTimePicker(true)}
            style={styles.button}
          >
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Button>
        </View>

        <Button 
          mode="contained" 
          onPress={handleSetReminder}
          style={styles.actionButton}
        >
          {hasReminder ? 'Remove Reminder' : 'Set Reminder'}
        </Button>

        {(showDatePicker || Platform.OS === 'ios') && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}

        {(showTimePicker || Platform.OS === 'ios') && (
          <DateTimePicker
            value={date}
            mode="time"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onChangeTime}
          />
        )}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  datetimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionButton: {
    marginTop: 10,
  },
});

export default ReminderModal;