import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  bookService = inject(BookService);
  private router = inject(Router);

  searchQuery = signal('');
  showAvailableOnly = signal(false);

  ngOnInit(): void {
    // Load books from the API on component initialization
    this.bookService.loadBooks().subscribe();
  }

  // Computed signal for filtered books
  filteredBooks = computed(() => {
    let books = this.bookService.books();

    // Filter by availability if enabled
    if (this.showAvailableOnly()) {
      books = books.filter(book => book.available_copies > 0);
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

  addNewBook(): void {
    this.router.navigate(['/books/new']);
  }

  editBook(id: number): void {
    this.router.navigate(['/books', id]);
  }
}
