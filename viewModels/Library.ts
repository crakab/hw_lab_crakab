import { Book } from '../models/Book';
import { Gender } from '../models/Gender';

export class Library {
  books: Book[] = [];

  constructor() {
    const bookData: Record<string, [string, Gender]> = {
      "The Count of Monte Cristo": ["Alexandre Dumas", Gender.Male],
      "The Man in the Iron Mask": ["Alexandre Dumas", Gender.Male],
      "The Three Musketeers": ["Alexandre Dumas", Gender.Male],
      "Black Beauty": ["Anna Sewell", Gender.Female],
      "The Tenant of Wildfell Hall": ["Anne Bronte", Gender.Female],
      "The Prisoner of Zenda": ["Anthony Hope", Gender.Male],
      "Adventures of Sherlock Holmes": ["Arthur Conan Doyle", Gender.Male],
      "The Hound of the Baskervilles": ["Arthur Conan Doyle", Gender.Male],
      "Dracula": ["Bram Stoker", Gender.Male],
      "A Christmas Carol": ["Charles Dickens", Gender.Male],
      "A Tale of Two Cities": ["Charles Dickens", Gender.Male],
      "David Copperfield": ["Charles Dickens", Gender.Male],
      "Great Expectations": ["Charles Dickens", Gender.Male],
      "Hard Times": ["Charles Dickens", Gender.Male],
      "Nicholas Nickleby": ["Charles Dickens", Gender.Male],
      "Oliver Twist": ["Charles Dickens", Gender.Male],
      "The Pickwick Papers": ["Charles Dickens", Gender.Male],
      "Jane Eyre": ["Charlotte Bronte", Gender.Female],
      "Shirley": ["Charlotte Bronte", Gender.Female],
      "The Professor": ["Charlotte Bronte", Gender.Female],
      "Villette": ["Charlotte Bronte", Gender.Female],
      "The Age of Innocence": ["Edith Wharton", Gender.Female],
      "Wuthering Heights": ["Emily Bronte", Gender.Female],
      "Crime and Punishment": ["Fyodor Dostoyevsky", Gender.Male],
      "The Brothers Karamazov": ["Fyodor Dostoyevsky", Gender.Male],
      "The Phantom of the Opera": ["Gaston Leroux", Gender.Male],
      "1984": ["George Orwell", Gender.Male],
      "Animal Farm": ["George Orwell", Gender.Male],
      "To Kill A Mockingbird": ["Harper Lee", Gender.Female],
      "Uncle Tom's Cabin": ["Harriet Beecher Stowe", Gender.Female],
      "Walden": ["Henry David Thoreau", Gender.Male],
      "Last of the Mohicans": ["James Fenimore Cooper", Gender.Male],
      "The Deerslayer": ["James Fenimore Cooper", Gender.Male],
      "Emma": ["Jane Austen", Gender.Female],
      "Mansfield Park": ["Jane Austen", Gender.Female],
      "Northanger Abbey": ["Jane Austen", Gender.Female],
      "Persuasion": ["Jane Austen", Gender.Female],
      "Pride and Prejudice": ["Jane Austen", Gender.Female],
      "Sense and Sensibility": ["Jane Austen", Gender.Female],
      "Pilgrim's Progress": ["John Bunyan", Gender.Male],
      "Of Mice and Men": ["John Steinbeck", Gender.Male],
      "Gulliver's Travels": ["Jonathan Swift", Gender.Male],
      "Around the World in Eighty Days": ["Jules Verne", Gender.Male],
      "Journey to the Center of the Earth": ["Jules Verne", Gender.Male],
      "The Awakening": ["Kate Chopin", Gender.Female],
      "Anna Karenina": ["Leo Tolstoy", Gender.Male],
      "War and Peace": ["Leo Tolstoy", Gender.Male],
      "Alice's Adventures in Wonderland": ["Lewis Carroll", Gender.Male],
      "Through The Looking Glass": ["Lewis Carroll", Gender.Male],
      "Little Women": ["Louisa May Alcott", Gender.Female],
      "Frankenstein": ["Mary Shelley", Gender.Female],
      "The Scarlet Letter": ["Nathaniel Hawthorne", Gender.Male],
      "Fahrenheit 451": ["Ray Bradbury", Gender.Male],
      "Kidnapped": ["Robert Louis Stevenson", Gender.Male],
      "The Strange Case of Dr Jekyll and Mr Hyde": ["Robert Louis Stevenson", Gender.Male],
      "Treasure Island": ["Robert Louis Stevenson", Gender.Male],
      "The Red Badge of Courage": ["Stephen Crane", Gender.Male],
      "Rights of Man": ["Thomas Paine", Gender.Male],
      "Les Miserables": ["Victor Hugo", Gender.Male],
      "A Midsummer Night's Dream": ["William Shakespeare", Gender.Male],
      "Hamlet": ["William Shakespeare", Gender.Male],
      "Henry V": ["William Shakespeare", Gender.Male],
      "Julius Caesar": ["William Shakespeare", Gender.Male],
      "King Lear": ["William Shakespeare", Gender.Male],
      "Macbeth": ["William Shakespeare", Gender.Male],
      "Much Ado About Nothing": ["William Shakespeare", Gender.Male],
      "Othello": ["William Shakespeare", Gender.Male],
      "Romeo and Juliet": ["William Shakespeare", Gender.Male],
      "The Comedy of Errors": ["William Shakespeare", Gender.Male],
      "The Merchant of Venice": ["William Shakespeare", Gender.Male],
      "The Taming of the Shrew": ["William Shakespeare", Gender.Male],
      "The Tempest": ["William Shakespeare", Gender.Male],
      "Twelfth Night": ["William Shakespeare", Gender.Male],
      "The Hobbit or There and Back Again": ["J.R.R. Tolkien", Gender.Male],
      "The Fellowship of the Ring": ["J.R.R. Tolkien", Gender.Male],
      "The Two Towers": ["J.R.R. Tolkien", Gender.Male],
      "The Return of the King": ["J.R.R. Tolkien", Gender.Male],
    };

    for (const [title, [author, gender]] of Object.entries(bookData)) {
      this.books.push(new Book(title, author, gender, true));
    }
    this.books.sort(Book.compare);
  }

  addBook(title: string, author: string, gender: string, displayed: boolean): void {
    this.books.push(new Book(title, author, gender, displayed));
    this.books.sort(Book.compare);
  }

  removeBook(id: string): void {
    this.books = this.books.filter((b) => b.id !== id);
  }

  getBooksFor(author: string): Book[] {
    return this.books.filter((b) => b.author === author);
  }

  getMaleAuthoredBooks(): Book[] {
    return this.books.filter((b) => b.gender === Gender.Male);
  }

  getFemaleAuthoredBooks(): Book[] {
    return this.books.filter((b) => b.gender === Gender.Female);
  }
}
