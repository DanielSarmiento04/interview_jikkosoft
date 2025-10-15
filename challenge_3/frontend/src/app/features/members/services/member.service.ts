import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Member, MemberCreate, MemberUpdate, MemberWithStats, MemberListResponse } from '../models/member.model';

/**
 * Service for managing member-related operations.
 * Uses signals for reactive state management and HttpClient for API calls.
 */
@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/members`;

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

  /**
   * Load all members from the API
   */
  loadMembers(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    status_filter?: string;
  }): Observable<MemberListResponse> {
    let httpParams = new HttpParams();

    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.page_size) httpParams = httpParams.set('page_size', params.page_size.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status_filter) httpParams = httpParams.set('status_filter', params.status_filter);

    return this.http.get<MemberListResponse>(`${this.apiUrl}/`, { params: httpParams }).pipe(
      tap(response => this.membersSignal.set(response.items))
    );
  }

  /**
   * Get a member by ID with statistics
   */
  getMemberById(id: number): Observable<MemberWithStats> {
    return this.http.get<MemberWithStats>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new member
   */
  createMember(member: MemberCreate): Observable<Member> {
    return this.http.post<Member>(`${this.apiUrl}/`, member).pipe(
      tap(newMember => this.membersSignal.update(members => [...members, newMember]))
    );
  }

  /**
   * Update an existing member
   */
  updateMember(id: number, updates: MemberUpdate): Observable<Member> {
    return this.http.put<Member>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(updatedMember => {
        this.membersSignal.update(members =>
          members.map(member => member.id === id ? updatedMember : member)
        );
      })
    );
  }

  /**
   * Delete a member
   */
  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.membersSignal.update(members => members.filter(member => member.id !== id));
      })
    );
  }

  /**
   * Suspend a member
   */
  suspendMember(id: number): Observable<Member> {
    return this.http.post<Member>(`${this.apiUrl}/${id}/suspend`, {});
  }

  /**
   * Activate a member
   */
  activateMember(id: number): Observable<Member> {
    return this.http.post<Member>(`${this.apiUrl}/${id}/activate`, {});
  }

  /**
   * Renew membership
   */
  renewMembership(id: number, months = 12): Observable<Member> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.post<Member>(`${this.apiUrl}/${id}/renew`, {}, { params });
  }

  /**
   * Search members (uses the load members with search parameter)
   */
  searchMembers(query: string): Observable<MemberListResponse> {
    return this.loadMembers({ search: query, page_size: 100 });
  }
}
