import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Library, LibraryCreate, LibraryUpdate, LibraryListResponse } from '../models/library.model';

/**
 * Service for managing library-related operations.
 * Uses signals for reactive state management and HttpClient for API calls.
 */
@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/libraries`;

  // Signal for storing all libraries
  private librariesSignal = signal<Library[]>([]);

  // Public readonly signal
  libraries = this.librariesSignal.asReadonly();

  // Computed signal for total libraries count
  totalLibraries = computed(() => this.librariesSignal().length);

  /**
   * Load all libraries from the API
   */
  loadLibraries(page: number = 1, size: number = 100, search?: string): Observable<LibraryListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<LibraryListResponse>(this.apiUrl, { params }).pipe(
      tap(response => this.librariesSignal.set(response.items))
    );
  }

  /**
   * Get a library by ID
   */
  getLibraryById(id: number): Observable<Library> {
    return this.http.get<Library>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new library
   */
  createLibrary(library: LibraryCreate): Observable<Library> {
    return this.http.post<Library>(this.apiUrl, library).pipe(
      tap(newLibrary => {
        this.librariesSignal.update(libraries => [...libraries, newLibrary]);
      })
    );
  }

  /**
   * Update an existing library
   */
  updateLibrary(id: number, updates: LibraryUpdate): Observable<Library> {
    return this.http.put<Library>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(updatedLibrary => {
        this.librariesSignal.update(libraries =>
          libraries.map(lib => lib.id === id ? updatedLibrary : lib)
        );
      })
    );
  }

  /**
   * Delete a library
   */
  deleteLibrary(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.librariesSignal.update(libraries =>
          libraries.filter(lib => lib.id !== id)
        );
      })
    );
  }

  /**
   * Search libraries by query
   */
  searchLibraries(query: string, page: number = 1, size: number = 100): Observable<LibraryListResponse> {
    return this.loadLibraries(page, size, query);
  }
}
