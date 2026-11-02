import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CarCoordinate, defaultCarCoordinate } from '../models/CarCoordinate';

// AsyncStorage key the saved car coordinate is stored under.
const STORAGE_KEY = '@FindMyCar:coordinate';

// Everything the screens can read or call through useLocation().
type LocationContextValue = {
  coordinate: CarCoordinate;
  loading: boolean;
  saveCurrentLocation: () => Promise<CarCoordinate>;
  clearLocation: () => Promise<void>;
};

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

// Provider that owns the saved car coordinate, persists it to AsyncStorage,
// and exposes it (plus save/clear actions) to every screen below it.
export function LocationProvider({ children }: { children: ReactNode }) {
  const [coordinate, setCoordinate] = useState<CarCoordinate>(defaultCarCoordinate);
  const [loading, setLoading] = useState(true);

  // Load whatever coordinate was saved from a previous session on mount.
  // This is the RN equivalent of the Swift LocationManager's loadLocation()
  // being called from init().
  useEffect(() => {
    // Reads the stored JSON (if any) and restores it into state.
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json != null) setCoordinate(JSON.parse(json));
      } catch (error) {
        console.error('Error loading coordinate:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Checks location services and permission, gets the device's current
  // position, saves it to AsyncStorage, updates state, and returns it.
  // Throws an Error with a user-facing message if anything fails.
  async function saveCurrentLocation(): Promise<CarCoordinate> {
    // Confirm services + permissions before asking for a position.
    if (!(await Location.hasServicesEnabledAsync())) {
      throw new Error('Location services are disabled.');
    }
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      ({ status } = await Location.requestForegroundPermissionsAsync());
    }
    if (status !== 'granted') {
      throw new Error('Location access denied. Please enable in Settings.');
    }

    const fix = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    const next: CarCoordinate = {
      latitude: fix.coords.latitude,
      longitude: fix.coords.longitude,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCoordinate(next);
    return next;
  }

  // Resets the saved location back to the (0, 0) default, both in storage
  // and in state, so the app behaves as if no car has been saved.
  async function clearLocation(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCarCoordinate));
    setCoordinate(defaultCarCoordinate);
  }

  return (
    <LocationContext.Provider value={{ coordinate, loading, saveCurrentLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

// Hook for screens to access the shared location state. Throws if used
// outside of a LocationProvider so mistakes surface immediately.
export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used inside a LocationProvider');
  return ctx;
}
