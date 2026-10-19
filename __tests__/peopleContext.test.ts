import { filterAndSort } from '../viewModels/PeopleContext';
import type { Person } from '../models/Person';

const sample: Person[] = [
  { id: '1', name: 'Alex Heimann', email: 'alex@example.com', details: '' },
  { id: '2', name: 'An Heimann',   email: 'an@example.com',   details: '' },
  { id: '3', name: 'Tim Daigle',   email: 'tim@example.com',  details: '' },
  { id: '4', name: 'Tom Brady',    email: 'tom@example.com',  details: '' },
];

describe('filterAndSort', () => {
  test('empty search returns all people, ascending', () => {
    const result = filterAndSort(sample, '', 'asc');
    expect(result.map((p) => p.name)).toEqual([
      'Alex Heimann', 'An Heimann', 'Tim Daigle', 'Tom Brady',
    ]);
  });

  test('descending sort reverses order', () => {
    const result = filterAndSort(sample, '', 'desc');
    expect(result.map((p) => p.name)).toEqual([
      'Tom Brady', 'Tim Daigle', 'An Heimann', 'Alex Heimann',
    ]);
  });

  test('search matches substring of name', () => {
    const result = filterAndSort(sample, 'heim', 'asc');
    expect(result.map((p) => p.name)).toEqual(['Alex Heimann', 'An Heimann']);
  });

  test('search is case-insensitive', () => {
    const result = filterAndSort(sample, 'BRADY', 'asc');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Tom Brady');
  });

  test('whitespace-only search returns everyone', () => {
    const result = filterAndSort(sample, '     ', 'asc');
    expect(result.length).toBe(4);
  });

  test('non-matching search returns empty', () => {
    expect(filterAndSort(sample, 'zzz', 'asc')).toEqual([]);
  });

  test('does not mutate its input', () => {
    const before = [...sample];
    filterAndSort(sample, '', 'desc');
    expect(sample).toEqual(before);
  });
});
