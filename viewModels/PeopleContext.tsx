import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Person, createBlankPerson } from '../models/Person';

const STORAGE_KEY = '@SimpleContacts:people';

export type SortOrder = 'asc' | 'desc';

/**
 * Spec: Pure helper that returns a NEW array of people whose names contain
 * `searchText` (case-insensitive, surrounding whitespace ignored; an empty or
 * whitespace-only search keeps everyone), sorted by name A-Z for 'asc' or Z-A
 * for 'desc'. It never mutates the input array, which makes it easy to unit-test.
 */
export function filterAndSort(people: Person[], searchText: string, sortOrder: SortOrder): Person[] {
  const needle = searchText.trim().toLowerCase();
  const filtered = needle === ''
    ? people
    : people.filter((p) => p.name.toLowerCase().includes(needle));
  return [...filtered].sort((a, b) =>
    sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
}

type PeopleContextValue = {
  people: Person[];
  loading: boolean;
  addPerson: () => Person;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  getPerson: (id: string) => Person | undefined;
};

const PeopleContext = createContext<PeopleContextValue | undefined>(undefined);

/**
 * Spec: Context provider that owns the app's list of people. On mount it loads
 * any previously saved people from AsyncStorage; after that, every change to
 * the list is automatically written back to AsyncStorage. It exposes the list
 * plus add/update/delete/get helpers to every screen rendered inside it.
 */
export function PeopleProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  // Load whatever was saved from a previous session as soon as the provider
  // mounts. This is the RN equivalent of SwiftData's modelContainer(for:)
  // automatically loading the store on app launch.
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json != null) setPeople(JSON.parse(json));
      } catch (error) {
        console.error('Error loading people:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Any time `people` changes, persist the whole array back to AsyncStorage.
  // This plays the role SwiftData's automatic save-on-change played in Swift --
  // no screen ever has to call a "save" method by hand.
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(people)).catch((error) =>
        console.error('Error saving people:', error)
      );
    }
  }, [people, loading]);

  /**
   * Spec: Creates a blank Person, appends it to the list (which triggers a
   * save), and returns it so the caller can navigate straight to its edit screen.
   */
  const addPerson = (): Person => {
    const person = createBlankPerson();
    setPeople((prev) => [...prev, person]);
    return person;
  };

  /**
   * Spec: Finds the person with the given id and merges `updates` into it
   * (only the provided fields change). All other people are left untouched.
   */
  const updatePerson = (id: string, updates: Partial<Person>) => {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  /**
   * Spec: Removes the person with the given id from the list (and therefore
   * from storage on the next save).
   */
  const deletePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  /**
   * Spec: Returns the current copy of the person with the given id, or
   * undefined if no such person exists (e.g. it was deleted).
   */
  const getPerson = (id: string) => people.find((p) => p.id === id);

  return (
    <PeopleContext.Provider
      value={{ people, loading, addPerson, updatePerson, deletePerson, getPerson }}
    >
      {children}
    </PeopleContext.Provider>
  );
}

/**
 * Spec: Hook that gives a component access to the people store. Throws a clear
 * error if it is used in a component that isn't wrapped in a PeopleProvider.
 */
export function usePeople(): PeopleContextValue {
  const ctx = useContext(PeopleContext);
  if (!ctx) throw new Error('usePeople must be used inside a PeopleProvider');
  return ctx;
}
