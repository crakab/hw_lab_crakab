import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppView from './views/AppView';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppView />
    </GestureHandlerRootView>
  );
}
