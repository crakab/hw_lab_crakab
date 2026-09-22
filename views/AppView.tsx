import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import LibraryView from './LibraryView';
import BookDetailsView from './BookDetailsView';
import NewBookView from './NewBookView';
import ChartsView from './ChartsView';
import { LibraryProvider } from '../viewModels/LibraryContext';
import type { LibraryStackParamList } from '../types';

const Tab = createBottomTabNavigator();
const LibraryStack = createNativeStackNavigator<LibraryStackParamList>();

function LibraryStackScreen() {
  return (
    <LibraryStack.Navigator>
      <LibraryStack.Screen
        name="LibraryList"
        component={LibraryView}
        options={{ headerShown: false }}
      />
      <LibraryStack.Screen
        name="BookDetails"
        component={BookDetailsView}
        options={{ title: 'Book Details' }}
      />
    </LibraryStack.Navigator>
  );
}

export default function AppView() {
  return (
    <LibraryProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
            tabBarIcon: ({ color, size }) => {
              let icon: keyof typeof Ionicons.glyphMap = 'library-sharp';
              if (route.name === 'Library') icon = 'library-sharp';
              else if (route.name === 'New Book') icon = 'book-outline';
              else if (route.name === 'Charts') icon = 'bar-chart';
              return <Ionicons name={icon} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Library" component={LibraryStackScreen} />
          <Tab.Screen name="New Book" component={NewBookView} />
          <Tab.Screen name="Charts" component={ChartsView} />
        </Tab.Navigator>
      </NavigationContainer>
    </LibraryProvider>
  );
}
