import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCardViewModel } from '../viewModels/useCardViewModel';
import { RootStackParamList } from '../types';
import { styles } from '../styles';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function CardView() {
  const { flashcard, drawNewCard } = useCardViewModel();
  const navigation = useNavigation<NavProp>();

  useFocusEffect(
    useCallback(() => {
      drawNewCard();
    }, [])
  );

  return (
    <View style={styles.screen}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Definition', { definition: flashcard.definition })}
      >
        <Text style={styles.cardText}>{flashcard.command}</Text>
      </TouchableOpacity>
    </View>
  );
}
