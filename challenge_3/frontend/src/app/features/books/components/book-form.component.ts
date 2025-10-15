import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { BookCreate } from '../models/book.model';

/**
 * Component for creating a new book.
 */
@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private router = inject(Router);

  bookForm!: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.bookForm = this.fb.group({
      isbn: ['', [Validators.required]],
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      publisher: [''],
      publication_year: [null],
      category: ['', [Validators.required]],
      description: [''],
      total_copies: [1, [Validators.required, Validators.min(1)]],
      available_copies: [1, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.loading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      const bookData: BookCreate = this.bookForm.value;

      this.bookService.createBook(bookData).subscribe({
        next: (book) => {
          this.successMessage.set('Book created successfully!');
          this.loading.set(false);
          setTimeout(() => {
            this.router.navigate(['/books']);
          }, 1500);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Failed to create book. Please try again.');
          this.loading.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/books']);
  }
}
