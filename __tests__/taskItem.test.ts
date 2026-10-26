import {
  isValidTask,
  compareTasksByName,
  compareTasksByDueDate,
  areTasksEqual,
  TaskItem,
} from '../models/TaskItem';

const fixedDate = new Date('2026-01-15T00:00:00Z');

// makes a sample task for the tests. it uses the same fixed date every time
// so two samples are actually equal, and overrides lets you change whatever
// fields the test needs
function sample(overrides: Partial<TaskItem> = {}): TaskItem {
  return {
    name: 'Write lab',
    assignedTo: 'Prof H',
    dueDate: fixedDate,
    dateAdded: fixedDate,
    completed: false,
    ...overrides,
  };
}

describe('isValidTask', () => {
  test('rejects an empty name', () => {
    expect(isValidTask('', 'someone')).toBe(false);
  });

  test('rejects an empty assignee', () => {
    expect(isValidTask('something', '')).toBe(false);
  });

  test('rejects whitespace-only fields', () => {
    expect(isValidTask('   ', 'someone')).toBe(false);
    expect(isValidTask('something', '   ')).toBe(false);
  });

  test('accepts both fields present', () => {
    expect(isValidTask('something', 'someone')).toBe(true);
  });
});

describe('comparators', () => {
  test('compareTasksByName sorts alphabetically', () => {
    const list = [sample({ name: 'Cherry' }), sample({ name: 'Apple' }), sample({ name: 'Banana' })];
    list.sort(compareTasksByName);
    expect(list.map((t) => t.name)).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  test('compareTasksByDueDate sorts earliest-first', () => {
    const a = sample({ name: 'A', dueDate: new Date('2026-03-01') });
    const b = sample({ name: 'B', dueDate: new Date('2026-01-01') });
    const c = sample({ name: 'C', dueDate: new Date('2026-02-01') });
    const list = [a, b, c].sort(compareTasksByDueDate);
    expect(list.map((t) => t.name)).toEqual(['B', 'C', 'A']);
  });
});

describe('areTasksEqual', () => {
  test('ignores completion state and id', () => {
    const a = sample();
    const b = sample({ completed: true });
    expect(areTasksEqual(a, b)).toBe(true);
  });

  test('differs when the name differs', () => {
    expect(areTasksEqual(sample({ name: 'A' }), sample({ name: 'B' }))).toBe(false);
  });

  test('differs when the due date differs', () => {
    expect(
      areTasksEqual(sample({ dueDate: new Date('2026-01-01') }), sample({ dueDate: new Date('2026-02-01') }))
    ).toBe(false);
  });
});
