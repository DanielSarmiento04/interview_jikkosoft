import { Injectable, signal, computed } from '@angular/core';
import { Library } from '../models/library.model';

/**
 * Service for managing library-related operations.
 * Uses signals for reactive state management.
 */
@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  // Signal for storing all libraries
  private librariesSignal = signal<Library[]>([]);

  // Public readonly signal
  libraries = this.librariesSignal.asReadonly();

  // Computed signal for total libraries count
  totalLibraries = computed(() => this.librariesSignal().length);

  constructor() {
    // Initialize with mock data
    this.initializeMockData();
  }

  /**
   * Initialize with mock data for demonstration
   */
  private initializeMockData(): void {
    const mockLibraries: Library[] = [
      {
        id: 1,
        name: 'Central Library',
        address: '123 Main Street, City Center',
        phone: '+1-555-0100',
        email: 'central@library.com',
        books: [1, 2, 3],
        members: [1, 2],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Tech Library',
        address: '456 Tech Avenue, Innovation District',
        phone: '+1-555-0200',
        email: 'tech@library.com',
        books: [1, 2],
        members: [3],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.librariesSignal.set(mockLibraries);
  }

  /**
   * Get a library by ID
   */
  getLibraryById(id: number): Library | undefined {
    return this.librariesSignal().find(library => library.id === id);
  }

  /**
   * Add a new library
   */
  addLibrary(library: Omit<Library, 'id' | 'createdAt' | 'updatedAt'>): Library {
    const newLibrary: Library = {
      ...library,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.librariesSignal.update(libraries => [...libraries, newLibrary]);
    return newLibrary;
  }

  /**
   * Update an existing library
   */
  updateLibrary(id: number, updates: Partial<Library>): Library | undefined {
    const index = this.librariesSignal().findIndex(library => library.id === id);

    if (index === -1) return undefined;

    this.librariesSignal.update(libraries => {
      const updatedLibraries = [...libraries];
      updatedLibraries[index] = {
        ...updatedLibraries[index],
        ...updates,
        updatedAt: new Date()
      };
      return updatedLibraries;
    });

    return this.librariesSignal()[index];
  }

  /**
   * Delete a library
   */
  deleteLibrary(id: number): boolean {
    const initialLength = this.librariesSignal().length;
    this.librariesSignal.update(libraries =>
      libraries.filter(library => library.id !== id)
    );
    return this.librariesSignal().length < initialLength;
  }

  /**
   * Add a book to a library
   */
  addBookToLibrary(libraryId: number, bookId: number): Library | undefined {
    const library = this.getLibraryById(libraryId);
    if (!library) return undefined;

    if (!library.books.includes(bookId)) {
      const updatedBooks = [...library.books, bookId];
      return this.updateLibrary(libraryId, { books: updatedBooks });
    }

    return library;
  }

  /**
   * Remove a book from a library
   */
  removeBookFromLibrary(libraryId: number, bookId: number): Library | undefined {
    const library = this.getLibraryById(libraryId);
    if (!library) return undefined;

    const updatedBooks = library.books.filter(id => id !== bookId);
    return this.updateLibrary(libraryId, { books: updatedBooks });
  }

  /**
   * Add a member to a library
   */
  addMemberToLibrary(libraryId: number, memberId: number): Library | undefined {
    const library = this.getLibraryById(libraryId);
    if (!library) return undefined;

    if (!library.members.includes(memberId)) {
      const updatedMembers = [...library.members, memberId];
      return this.updateLibrary(libraryId, { members: updatedMembers });
    }

    return library;
  }

  /**
   * Remove a member from a library
   */
  removeMemberFromLibrary(libraryId: number, memberId: number): Library | undefined {
    const library = this.getLibraryById(libraryId);
    if (!library) return undefined;

    const updatedMembers = library.members.filter(id => id !== memberId);
    return this.updateLibrary(libraryId, { members: updatedMembers });
  }

  /**
   * Generate a unique ID for new libraries
   */
  private generateId(): number {
    const maxId = Math.max(0, ...this.librariesSignal().map(library => library.id || 0));
    return maxId + 1;
  }
}
