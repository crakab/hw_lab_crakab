import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTasks } from '../viewModels/TasksContext';
import { formatDate, makeDateChangeHandler, saveWithValidation } from '../viewModels/taskFormHelpers';
import type { RootTabParamList } from '../types';

type NavProp = BottomTabNavigationProp<RootTabParamList, 'NewTask'>;

// the new task tab. you fill in the name, who its assigned to and the due
// date, and saving adds it to firestore, clears the form and goes back to
// the tasks tab
export default function NewTaskView() {
  const { addTask } = useTasks();
  const navigation = useNavigation<NavProp>();

  const [name, setName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onDateChange = makeDateChangeHandler(setShowPicker, setDueDate);

  // when you hit save: check the fields, add the task, reset the form, then
  // switch to the tasks tab
  const onSave = () =>
    saveWithValidation(name, assignedTo, async () => {
      await addTask({ name, assignedTo, dueDate, dateAdded: new Date(), completed: false });
      setName(''); setAssignedTo(''); setDueDate(new Date());
    }, () => navigation.navigate('Tasks'));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Task Name</Text>
        <TextInput style={styles.input} placeholder="Enter task name" value={name} onChangeText={setName} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Assigned To</Text>
        <TextInput style={styles.input} placeholder="Enter assignee name" value={assignedTo} onChangeText={setAssignedTo} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Due Date</Text>
        <Pressable style={styles.dateButton} onPress={() => setShowPicker((s) => !s)}>
          <Text style={styles.dateText}>{formatDate(dueDate)}</Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
          />
        )}
      </View>

      <Pressable style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>Save Task</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  section: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, marginTop: 20 },
  label: { fontSize: 13, color: '#666', textTransform: 'uppercase', marginBottom: 8 },
  input: { fontSize: 17, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc' },
  dateButton: { paddingVertical: 12 },
  dateText: { fontSize: 17, color: '#007AFF' },
  saveButton: { margin: 16, backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
