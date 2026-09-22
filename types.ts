import type { Book } from './models/Book';

export type LibraryStackParamList = {
  LibraryList: undefined;
  BookDetails: { book: Book };
};
