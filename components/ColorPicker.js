import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Button, useTheme } from 'react-native-paper';

const colors = [
  '#ffffff', '#f28b82', '#fbbc04', '#fff475', 
  '#ccff90', '#a7ffeb', '#cbf0f8', '#d7aefb', 
  '#fdcfe8', '#e6c9a8', '#e8eaed'
];

const ColorPicker = ({ visible, onDismiss, onColorSelect, selectedColor }) => {
  const { colors: themeColors } = useTheme();

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modal, 
          { backgroundColor: themeColors.surface }
        ]}
      >
        <View style={styles.colorsContainer}>
          {colors.map((color) => (
            <Button
              key={color}
              mode={selectedColor === color ? "contained" : "outlined"}
              style={[styles.colorButton, { backgroundColor: color }]}
              onPress={() => {
                onColorSelect(color);
                onDismiss();
              }}
            />
          ))}
        </View>
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
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  colorButton: {
    width: 40,
    height: 40,
    margin: 8,
    borderRadius: 20,
  },
});

export default ColorPicker;