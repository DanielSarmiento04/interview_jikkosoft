import { Injectable, signal, computed } from '@angular/core';
import { Member } from '../models/member.model';

/**
 * Service for managing member-related operations.
 * Uses signals for reactive state management.
 */
@Injectable({
  providedIn: 'root'
})
export class MemberService {
  // Signal for storing all members
  private membersSignal = signal<Member[]>([]);
  
  // Public readonly signal
  members = this.membersSignal.asReadonly();
  
  // Computed signal for active members
  activeMembers = computed(() => 
    this.membersSignal().filter(member => member.status === 'active')
  );
  
  // Computed signal for suspended members
  suspendedMembers = computed(() => 
    this.membersSignal().filter(member => member.status === 'suspended')
  );
  
  // Computed signal for total members count
  totalMembers = computed(() => this.membersSignal().length);

  constructor() {
    // Initialize with mock data
    this.initializeMockData();
  }

  /**
   * Initialize with mock data for demonstration
   */
  private initializeMockData(): void {
    const mockMembers: Member[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-1000',
        address: '789 Reader Lane, Bookville',
        membershipDate: new Date('2024-01-15'),
        membershipExpiry: new Date('2025-01-15'),
        status: 'active',
        maxLoans: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1-555-2000',
        address: '321 Scholar Street, Readington',
        membershipDate: new Date('2024-03-20'),
        membershipExpiry: new Date('2025-03-20'),
        status: 'active',
        maxLoans: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        phone: '+1-555-3000',
        address: '654 Library Road, Pageville',
        membershipDate: new Date('2023-12-01'),
        membershipExpiry: new Date('2024-12-01'),
        status: 'expired',
        maxLoans: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    this.membersSignal.set(mockMembers);
  }

  /**
   * Get a member by ID
   */
  getMemberById(id: number): Member | undefined {
    return this.membersSignal().find(member => member.id === id);
  }

  /**
   * Get a member by email
   */
  getMemberByEmail(email: string): Member | undefined {
    return this.membersSignal().find(member => member.email === email);
  }

  /**
   * Add a new member
   */
  addMember(member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Member {
    const newMember: Member = {
      ...member,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.membersSignal.update(members => [...members, newMember]);
    return newMember;
  }

  /**
   * Update an existing member
   */
  updateMember(id: number, updates: Partial<Member>): Member | undefined {
    const index = this.membersSignal().findIndex(member => member.id === id);
    
    if (index === -1) return undefined;
    
    this.membersSignal.update(members => {
      const updatedMembers = [...members];
      updatedMembers[index] = {
        ...updatedMembers[index],
        ...updates,
        updatedAt: new Date()
      };
      return updatedMembers;
    });
    
    return this.membersSignal()[index];
  }

  /**
   * Delete a member
   */
  deleteMember(id: number): boolean {
    const initialLength = this.membersSignal().length;
    this.membersSignal.update(members => members.filter(member => member.id !== id));
    return this.membersSignal().length < initialLength;
  }

  /**
   * Update member status
   */
  updateMemberStatus(id: number, status: 'active' | 'suspended' | 'expired'): Member | undefined {
    return this.updateMember(id, { status });
  }

  /**
   * Suspend a member
   */
  suspendMember(id: number): Member | undefined {
    return this.updateMemberStatus(id, 'suspended');
  }

  /**
   * Activate a member
   */
  activateMember(id: number): Member | undefined {
    return this.updateMemberStatus(id, 'active');
  }

  /**
   * Renew membership
   */
  renewMembership(id: number, expiryDate: Date): Member | undefined {
    return this.updateMember(id, { 
      membershipExpiry: expiryDate,
      status: 'active'
    });
  }

  /**
   * Search members by name or email
   */
  searchMembers(query: string): Member[] {
    const lowerQuery = query.toLowerCase();
    return this.membersSignal().filter(member =>
      member.name.toLowerCase().includes(lowerQuery) ||
      member.email.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Generate a unique ID for new members
   */
  private generateId(): number {
    const maxId = Math.max(0, ...this.membersSignal().map(member => member.id || 0));
    return maxId + 1;
  }
}
