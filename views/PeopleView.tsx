import React, { useLayoutEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet, FlatList } from 'react-native';
// Note: the legacy `Swipeable` export was removed in react-native-gesture-handler 3,
// so we use its drop-in replacement, ReanimatedSwipeable.
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { usePeople, filterAndSort, SortOrder } from '../viewModels/PeopleContext';
import type { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'People'>;

/**
 * Spec: The "My Contacts" list screen. Shows every contact (filtered by the
 * header search bar and sorted A-Z or Z-A), lets the user tap a row to edit
 * that contact, swipe a row left to delete it, and use the header buttons to
 * change the sort order or add a new contact.
 */
export default function PeopleView() {
  const navigation = useNavigation<NavProp>();
  const { people, addPerson, deletePerson } = usePeople();
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  /**
   * Spec: Called by the "+" header button. Creates a blank contact in the
   * store and immediately opens its edit screen.
   */
  const handleAdd = () => {
    const person = addPerson();
    navigation.navigate('EditPerson', { personId: person.id });
  };

  /**
   * Spec: Called by the sort header button. Shows an alert with "Name (A-Z)",
   * "Name (Z-A)", and "Cancel" options and updates the sort order to match the
   * user's choice.
   */
  const handleSort = () => {
    Alert.alert('Sort', undefined, [
      { text: 'Name (A-Z)', onPress: () => setSortOrder('asc') },
      { text: 'Name (Z-A)', onPress: () => setSortOrder('desc') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Spec: Before the screen paints, configure the header with a native search
  // bar (which updates searchText as the user types) and the sort + add buttons.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search',
        onChangeText: (event: any) => setSearchText(event.nativeEvent.text),
      },
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable onPress={handleSort}>
            <Ionicons name="swap-vertical" size={22} color="#007AFF" />
          </Pressable>
          <Pressable onPress={handleAdd}>
            <Ionicons name="add" size={26} color="#007AFF" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  // Spec: The list actually shown on screen -- recomputed only when the people,
  // the search text, or the sort order changes.
  const displayedPeople = useMemo(
    () => filterAndSort(people, searchText, sortOrder),
    [people, searchText, sortOrder]
  );

  return (
    <FlatList
      data={displayedPeople}
      keyExtractor={(item) => item.id}
      contentInsetAdjustmentBehavior="automatic"
      renderItem={({ item }) => (
        <Swipeable
          renderRightActions={() => (
            <Pressable style={styles.deleteAction} onPress={() => deletePerson(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          )}
        >
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate('EditPerson', { personId: item.id })}
          >
            <Text style={styles.name}>{item.name || 'New Contact'}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </Pressable>
        </Swipeable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  name: { fontSize: 17 },
  deleteAction: { backgroundColor: 'red', justifyContent: 'center', paddingHorizontal: 20 },
  deleteText: { color: 'white', fontWeight: 'bold' },
});
