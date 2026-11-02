// A latitude/longitude pair for where the car is parked. Used both for
// persistence (serialized with JSON.stringify) and as the Marker coordinate
// on the map, since react-native-maps accepts a plain { latitude, longitude }.
export interface CarCoordinate {
  latitude: number;
  longitude: number;
}

// Placeholder coordinate meaning "no location saved yet".
export const defaultCarCoordinate: CarCoordinate = {
  latitude: 0.0,
  longitude: 0.0,
};

// Returns true if the coordinate is a real saved location, i.e. anything
// other than the (0, 0) default placeholder.
export function isValidCoordinate(coordinate: CarCoordinate): boolean {
  return coordinate.latitude !== 0 || coordinate.longitude !== 0;
}

// Formats a coordinate for display as "(lat, lon)" with six decimal places.
export function formatCoordinate(coordinate: CarCoordinate): string {
  const lat = coordinate.latitude.toFixed(6);
  const lon = coordinate.longitude.toFixed(6);
  return `(${lat}, ${lon})`;
}
