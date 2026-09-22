import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Library } from './Library';
import { Book } from '../models/Book';

type LibraryContextValue = {
  books: Book[];
  addBook: (title: string, author: string, gender: string, displayed: boolean) => void;
  removeBook: (id: string) => void;
  getBooksFor: (author: string) => Book[];
  getMaleAuthoredBooks: () => Book[];
  getFemaleAuthoredBooks: () => Book[];
};

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [library] = useState(() => new Library());
  const [books, setBooks] = useState<Book[]>(library.books);

  const sync = () => setBooks([...library.books]);

  return (
    <LibraryContext.Provider
      value={{
        books,
        addBook: (title, author, gender, displayed) => {
          library.addBook(title, author, gender, displayed);
          sync();
        },
        removeBook: (id) => {
          library.removeBook(id);
          sync();
        },
        getBooksFor: (author) => library.getBooksFor(author),
        getMaleAuthoredBooks: () => library.getMaleAuthoredBooks(),
        getFemaleAuthoredBooks: () => library.getFemaleAuthoredBooks(),
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used inside a LibraryProvider');
  return ctx;
}
