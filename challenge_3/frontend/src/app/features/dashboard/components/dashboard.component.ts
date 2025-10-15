import { Component, inject, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../books/services/book.service';
import { MemberService } from '../../members/services/member.service';
import { LoanService } from '../../loans/services/loan.service';

/**
 * Dashboard component showing overview statistics.
 * Uses signals for reactive state management.
 */
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  bookService = inject(BookService);
  memberService = inject(MemberService);
  loanService = inject(LoanService);

  ngOnInit(): void {
    // Load all data from the API on component initialization
    this.bookService.loadBooks().subscribe();
    this.memberService.loadMembers().subscribe();
    this.loanService.loadLoans().subscribe();
    this.loanService.loadStatistics().subscribe();
  }

  // Computed signal for availability rate
  availabilityRate = computed(() => {
    const total = this.bookService.totalBooks();
    if (total === 0) return 0;

    const available = this.bookService.availableBooks().length;
    return Math.round((available / total) * 100);
  });
}
