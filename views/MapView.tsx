import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocation } from '../viewModels/LocationContext';
import { formatCoordinate } from '../models/CarCoordinate';

// Map screen: centers on the saved car location, drops a custom car marker
// there, shows the user's blue dot, and floats an info card with the
// coordinate on top of the map.
export default function MapViewScreen() {
  const { coordinate } = useLocation();

  const initialRegion: Region = {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        showsCompass
      >
        <Marker coordinate={coordinate} title="Your Car" description="Your car is parked here">
          <View style={styles.markerContent}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="directions-car" size={26} color="#FF3B30" />
            </View>
            <View style={styles.markerLabel}>
              <Text style={styles.markerLabelText}>Your Car</Text>
            </View>
          </View>
        </Marker>
      </MapView>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Your Car Location</Text>
        <Text style={styles.infoText}>{formatCoordinate(coordinate)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  markerContent: { alignItems: 'center' },
  iconCircle: {
    padding: 6, backgroundColor: '#fff', borderRadius: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 2, elevation: 3,
  },
  markerLabel: {
    backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4, marginTop: 4,
  },
  markerLabelText: { fontSize: 11, fontWeight: '600' },
  infoCard: {
    position: 'absolute', top: 16, left: 16, right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)', padding: 12, borderRadius: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  infoTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  infoText: { fontSize: 13, color: '#333' },
});
