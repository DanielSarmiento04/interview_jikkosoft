import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Book, BookCreate, BookUpdate, BookListResponse } from '../models/book.model';

/**
 * Service for managing book-related operations.
 * Uses signals for reactive state management and HttpClient for API calls.
 */
@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/books`;
  
  // Signal for storing all books
  private booksSignal = signal<Book[]>([]);
  
  // Public readonly signal
  books = this.booksSignal.asReadonly();
  
  // Computed signal for available books
  availableBooks = computed(() => 
    this.booksSignal().filter(book => book.available_copies > 0)
  );
  
  // Computed signal for total books count
  totalBooks = computed(() => this.booksSignal().length);

  /**
   * Load all books from the API
   */
  loadBooks(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    category?: string;
    available_only?: boolean;
  }): Observable<BookListResponse> {
    let httpParams = new HttpParams();
    
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.page_size) httpParams = httpParams.set('page_size', params.page_size.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.category) httpParams = httpParams.set('category', params.category);
    if (params?.available_only !== undefined) {
      httpParams = httpParams.set('available_only', params.available_only.toString());
    }
    
    return this.http.get<BookListResponse>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(response => this.booksSignal.set(response.items))
    );
  }

  /**
   * Get a book by ID
   */
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get a book by ISBN
   */
  getBookByIsbn(isbn: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/isbn/${isbn}`);
  }

  /**
   * Get available books
   */
  getAvailableBooks(page = 1, page_size = 10): Observable<BookListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', page_size.toString());
    
    return this.http.get<BookListResponse>(`${this.apiUrl}/available/list`, { params });
  }

  /**
   * Add a new book
   */
  createBook(book: BookCreate): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/`, book).pipe(
      tap(newBook => this.booksSignal.update(books => [...books, newBook]))
    );
  }

  /**
   * Update an existing book
   */
  updateBook(id: number, updates: BookUpdate): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(updatedBook => {
        this.booksSignal.update(books =>
          books.map(book => book.id === id ? updatedBook : book)
        );
      })
    );
  }

  /**
   * Delete a book
   */
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.booksSignal.update(books => books.filter(book => book.id !== id));
      })
    );
  }

  /**
   * Search books (uses the load books with search parameter)
   */
  searchBooks(query: string): Observable<BookListResponse> {
    return this.loadBooks({ search: query, page_size: 100 });
  }

  /**
   * Filter books by category
   */
  getBooksByCategory(category: string): Observable<BookListResponse> {
    return this.loadBooks({ category, page_size: 100 });
  }
}
