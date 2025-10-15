/**
 * Represents a book in the library system (matches API BookResponse schema).
 */
export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher?: string | null;
  publication_year?: number | null;
  category: string;
  description?: string | null;
  total_copies: number;
  available_copies: number;
  created_at: string;
  updated_at: string;
}

/**
 * Request payload for creating a new book (matches API BookCreate schema).
 */
export interface BookCreate {
  isbn: string;
  title: string;
  author: string;
  publisher?: string | null;
  publication_year?: number | null;
  category: string;
  description?: string | null;
  total_copies?: number;
  available_copies?: number | null;
}

/**
 * Request payload for updating a book (matches API BookUpdate schema).
 */
export interface BookUpdate {
  title?: string | null;
  author?: string | null;
  publisher?: string | null;
  publication_year?: number | null;
  category?: string | null;
  description?: string | null;
  total_copies?: number | null;
  available_copies?: number | null;
}

/**
 * Paginated book list response (matches API BookListResponse schema).
 */
export interface BookListResponse {
  items: Book[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}
