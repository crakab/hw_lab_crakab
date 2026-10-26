import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTasks } from '../viewModels/TasksContext';
import TaskRowView from './TaskRowView';
import type { TasksStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<TasksStackParamList, 'TasksList'>;

// main screen of the tasks tab. shows a spinner while it loads, a "no tasks
// yet" message if its empty, and otherwise the list of tasks. tapping a task
// opens its details
export default function TasksView() {
  const { tasks, loading, toggleCompleted } = useTasks();
  const navigation = useNavigation<NavProp>();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>No tasks yet</Text>
        <Text style={styles.emptySubtitle}>Head to the New Task tab to create one</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      // firestore ids are unique so theyre good keys
      keyExtractor={(item) => item.id!}
      // makes a row for each task
      renderItem={({ item }) => (
        <TaskRowView
          task={item}
          onPress={() => navigation.navigate('TaskDetails', { taskId: item.id! })}
          onToggleCompleted={() => toggleCompleted(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#666', marginBottom: 8 },
  emptySubtitle: { fontSize: 16, color: '#999', textAlign: 'center' },
});
