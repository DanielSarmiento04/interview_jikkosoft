import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoanService } from '../services/loan.service';

/**
 * Component for displaying and managing loans.
 * Shows active loans, overdue loans, and allows checkout/return operations.
 */
@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})
export class LoanListComponent implements OnInit {
  loanService = inject(LoanService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadLoans();
    this.loadStatistics();
  }

  loadLoans(): void {
    this.loanService.loadLoans().subscribe({
      error: (err) => console.error('Failed to load loans:', err)
    });
  }

  loadStatistics(): void {
    this.loanService.loadStatistics().subscribe({
      error: (err) => console.error('Failed to load statistics:', err)
    });
  }

  returnBook(loanId: number): void {
    if (confirm('Are you sure you want to return this book?')) {
      this.loanService.returnBook(loanId).subscribe({
        next: () => {
          console.log('Book returned successfully');
          this.loadLoans();
          this.loadStatistics();
        },
        error: (err) => console.error('Failed to return book:', err)
      });
    }
  }

  renewLoan(loanId: number, currentRenewals: number): void {
    // Check if already at max renewals
    if (currentRenewals >= 2) {
      alert('❌ Cannot renew this loan.\n\nThis loan has already been renewed the maximum number of times (2).\nThe book must be returned and checked out again if needed.');
      return;
    }

    const remainingRenewals = 2 - currentRenewals;
    const confirmMessage = `Renew this loan?\n\nCurrent renewals: ${currentRenewals}/2\nRemaining renewals: ${remainingRenewals}`;

    if (confirm(confirmMessage)) {
      this.loanService.renewLoan(loanId).subscribe({
        next: (response) => {
          alert(`✅ Loan renewed successfully!\n\n${response.message}\nNew due date: ${new Date(response.new_due_date).toLocaleDateString()}\nTotal renewals: ${response.renewal_count}/2`);
          this.loadLoans();
        },
        error: (err) => {
          const errorMsg = err.error?.detail || err.error?.message || 'Failed to renew loan';
          if (errorMsg.includes('maximum') || errorMsg.includes('twice') || err.status === 400) {
            alert('❌ Cannot renew this loan.\n\nThis loan has already been renewed the maximum number of times (2).\nThe book must be returned and checked out again if needed.');
          } else {
            alert(`❌ Failed to renew loan\n\n${errorMsg}`);
          }
          console.error('Failed to renew loan:', err);
          this.loadLoans(); // Refresh to get updated data
        }
      });
    }
  }

  checkoutNewBook(): void {
    this.router.navigate(['/loans/new']);
  }
}
