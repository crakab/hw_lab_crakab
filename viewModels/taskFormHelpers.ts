import { Alert, Platform } from 'react-native';
import { isValidTask } from '../models/TaskItem';

// shows a date like "January 15, 2026"
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

// makes the onChange function for the date picker so both forms can share it.
// it closes the picker on android, keeps it open on ios, and passes the new
// date to onPick
export function makeDateChangeHandler(
  setShowPicker: (show: boolean) => void,
  onPick: (date: Date) => void,
) {
  // the picker calls this when the date changes. selected is undefined if
  // the user cancels
  return (_event: unknown, selected?: Date) => {
    // android closes by itself, ios stays open until we close it
    setShowPicker(Platform.OS === 'ios');
    if (selected) onPick(selected);
  };
}

// checks the fields first, then saves, then calls onDone. if a field is
// empty it shows an alert and stops, and if saving fails it shows an error
export async function saveWithValidation(
  name: string,
  assignedTo: string,
  save: () => Promise<void>,
  onDone: () => void,
) {
  if (!isValidTask(name, assignedTo)) {
    Alert.alert('Validation Error', 'Please fill in both name and assignee.');
    return;
  }
  try {
    await save();
    onDone();
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to save task.');
  }
}

// pops up an "are you sure" alert. if they hit delete it deletes the task
// and calls onDone, cancel just closes the alert
export function confirmDelete(
  performDelete: () => Promise<void>,
  onDone: () => void,
) {
  Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      // only runs if they actually tap delete
      onPress: async () => {
        try {
          await performDelete();
          onDone();
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to delete task.');
        }
      },
    },
  ]);
}
