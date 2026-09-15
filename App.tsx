import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import CardView from './views/CardView';
import DefinitionView from './views/DefinitionView';

const Stack = createNativeStackNavigator<RootStackParamList>();

type DefinitionProps = NativeStackScreenProps<RootStackParamList, 'Definition'>;

function DefinitionViewScreen({ route }: DefinitionProps) {
  return <DefinitionView definition={route.params.definition} />;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={CardView} options={{ title: 'RailsCards' }} />
        <Stack.Screen name="Definition" component={DefinitionViewScreen} options={{ title: 'Definition' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
