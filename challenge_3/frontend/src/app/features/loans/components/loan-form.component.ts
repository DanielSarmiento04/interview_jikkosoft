import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanService } from '../services/loan.service';
import { BookService } from '../../books/services/book.service';
import { MemberService } from '../../members/services/member.service';
import { LoanCreate } from '../models/loan.model';
import { Book } from '../../books/models/book.model';
import { Member } from '../../members/models/member.model';

/**
 * Component for creating a new loan (checking out a book).
 */
@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.scss']
})
export class LoanFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private loanService = inject(LoanService);
  private bookService = inject(BookService);
  private memberService = inject(MemberService);
  private router = inject(Router);

  loanForm!: FormGroup;
  loading = signal(false);
  loadingBooks = signal(false);
  loadingMembers = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  availableBooks = signal<Book[]>([]);
  activeMembers = signal<Member[]>([]);

  minDate: string;

  constructor() {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.initForm();
    this.loadBooks();
    this.loadMembers();
  }

  initForm(): void {
    this.loanForm = this.fb.group({
      book_id: ['', [Validators.required]],
      member_id: ['', [Validators.required]],
      due_date: ['']
    });
  }

  loadBooks(): void {
    this.loadingBooks.set(true);
    this.bookService.loadBooks().subscribe({
      next: (response) => {
        // Filter only available books
        const available = response.items.filter(book => book.available_copies > 0);
        this.availableBooks.set(available);
        this.loadingBooks.set(false);
      },
      error: (err) => {
        console.error('Failed to load books:', err);
        this.loadingBooks.set(false);
      }
    });
  }

  loadMembers(): void {
    this.loadingMembers.set(true);
    this.memberService.loadMembers().subscribe({
      next: (response) => {
        // Filter only active members
        const active = response.items.filter(member => member.status === 'active');
        this.activeMembers.set(active);
        this.loadingMembers.set(false);
      },
      error: (err) => {
        console.error('Failed to load members:', err);
        this.loadingMembers.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.loanForm.valid) {
      this.loading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      const loanData: LoanCreate = {
        book_id: Number(this.loanForm.value.book_id),
        member_id: Number(this.loanForm.value.member_id),
        due_date: this.loanForm.value.due_date || null
      };

      this.loanService.checkoutBook(loanData).subscribe({
        next: (loan) => {
          this.successMessage.set('Book checked out successfully!');
          this.loading.set(false);
          setTimeout(() => {
            this.router.navigate(['/loans']);
          }, 1500);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Failed to checkout book. Please try again.');
          this.loading.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/loans']);
  }
}
