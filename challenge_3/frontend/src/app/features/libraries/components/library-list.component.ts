import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryService } from '../services/library.service';
import { Library } from '../models/library.model';

/**
 * Component for displaying and managing the list of libraries.
 * Uses signals for reactive state management.
 */
@Component({
  selector: 'app-library-list',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="library-list-container">
      <header class="page-header">
        <h1>Libraries</h1>
      </header>

      <div class="stats">
        <div class="stat-card">
          <span class="stat-label">Total Libraries</span>
          <span class="stat-value">{{ libraryService.totalLibraries() }}</span>
        </div>
      </div>

      @if (libraryService.libraries().length === 0) {
        <div class="empty-state">
          <p>No libraries available.</p>
        </div>
      } @else {
        <div class="libraries-grid">
          @for (library of libraryService.libraries(); track library.id) {
            <div class="library-card">
              <div class="library-header">
                <h3 class="library-name">{{ library.name }}</h3>
              </div>

              <div class="library-details">
                <div class="detail-item">
                  <span class="icon">📍</span>
                  <span>{{ library.address }}</span>
                </div>

                @if (library.phone) {
                  <div class="detail-item">
                    <span class="icon">📞</span>
                    <span>{{ library.phone }}</span>
                  </div>
                }

                @if (library.email) {
                  <div class="detail-item">
                    <span class="icon">✉️</span>
                    <span>{{ library.email }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .library-list-container {
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
      color: #1a1a1a;
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

    .libraries-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .library-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .library-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .library-header {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .library-name {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    .library-details {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      color: #333;
    }

    .icon {
      font-size: 1.25rem;
    }

    .library-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #4a90e2;
    }

    .stat-text {
      font-size: 0.75rem;
      color: #666;
      text-transform: uppercase;
      font-weight: 500;
    }
  `]
})
export class LibraryListComponent implements OnInit {
  libraryService = inject(LibraryService);

  ngOnInit(): void {
    // Load libraries from the API on component initialization
    this.libraryService.loadLibraries().subscribe();
  }
}
