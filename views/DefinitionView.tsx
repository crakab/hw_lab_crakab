import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

type Props = {
  definition: string;
};

export default function DefinitionView({ definition }: Props) {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.cardText}>{definition}</Text>
      </View>
    </View>
  );
}
