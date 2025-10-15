import { Component, inject, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../books/services/book.service';
import { LibraryService } from '../../libraries/services/library.service';
import { MemberService } from '../../members/services/member.service';

/**
 * Dashboard component showing overview statistics.
 * Uses signals for reactive state management.
 */
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-container">
      <header class="page-header">
        <h1>Library Management Dashboard</h1>
        <p class="subtitle">Welcome to your library management system</p>
      </header>

      <div class="stats-grid">
        <div class="stat-card books">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>Total Books</h3>
            <p class="stat-number">{{ bookService.totalBooks() }}</p>
            <p class="stat-detail">{{ bookService.availableBooks().length }} available</p>
          </div>
          <a routerLink="/books" class="stat-link">View Books →</a>
        </div>

        <div class="stat-card libraries">
          <div class="stat-icon">🏛️</div>
          <div class="stat-content">
            <h3>Libraries</h3>
            <p class="stat-number">{{ libraryService.totalLibraries() }}</p>
            <p class="stat-detail">Active locations</p>
          </div>
          <a routerLink="/libraries" class="stat-link">View Libraries →</a>
        </div>

        <div class="stat-card members">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Members</h3>
            <p class="stat-number">{{ memberService.totalMembers() }}</p>
            <p class="stat-detail">{{ memberService.activeMembers().length }} active</p>
          </div>
          <a routerLink="/members" class="stat-link">View Members →</a>
        </div>

        <div class="stat-card availability">
          <div class="stat-icon">✓</div>
          <div class="stat-content">
            <h3>Availability Rate</h3>
            <p class="stat-number">{{ availabilityRate() }}%</p>
            <p class="stat-detail">Books available now</p>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <a routerLink="/books" class="action-card">
            <span class="action-icon">📖</span>
            <span class="action-text">Browse Books</span>
          </a>
          <a routerLink="/libraries" class="action-card">
            <span class="action-icon">🏛️</span>
            <span class="action-text">View Libraries</span>
          </a>
          <a routerLink="/members" class="action-card">
            <span class="action-icon">👤</span>
            <span class="action-text">Manage Members</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 3rem;
      text-align: center;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-size: 1.125rem;
      color: #666;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .stat-card.books {
      border-top: 4px solid #4a90e2;
    }

    .stat-card.libraries {
      border-top: 4px solid #50c878;
    }

    .stat-card.members {
      border-top: 4px solid #f39c12;
    }

    .stat-card.availability {
      border-top: 4px solid #9b59b6;
    }

    .stat-icon {
      font-size: 3rem;
    }

    .stat-content h3 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0.5rem 0;
    }

    .stat-detail {
      font-size: 0.875rem;
      color: #666;
      margin: 0;
    }

    .stat-link {
      color: #4a90e2;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.875rem;
      transition: color 0.2s;
      margin-top: auto;
    }

    .stat-link:hover {
      color: #357abd;
    }

    .quick-actions {
      margin-top: 3rem;
    }

    .quick-actions h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 1.5rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
      color: #1a1a1a;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .action-icon {
      font-size: 2rem;
    }

    .action-text {
      font-weight: 600;
      font-size: 1rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  bookService = inject(BookService);
  libraryService = inject(LibraryService);
  memberService = inject(MemberService);

  ngOnInit(): void {
    // Load all data from the API on component initialization
    this.bookService.loadBooks().subscribe();
    this.libraryService.loadLibraries().subscribe();
    this.memberService.loadMembers().subscribe();
  }

  // Computed signal for availability rate
  availabilityRate = computed(() => {
    const total = this.bookService.totalBooks();
    if (total === 0) return 0;
    
    const available = this.bookService.availableBooks().length;
    return Math.round((available / total) * 100);
  });
}
