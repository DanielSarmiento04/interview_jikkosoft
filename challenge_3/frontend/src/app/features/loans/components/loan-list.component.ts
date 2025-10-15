import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from '../services/loan.service';

/**
 * Component for displaying and managing loans.
 * Shows active loans, overdue loans, and allows checkout/return operations.
 */
@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loan-list-container">
      <div class="header">
        <div class="title-section">
          <span class="icon">📚</span>
          <h2>Loan Management</h2>
        </div>
        <p class="subtitle">Track and manage all book loans in your library</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>{{ loanService.totalLoans() }}</h3>
            <p>Total Loans</p>
          </div>
        </div>
        <div class="stat-card active">
          <div class="stat-icon">📖</div>
          <div class="stat-content">
            <h3>{{ loanService.activeLoans() }}</h3>
            <p>Active Loans</p>
          </div>
        </div>
        <div class="stat-card overdue">
          <div class="stat-icon">⚠️</div>
          <div class="stat-content">
            <h3>{{ loanService.overdueLoans() }}</h3>
            <p>Overdue Loans</p>
          </div>
        </div>
        @if (loanService.statistics(); as stats) {
          <div class="stat-card completed">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <h3>{{ stats.completed_loans }}</h3>
              <p>Completed</p>
            </div>
          </div>
        }
      </div>

      <div class="loans-section">
        <div class="section-header">
          <h3>📋 All Loans</h3>
          <div class="filters">
            <button class="filter-btn active">All</button>
            <button class="filter-btn">Active</button>
            <button class="filter-btn">Overdue</button>
            <button class="filter-btn">Returned</button>
          </div>
        </div>

        @if (loanService.loans().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📚</div>
            <h3>No loans found</h3>
            <p>Start by checking out a book to your members!</p>
          </div>
        } @else {
          <div class="loans-grid">
            @for (loan of loanService.loans(); track loan.id) {
              <div class="loan-card" [class.overdue]="loan.is_overdue" [class.returned]="loan.return_date">
                <div class="loan-header">
                  <div class="book-info">
                    <span class="book-icon">📖</span>
                    <h4>{{ loan.book_title || 'Book #' + loan.book_id }}</h4>
                  </div>
                  @if (loan.return_date) {
                    <span class="badge returned">✓ Returned</span>
                  } @else if (loan.is_overdue) {
                    <span class="badge overdue">⚠ Overdue</span>
                  } @else {
                    <span class="badge active">● Active</span>
                  }
                </div>

                <div class="loan-meta">
                  <div class="meta-item">
                    <span class="meta-icon">👤</span>
                    <div>
                      <small>Member</small>
                      <p>{{ loan.member_name || loan.member_number || 'ID: ' + loan.member_id }}</p>
                    </div>
                  </div>
                  <div class="meta-item">
                    <span class="meta-icon">✍️</span>
                    <div>
                      <small>Author</small>
                      <p>{{ loan.book_author || 'N/A' }}</p>
                    </div>
                  </div>
                </div>

                <div class="loan-timeline">
                  <div class="timeline-item">
                    <span class="timeline-icon checkout">📤</span>
                    <div>
                      <small>Checkout</small>
                      <p>{{ loan.checkout_date | date:'MMM d, y' }}</p>
                    </div>
                  </div>
                  <div class="timeline-divider"></div>
                  <div class="timeline-item">
                    <span class="timeline-icon due" [class.overdue]="loan.is_overdue">📅</span>
                    <div>
                      <small>Due Date</small>
                      <p [class.text-danger]="loan.is_overdue">{{ loan.due_date | date:'MMM d, y' }}</p>
                    </div>
                  </div>
                  @if (loan.return_date) {
                    <div class="timeline-divider"></div>
                    <div class="timeline-item">
                      <span class="timeline-icon returned">📥</span>
                      <div>
                        <small>Returned</small>
                        <p>{{ loan.return_date | date:'MMM d, y' }}</p>
                      </div>
                    </div>
                  }
                </div>

                @if (loan.is_overdue && !loan.return_date) {
                  <div class="overdue-alert">
                    <span class="alert-icon">⚠️</span>
                    <span><strong>{{ loan.days_overdue }}</strong> {{ loan.days_overdue === 1 ? 'day' : 'days' }} overdue</span>
                  </div>
                }

                <div class="loan-footer">
                  <div class="renewal-info">
                    <span class="renewal-icon">🔄</span>
                    <span>Renewed {{ loan.renewal_count }}x</span>
                  </div>
                  @if (!loan.return_date) {
                    <div class="loan-actions">
                      <button class="btn btn-secondary" (click)="renewLoan(loan.id)" title="Renew loan">
                        <span>🔄</span> Renew
                      </button>
                      <button class="btn btn-primary" (click)="returnBook(loan.id)" title="Return book">
                        <span>✓</span> Return
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .loan-list-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .header {
      margin-bottom: 2.5rem;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .title-section .icon {
      font-size: 2.5rem;
    }

    .header h2 {
      color: #1a237e;
      font-size: 2.25rem;
      margin: 0;
      font-weight: 700;
    }

    .subtitle {
      color: #666;
      font-size: 1rem;
      margin: 0;
      padding-left: 3.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      padding: 1.75rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-left: 4px solid;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      opacity: 0.1;
      transform: translate(30%, -30%);
    }

    .stat-card.total {
      border-left-color: #667eea;
    }

    .stat-card.total::before {
      background: #667eea;
    }

    .stat-card.active {
      border-left-color: #4caf50;
    }

    .stat-card.active::before {
      background: #4caf50;
    }

    .stat-card.overdue {
      border-left-color: #f44336;
    }

    .stat-card.overdue::before {
      background: #f44336;
    }

    .stat-card.completed {
      border-left-color: #2196f3;
    }

    .stat-card.completed::before {
      background: #2196f3;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .stat-icon {
      font-size: 2.5rem;
      line-height: 1;
    }

    .stat-content h3 {
      font-size: 2.25rem;
      margin: 0;
      color: #1a237e;
      font-weight: 700;
    }

    .stat-content p {
      margin: 0.25rem 0 0 0;
      color: #666;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .loans-section {
      margin-top: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .section-header h3 {
      color: #1a237e;
      font-size: 1.5rem;
      margin: 0;
      font-weight: 600;
    }

    .filters {
      display: flex;
      gap: 0.5rem;
      background: #f5f5f5;
      padding: 0.25rem;
      border-radius: 8px;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
      border: none;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: #666;
      transition: all 0.2s;
    }

    .filter-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .filter-btn.active {
      background: white;
      color: #1976d2;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      color: #333;
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }

    .empty-state p {
      color: #666;
      margin: 0;
      font-size: 1rem;
    }

    .loans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 1.5rem;
    }

    .loan-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid transparent;
      position: relative;
    }

    .loan-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .loan-card.overdue {
      border-color: #f44336;
      background: linear-gradient(to bottom, #fff5f5 0%, white 100%);
    }

    .loan-card.returned {
      opacity: 0.7;
      background: linear-gradient(to bottom, #f5f5f5 0%, white 100%);
    }

    .loan-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f0f0f0;
    }

    .book-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
    }

    .book-icon {
      font-size: 1.5rem;
    }

    .loan-header h4 {
      margin: 0;
      color: #1a237e;
      font-size: 1.125rem;
      font-weight: 600;
      line-height: 1.4;
    }

    .badge {
      padding: 0.375rem 0.875rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
      letter-spacing: 0.5px;
    }

    .badge.active {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .badge.overdue {
      background: #ffebee;
      color: #c62828;
    }

    .badge.returned {
      background: #e3f2fd;
      color: #1565c0;
    }

    .loan-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .meta-icon {
      font-size: 1.25rem;
    }

    .meta-item small {
      display: block;
      color: #999;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25rem;
    }

    .meta-item p {
      margin: 0;
      color: #333;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .loan-timeline {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .timeline-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
    }

    .timeline-icon {
      font-size: 1.25rem;
    }

    .timeline-icon.overdue {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .timeline-item small {
      display: block;
      color: #999;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .timeline-item p {
      margin: 0;
      color: #333;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .text-danger {
      color: #f44336 !important;
      font-weight: 600;
    }

    .timeline-divider {
      width: 24px;
      height: 2px;
      background: linear-gradient(to right, #ddd 0%, #ddd 50%, transparent 50%);
      background-size: 8px 2px;
    }

    .overdue-alert {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem;
      background: #ffebee;
      border-left: 4px solid #f44336;
      border-radius: 8px;
      margin-bottom: 1rem;
      color: #c62828;
      font-size: 0.9rem;
    }

    .alert-icon {
      font-size: 1.25rem;
    }

    .loan-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #f0f0f0;
    }

    .renewal-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.875rem;
    }

    .renewal-icon {
      font-size: 1rem;
    }

    .loan-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.625rem 1.25rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn:active {
      transform: scale(0.98);
    }

    .btn-primary {
      background: #1976d2;
      color: white;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
    }

    .btn-primary:hover {
      background: #1565c0;
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #333;
      border: 1px solid #e0e0e0;
    }

    .btn-secondary:hover {
      background: #eeeeee;
      border-color: #bdbdbd;
    }

    @media (max-width: 768px) {
      .loans-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .filters {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class LoanListComponent implements OnInit {
  loanService = inject(LoanService);

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

  renewLoan(loanId: number): void {
    this.loanService.renewLoan(loanId).subscribe({
      next: (response) => {
        console.log('Loan renewed:', response.message);
        this.loadLoans();
      },
      error: (err) => console.error('Failed to renew loan:', err)
    });
  }
}
