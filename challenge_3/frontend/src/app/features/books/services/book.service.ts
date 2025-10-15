import { Injectable, signal, computed } from '@angular/core';
import { Book } from '../models/book.model';

/**
 * Service for managing book-related operations.
 * Uses signals for reactive state management.
 */
@Injectable({
  providedIn: 'root'
})
export class BookService {
  // Signal for storing all books
  private booksSignal = signal<Book[]>([]);
  
  // Public readonly signal
  books = this.booksSignal.asReadonly();
  
  // Computed signal for available books
  availableBooks = computed(() => 
    this.booksSignal().filter(book => book.availableCopies > 0)
  );
  
  // Computed signal for total books count
  totalBooks = computed(() => this.booksSignal().length);

  constructor() {
    // Initialize with mock data
    this.initializeMockData();
  }

  /**
   * Initialize with mock data for demonstration
   */
  private initializeMockData(): void {
    const mockBooks: Book[] = [
      {
        id: 1,
        isbn: '978-0-13-468599-1',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        publisher: 'Prentice Hall',
        publicationYear: 2008,
        category: 'Programming',
        description: 'A Handbook of Agile Software Craftsmanship',
        totalCopies: 5,
        availableCopies: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        isbn: '978-0-13-235088-4',
        title: 'Clean Architecture',
        author: 'Robert C. Martin',
        publisher: 'Prentice Hall',
        publicationYear: 2017,
        category: 'Programming',
        description: 'A Craftsman\'s Guide to Software Structure and Design',
        totalCopies: 3,
        availableCopies: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        isbn: '978-0-321-12521-7',
        title: 'Domain-Driven Design',
        author: 'Eric Evans',
        publisher: 'Addison-Wesley',
        publicationYear: 2003,
        category: 'Software Architecture',
        description: 'Tackling Complexity in the Heart of Software',
        totalCopies: 4,
        availableCopies: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    this.booksSignal.set(mockBooks);
  }

  /**
   * Get a book by ID
   */
  getBookById(id: number): Book | undefined {
    return this.booksSignal().find(book => book.id === id);
  }

  /**
   * Get a book by ISBN
   */
  getBookByIsbn(isbn: string): Book | undefined {
    return this.booksSignal().find(book => book.isbn === isbn);
  }

  /**
   * Add a new book
   */
  addBook(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Book {
    const newBook: Book = {
      ...book,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.booksSignal.update(books => [...books, newBook]);
    return newBook;
  }

  /**
   * Update an existing book
   */
  updateBook(id: number, updates: Partial<Book>): Book | undefined {
    const index = this.booksSignal().findIndex(book => book.id === id);
    
    if (index === -1) return undefined;
    
    this.booksSignal.update(books => {
      const updatedBooks = [...books];
      updatedBooks[index] = {
        ...updatedBooks[index],
        ...updates,
        updatedAt: new Date()
      };
      return updatedBooks;
    });
    
    return this.booksSignal()[index];
  }

  /**
   * Delete a book
   */
  deleteBook(id: number): boolean {
    const initialLength = this.booksSignal().length;
    this.booksSignal.update(books => books.filter(book => book.id !== id));
    return this.booksSignal().length < initialLength;
  }

  /**
   * Search books by title or author
   */
  searchBooks(query: string): Book[] {
    const lowerQuery = query.toLowerCase();
    return this.booksSignal().filter(book =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter books by category
   */
  getBooksByCategory(category: string): Book[] {
    return this.booksSignal().filter(book => book.category === category);
  }

  /**
   * Update book availability (e.g., when borrowed or returned)
   */
  updateAvailability(id: number, availableCopies: number): Book | undefined {
    return this.updateBook(id, { availableCopies });
  }

  /**
   * Generate a unique ID for new books
   */
  private generateId(): number {
    const maxId = Math.max(0, ...this.booksSignal().map(book => book.id || 0));
    return maxId + 1;
  }
}
