import * as Crypto from 'expo-crypto';

export class Book {
  id: string;
  title: string;
  author: string;
  gender: string;
  displayed: boolean;

  constructor(title: string, author: string, gender: string, displayed: boolean) {
    this.id = Crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.gender = gender;
    this.displayed = displayed;
  }

  static equals(a: Book, b: Book): boolean {
    return a.title === b.title && a.author === b.author;
  }

  static compare(a: Book, b: Book): number {
    return a.title.localeCompare(b.title);
  }
}
