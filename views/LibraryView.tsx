import React from 'react';
import { FlatList, Pressable, Text, View, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LibraryStackParamList } from '../types';
import type { Book } from '../models/Book';
import { useLibrary } from '../viewModels/LibraryContext';

type NavProp = NativeStackNavigationProp<LibraryStackParamList, 'LibraryList'>;

function BookRowView({ book }: { book: Book }) {
  const navigation = useNavigation<NavProp>();
  const { removeBook } = useLibrary();

  return (
    <Swipeable
      renderRightActions={() => (
        <Pressable style={styles.deleteAction} onPress={() => removeBook(book.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      )}
    >
      <Pressable onPress={() => navigation.navigate('BookDetails', { book })}>
        <Text style={styles.row}>{book.title}</Text>
      </Pressable>
    </Swipeable>
  );
}

export default function LibraryView() {
  const { books } = useLibrary();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Library</Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookRowView book={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  row: { fontSize: 16, fontWeight: 'bold', paddingVertical: 10 },
  deleteAction: { backgroundColor: 'red', justifyContent: 'center', paddingHorizontal: 20 },
  deleteText: { color: 'white', fontWeight: 'bold' },
});
