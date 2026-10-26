import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskItem } from '../models/TaskItem';
import { formatDate } from '../viewModels/taskFormHelpers';

type Props = {
  task: TaskItem;
  onPress: () => void;
  onToggleCompleted: () => void;
};

// one row in the list. the circle on the left checks the task off, and
// tapping the rest of the row opens it. done tasks get crossed out
export default function TaskRowView({ task, onPress, onToggleCompleted }: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Pressable onPress={onToggleCompleted} hitSlop={8} style={styles.checkboxTap}>
        <Ionicons
          name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={task.completed ? '#34C759' : '#007AFF'}
        />
      </Pressable>
      <View style={styles.text}>
        <Text style={[styles.name, task.completed && styles.strikethrough]}>{task.name}</Text>
        <Text style={styles.assignee}>Assigned to: {task.assignedTo}</Text>
      </View>
      <Text style={[styles.dueDate, task.completed && styles.strikethrough]}>
        {formatDate(task.dueDate)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  checkboxTap: { marginRight: 12 },
  text: { flex: 1 },
  name: { fontSize: 17, fontWeight: '500' },
  assignee: { fontSize: 14, color: '#666', marginTop: 2 },
  dueDate: { fontSize: 14, color: '#007AFF', marginLeft: 8 },
  strikethrough: { textDecorationLine: 'line-through', color: '#999' },
});
