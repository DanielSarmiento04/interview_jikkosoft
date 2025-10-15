import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../services/book.service';
import { BookUpdate } from '../models/book.model';

/**
 * Component for editing an existing book.
 */
@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.scss']
})
export class BookEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  bookForm!: FormGroup;
  loading = signal(true);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  bookId!: number;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookId = parseInt(id, 10);
      this.loadBook();
    } else {
      this.router.navigate(['/books']);
    }
  }

  loadBook(): void {
    this.bookService.getBookById(this.bookId).subscribe({
      next: (book) => {
        this.initForm(book);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load book data');
        this.loading.set(false);
      }
    });
  }

  initForm(book: any): void {
    this.bookForm = this.fb.group({
      isbn: [book.isbn, [Validators.required]],
      title: [book.title, [Validators.required]],
      author: [book.author, [Validators.required]],
      publisher: [book.publisher || ''],
      publication_year: [book.publication_year],
      category: [book.category, [Validators.required]],
      description: [book.description || ''],
      total_copies: [book.total_copies, [Validators.required, Validators.min(1)]],
      available_copies: [book.available_copies, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.submitting.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      const formValue = this.bookForm.value;
      const bookData: BookUpdate = {
        title: formValue.title,
        author: formValue.author,
        publisher: formValue.publisher || null,
        publication_year: formValue.publication_year || null,
        category: formValue.category,
        description: formValue.description || null,
        total_copies: formValue.total_copies,
        available_copies: formValue.available_copies
      };

      this.bookService.updateBook(this.bookId, bookData).subscribe({
        next: (book) => {
          this.successMessage.set('Book updated successfully!');
          this.submitting.set(false);
          setTimeout(() => {
            this.router.navigate(['/books']);
          }, 1500);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Failed to update book. Please try again.');
          this.submitting.set(false);
        }
      });
    }
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      this.submitting.set(true);
      this.bookService.deleteBook(this.bookId).subscribe({
        next: () => {
          this.successMessage.set('Book deleted successfully!');
          setTimeout(() => {
            this.router.navigate(['/books']);
          }, 1000);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Failed to delete book. Please try again.');
          this.submitting.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/books']);
  }
}
