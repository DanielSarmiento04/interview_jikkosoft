import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MemberService } from '../services/member.service';
import { Member } from '../models/member.model';

@Component({
  selector: 'app-member-list',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  memberService = inject(MemberService);
  private router = inject(Router);

  searchQuery = signal('');
  statusFilter = signal<'all' | 'active' | 'suspended' | 'expired'>('all');

  ngOnInit(): void {
    this.memberService.loadMembers().subscribe();
  }

  filteredMembers = computed(() => {
    let members = this.memberService.members();

    if (this.statusFilter() !== 'all') {
      members = members.filter(member => member.status === this.statusFilter());
    }

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

  addNewMember(): void {
    this.router.navigate(['/members/new']);
  }

  editMember(id: number): void {
    this.router.navigate(['/members', id]);
  }
}
