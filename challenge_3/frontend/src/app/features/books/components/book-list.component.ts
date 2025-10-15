import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../services/book.service';
import { Book } from '../models/book.model';

/**
 * Component for displaying and managing the list of books.
 * Uses signals for reactive state management.
 */
@Component({
  selector: 'app-book-list',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="book-list-container">
      <header class="page-header">
        <h1>Book Catalog</h1>
        <div class="header-actions">
          <input
            type="text"
            placeholder="Search books..."
            [value]="searchQuery()"
            (input)="onSearchChange($event)"
            class="search-input"
          />
          <button (click)="toggleShowAvailableOnly()" class="filter-btn">
            {{ showAvailableOnly() ? 'Show All' : 'Show Available Only' }}
          </button>
        </div>
      </header>

      <div class="stats">
        <div class="stat-card">
          <span class="stat-label">Total Books</span>
          <span class="stat-value">{{ bookService.totalBooks() }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Available</span>
          <span class="stat-value">{{ bookService.availableBooks().length }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Filtered Results</span>
          <span class="stat-value">{{ filteredBooks().length }}</span>
        </div>
      </div>

      @if (filteredBooks().length === 0) {
        <div class="empty-state">
          <p>No books found matching your criteria.</p>
        </div>
      } @else {
        <div class="books-grid">
          @for (book of filteredBooks(); track book.id) {
            <div class="book-card">
              <div class="book-header">
                <h3 class="book-title">{{ book.title }}</h3>
                <span
                  class="availability-badge"
                  [class.available]="book.availableCopies > 0"
                  [class.unavailable]="book.availableCopies === 0"
                >
                  {{ book.availableCopies > 0 ? 'Available' : 'Unavailable' }}
                </span>
              </div>

              <div class="book-details">
                <p><strong>Author:</strong> {{ book.author }}</p>
                <p><strong>ISBN:</strong> {{ book.isbn }}</p>
                <p><strong>Category:</strong> {{ book.category }}</p>
                @if (book.publisher) {
                  <p><strong>Publisher:</strong> {{ book.publisher }}</p>
                }
                @if (book.publicationYear) {
                  <p><strong>Year:</strong> {{ book.publicationYear }}</p>
                }
                @if (book.description) {
                  <p class="description">{{ book.description }}</p>
                }
              </div>

              <div class="book-footer">
                <span class="copies-info">
                  {{ book.availableCopies }} / {{ book.totalCopies }} available
                </span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .book-list-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #1a1a1a;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .search-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
    }

    .search-input:focus {
      outline: none;
      border-color: #4a90e2;
      box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }

    .filter-btn {
      padding: 0.75rem 1.5rem;
      background-color: #4a90e2;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      white-space: nowrap;
      transition: background-color 0.2s;
    }

    .filter-btn:hover {
      background-color: #357abd;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
      font-weight: 500;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a1a;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .empty-state p {
      font-size: 1.125rem;
      color: #666;
    }

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .book-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .book-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .book-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .book-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
      flex: 1;
    }

    .availability-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .availability-badge.available {
      background-color: #d4edda;
      color: #155724;
    }

    .availability-badge.unavailable {
      background-color: #f8d7da;
      color: #721c24;
    }

    .book-details {
      margin-bottom: 1rem;
    }

    .book-details p {
      margin: 0.5rem 0;
      font-size: 0.875rem;
      color: #333;
    }

    .book-details p strong {
      color: #666;
      font-weight: 500;
    }

    .description {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
      font-style: italic;
      color: #666;
    }

    .book-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .copies-info {
      font-size: 0.875rem;
      color: #666;
      font-weight: 500;
    }
  `]
})
export class BookListComponent {
  bookService = inject(BookService);

  searchQuery = signal('');
  showAvailableOnly = signal(false);

  // Computed signal for filtered books
  filteredBooks = computed(() => {
    let books = this.bookService.books();

    // Filter by availability if enabled
    if (this.showAvailableOnly()) {
      books = books.filter(book => book.availableCopies > 0);
    }

    // Filter by search query
    const query = this.searchQuery().toLowerCase();
    if (query) {
      books = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.includes(query) ||
        book.category.toLowerCase().includes(query)
      );
    }

    return books;
  });

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  toggleShowAvailableOnly(): void {
    this.showAvailableOnly.update(value => !value);
  }
}
