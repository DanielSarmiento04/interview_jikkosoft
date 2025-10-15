/**
 * Represents a book in the library system.
 */
export interface Book {
  id?: number;
  isbn: string;
  title: string;
  author: string;
  publisher?: string;
  publicationYear?: number;
  category: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
  createdAt?: Date;
  updatedAt?: Date;
}
