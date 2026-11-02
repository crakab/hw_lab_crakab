import {
  defaultCarCoordinate,
  isValidCoordinate,
  formatCoordinate,
  CarCoordinate,
} from '../models/CarCoordinate';

// Unit tests for the pure CarCoordinate helpers (no React/Expo needed).
describe('CarCoordinate', () => {
  // The placeholder "no location" value should be (0, 0).
  test('defaultCarCoordinate is (0, 0)', () => {
    expect(defaultCarCoordinate).toEqual({ latitude: 0, longitude: 0 });
  });

  // The default placeholder must not count as a saved location.
  test('isValidCoordinate returns false for the default', () => {
    expect(isValidCoordinate(defaultCarCoordinate)).toBe(false);
  });

  // Any non-zero component makes the coordinate valid.
  test('isValidCoordinate returns true when either component is non-zero', () => {
    expect(isValidCoordinate({ latitude: 40.4446, longitude: -79.9454 })).toBe(true);
    expect(isValidCoordinate({ latitude: 40.4446, longitude: 0 })).toBe(true);
    expect(isValidCoordinate({ latitude: 0, longitude: -79.9454 })).toBe(true);
  });

  // Long values are rounded to six decimal places.
  test('formatCoordinate produces six-decimal output', () => {
    const c: CarCoordinate = { latitude: 40.4446443, longitude: -79.945424 };
    expect(formatCoordinate(c)).toBe('(40.444644, -79.945424)');
  });

  // Short values are zero-padded to six decimal places.
  test('formatCoordinate pads short values to six decimals', () => {
    expect(formatCoordinate({ latitude: 1, longitude: 2 })).toBe('(1.000000, 2.000000)');
  });

  // Serializing and parsing (as AsyncStorage persistence does) loses nothing.
  test('round-trips cleanly through JSON', () => {
    const original: CarCoordinate = { latitude: 40.4446, longitude: -79.9454 };
    const restored = JSON.parse(JSON.stringify(original));
    expect(restored).toEqual(original);
    expect(isValidCoordinate(restored)).toBe(true);
  });
});
