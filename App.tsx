import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TasksProvider } from './viewModels/TasksContext';
import TasksView from './views/TasksView';
import NewTaskView from './views/NewTaskView';
import TaskDetailsView from './views/TaskDetailsView';
import type { TasksStackParamList, RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const TasksStack = createNativeStackNavigator<TasksStackParamList>();

// the stack inside the tasks tab: the task list, and you can push the task
// details screen on top of it
function TasksStackScreen() {
  return (
    <TasksStack.Navigator>
      <TasksStack.Screen name="TasksList" component={TasksView} options={{ title: 'Arbeit' }} />
      <TasksStack.Screen name="TaskDetails" component={TaskDetailsView} options={{ title: 'Task Details' }} />
    </TasksStack.Navigator>
  );
}

// the main app. TasksProvider wraps everything so every screen shares the
// same tasks, and then theres a bottom tab bar with tasks and new task
export default function App() {
  return (
    <TasksProvider>
      <NavigationContainer>
        <Tab.Navigator
          // options for each tab. hides the tab header since the tasks stack
          // has its own, and picks the icon
          screenOptions={({ route }) => ({
            headerShown: false,
            // draws the tab icon
            tabBarIcon: ({ color, size }) => {
              const icon = route.name === 'Tasks' ? 'checkmark-done-circle' : 'add-circle';
              return <Ionicons name={icon} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Tasks" component={TasksStackScreen} />
          <Tab.Screen name="NewTask" component={NewTaskView} options={{ title: 'New Task', headerShown: true }} />
        </Tab.Navigator>
      </NavigationContainer>
    </TasksProvider>
  );
}
