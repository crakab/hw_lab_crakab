import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Repository } from '../models/Repository';

type Props = {
  repo: Repository;
  onPress: () => void;
};

export default function RepositoryRow({ repo, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Text style={styles.name}>{repo.name}</Text>
      {repo.description && (
        <Text style={styles.description} numberOfLines={2}>
          {repo.description}
        </Text>
      )}
      <View style={styles.starRow}>
        <Ionicons name="star" size={12} color="#e0b000" />
        <Text style={styles.stars}>{repo.stargazers_count.toLocaleString()}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  name: { fontSize: 17, fontWeight: '600' },
  description: { fontSize: 14, color: '#555', marginTop: 4 },
  starRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  stars: { fontSize: 12, color: '#555', marginLeft: 4 },
});
