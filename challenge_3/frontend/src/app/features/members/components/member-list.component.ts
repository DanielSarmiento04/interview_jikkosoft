import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberService } from '../services/member.service';
import { Member } from '../models/member.model';

/**
 * Component for displaying and managing the list of members.
 * Uses signals for reactive state management.
 */
@Component({
  selector: 'app-member-list',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="member-list-container">
      <header class="page-header">
        <h1>Library Members</h1>
        <div class="header-actions">
          <input
            type="text"
            placeholder="Search members..."
            [value]="searchQuery()"
            (input)="onSearchChange($event)"
            class="search-input"
          />
          <select
            [value]="statusFilter()"
            (change)="onStatusFilterChange($event)"
            class="status-filter"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </header>

      <div class="stats">
        <div class="stat-card">
          <span class="stat-label">Total Members</span>
          <span class="stat-value">{{ memberService.totalMembers() }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Active</span>
          <span class="stat-value">{{ memberService.activeMembers().length }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Suspended</span>
          <span class="stat-value">{{ memberService.suspendedMembers().length }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Filtered Results</span>
          <span class="stat-value">{{ filteredMembers().length }}</span>
        </div>
      </div>

      @if (filteredMembers().length === 0) {
        <div class="empty-state">
          <p>No members found matching your criteria.</p>
        </div>
      } @else {
        <div class="members-grid">
          @for (member of filteredMembers(); track member.id) {
            <div class="member-card">
              <div class="member-header">
                <h3 class="member-name">{{ member.name }}</h3>
                <span
                  class="status-badge"
                  [class.active]="member.status === 'active'"
                  [class.suspended]="member.status === 'suspended'"
                  [class.expired]="member.status === 'expired'"
                >
                  {{ member.status }}
                </span>
              </div>

              <div class="member-details">
                <div class="detail-item">
                  <span class="icon">✉️</span>
                  <span>{{ member.email }}</span>
                </div>

                @if (member.phone) {
                  <div class="detail-item">
                    <span class="icon">📞</span>
                    <span>{{ member.phone }}</span>
                  </div>
                }

                @if (member.address) {
                  <div class="detail-item">
                    <span class="icon">📍</span>
                    <span>{{ member.address }}</span>
                  </div>
                }
              </div>

              <div class="member-info">
                <div class="info-item">
                  <span class="info-label">Member Number</span>
                  <span class="info-value">{{ member.member_number }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Membership Date</span>
                  <span class="info-value">{{ member.membership_date | date:'mediumDate' }}</span>
                </div>
                @if (member.membership_expiry) {
                  <div class="info-item">
                    <span class="info-label">Expiry Date</span>
                    <span class="info-value">{{ member.membership_expiry | date:'mediumDate' }}</span>
                  </div>
                }
                <div class="info-item">
                  <span class="info-label">Max Loans</span>
                  <span class="info-value">{{ member.max_loans }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .member-list-container {
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

    .status-filter {
      padding: 0.75rem 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      background-color: white;
      cursor: pointer;
    }

    .status-filter:focus {
      outline: none;
      border-color: #4a90e2;
      box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
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

    .members-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .member-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .member-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .member-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .member-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
      flex: 1;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .status-badge.active {
      background-color: #d4edda;
      color: #155724;
    }

    .status-badge.suspended {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-badge.expired {
      background-color: #f8d7da;
      color: #721c24;
    }

    .member-details {
      margin-bottom: 1rem;
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

    .member-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }

    .info-label {
      color: #666;
      font-weight: 500;
    }

    .info-value {
      color: #1a1a1a;
      font-weight: 600;
    }
  `]
})
export class MemberListComponent implements OnInit {
  memberService = inject(MemberService);

  searchQuery = signal('');
  statusFilter = signal<'all' | 'active' | 'suspended' | 'expired'>('all');

  ngOnInit(): void {
    // Load members from the API on component initialization
    this.memberService.loadMembers().subscribe();
  }

  // Computed signal for filtered members
  filteredMembers = computed(() => {
    let members = this.memberService.members();

    // Filter by status if not 'all'
    if (this.statusFilter() !== 'all') {
      members = members.filter(member => member.status === this.statusFilter());
    }

    // Filter by search query
    const query = this.searchQuery().toLowerCase();
    if (query) {
      members = members.filter(member =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
      );
    }

    return members;
  });

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  onStatusFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statusFilter.set(select.value as 'all' | 'active' | 'suspended' | 'expired');
  }
}
