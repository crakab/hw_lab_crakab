import * as Crypto from 'expo-crypto';

// A single contact. photoUri points at an image file on disk (from
// expo-image-picker) rather than holding raw image bytes.
export interface Person {
  id: string;
  name: string;
  email: string;
  details: string;
  photoUri?: string;
}

/**
 * Spec: Builds a brand-new, empty Person with a freshly generated UUID as its id
 * and empty strings for name, email, and details (no photo yet). Used whenever
 * the user taps "+" so the new contact can be added to the store and edited.
 */
export function createBlankPerson(): Person {
  return {
    id: Crypto.randomUUID(),
    name: '',
    email: '',
    details: '',
  };
}
