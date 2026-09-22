import { Library } from '../viewModels/Library';
import { Book } from '../models/Book';
import { Gender } from '../models/Gender';

describe('Library', () => {
  test('library is populated with 77 books', () => {
    const lib = new Library();
    expect(lib.books.length).toBe(77);
  });

  test('library is sorted alphabetically by title', () => {
    const lib = new Library();
    const sorted = [...lib.books].sort(Book.compare);
    expect(lib.books.map((b) => b.title)).toEqual(sorted.map((b) => b.title));
  });

  test('adding a book increases the count', () => {
    const lib = new Library();
    const before = lib.books.length;
    lib.addBook('Diary of a Young Girl', 'Anne Frank', Gender.Female, true);
    expect(lib.books.length).toBe(before + 1);
  });

  test('removing a book by id decreases the count', () => {
    const lib = new Library();
    const before = lib.books.length;
    const doomed = lib.books[0].id;
    lib.removeBook(doomed);
    expect(lib.books.length).toBe(before - 1);
    expect(lib.books.find((b) => b.id === doomed)).toBeUndefined();
  });

  test('getBooksFor returns only that author', () => {
    const lib = new Library();
    const shakespeare = lib.getBooksFor('William Shakespeare');
    expect(shakespeare.length).toBeGreaterThan(0);
    expect(shakespeare.every((b) => b.author === 'William Shakespeare')).toBe(true);
  });

  test('gender filters partition the seed data', () => {
    const lib = new Library();
    const male = lib.getMaleAuthoredBooks();
    const female = lib.getFemaleAuthoredBooks();
    expect(male.every((b) => b.gender === Gender.Male)).toBe(true);
    expect(female.every((b) => b.gender === Gender.Female)).toBe(true);
    expect(male.length + female.length).toBe(lib.books.length);
  });

  test('book equality uses title and author only', () => {
    const a = new Book('Hamlet', 'William Shakespeare', Gender.Male, true);
    const b = new Book('Hamlet', 'William Shakespeare', Gender.Male, false);
    const c = new Book('Macbeth', 'William Shakespeare', Gender.Male, true);
    expect(Book.equals(a, b)).toBe(true); // different ids, different `displayed`, same title+author
    expect(Book.equals(a, c)).toBe(false);
  });
});
