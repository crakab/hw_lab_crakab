import React, { useState } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLocation } from '../viewModels/LocationContext';
import { isValidCoordinate, formatCoordinate } from '../models/CarCoordinate';
import type { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Home screen with two buttons: "Here's My Car" saves the current location,
// and "Where's My Car?" opens the map (enabled once a location is saved).
export default function HomeView() {
  const navigation = useNavigation<NavProp>();
  const { coordinate, saveCurrentLocation } = useLocation();
  const [busy, setBusy] = useState(false);

  const hasLocation = isValidCoordinate(coordinate);

  // Saves the device's current location as the car's location, then shows
  // an alert with the saved coordinate (or the error message on failure).
  async function onSave() {
    if (busy) return;
    setBusy(true);
    try {
      const next = await saveCurrentLocation();
      Alert.alert(
        'Location Saved',
        `Your car is at:\n${formatCoordinate(next)}\n\nTap 'Where's My Car?' to view on the map.`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Location Error', message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Find My Car</Text>
        {hasLocation && <Text style={styles.subtitle}>Location Saved</Text>}
      </View>

      <Pressable style={[styles.button, styles.primary]} onPress={onSave} disabled={busy}>
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="car" size={22} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>{"Here's My Car"}</Text>
          </>
        )}
      </Pressable>

      <Pressable
        style={[styles.button, hasLocation ? styles.success : styles.disabled]}
        onPress={() => navigation.navigate('Map')}
        disabled={!hasLocation}
      >
        <Ionicons name="map" size={22} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>{"Where's My Car?"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 20 },
  titleBlock: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 34, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#34C759', marginTop: 6 },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 10 },
  primary: { backgroundColor: '#007AFF' },
  success: { backgroundColor: '#34C759' },
  disabled: { backgroundColor: '#a1a1a1' },
  icon: { marginRight: 8 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
