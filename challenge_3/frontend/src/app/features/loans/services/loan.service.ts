import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Loan,
  LoanCreate,
  LoanRenewalResponse,
  LoanStatistics,
  LoanListResponse
} from '../models/loan.model';

/**
 * Service for managing loan-related operations.
 * Uses signals for reactive state management and HttpClient for API calls.
 */
@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/loans`;

  // Signal for storing all loans
  private loansSignal = signal<Loan[]>([]);

  // Signal for loan statistics
  private statisticsSignal = signal<LoanStatistics | null>(null);

  // Public readonly signals
  loans = this.loansSignal.asReadonly();
  statistics = this.statisticsSignal.asReadonly();

  // Computed signals
  totalLoans = computed(() => this.loansSignal().length);
  activeLoans = computed(() =>
    this.loansSignal().filter(loan => !loan.return_date).length
  );
  overdueLoans = computed(() =>
    this.loansSignal().filter(loan =>
      !loan.return_date && new Date(loan.due_date) < new Date()
    ).length
  );

  /**
   * Load all loans from the API
   */
  loadLoans(
    page: number = 1,
    size: number = 100,
    memberId?: number,
    bookId?: number,
    status?: 'active' | 'returned' | 'overdue'
  ): Observable<LoanListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (memberId !== undefined) {
      params = params.set('member_id', memberId.toString());
    }
    if (bookId !== undefined) {
      params = params.set('book_id', bookId.toString());
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<LoanListResponse>(this.apiUrl, { params }).pipe(
      tap(response => this.loansSignal.set(response.items))
    );
  }

  /**
   * Get a loan by ID
   */
  getLoanById(id: number): Observable<Loan> {
    return this.http.get<Loan>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new loan (checkout a book)
   */
  checkoutBook(loan: LoanCreate): Observable<Loan> {
    return this.http.post<Loan>(this.apiUrl, loan).pipe(
      tap(newLoan => {
        this.loansSignal.update(loans => [...loans, newLoan]);
      })
    );
  }

  /**
   * Return a book (mark loan as returned)
   */
  returnBook(loanId: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.apiUrl}/${loanId}/return`, {}).pipe(
      tap(returnedLoan => {
        this.loansSignal.update(loans =>
          loans.map(loan => loan.id === loanId ? returnedLoan : loan)
        );
      })
    );
  }

  /**
   * Renew a loan
   */
  renewLoan(loanId: number, days?: number): Observable<LoanRenewalResponse> {
    const body = days ? { days } : {};
    return this.http.post<LoanRenewalResponse>(`${this.apiUrl}/${loanId}/renew`, body).pipe(
      tap(response => {
        this.loansSignal.update(loans =>
          loans.map(loan =>
            loan.id === loanId
              ? {
                  ...loan,
                  due_date: response.new_due_date,
                  renewal_count: response.renewal_count
                }
              : loan
          )
        );
      })
    );
  }

  /**
   * Get loan statistics
   */
  loadStatistics(): Observable<LoanStatistics> {
    return this.http.get<LoanStatistics>(`${this.apiUrl}/statistics`).pipe(
      tap(stats => this.statisticsSignal.set(stats))
    );
  }

  /**
   * Get overdue loans
   */
  getOverdueLoans(page: number = 1, size: number = 100): Observable<LoanListResponse> {
    return this.loadLoans(page, size, undefined, undefined, 'overdue');
  }

  /**
   * Get active loans for a member
   */
  getMemberActiveLoans(memberId: number, page: number = 1, size: number = 100): Observable<LoanListResponse> {
    return this.loadLoans(page, size, memberId, undefined, 'active');
  }

  /**
   * Get all loans for a specific book
   */
  getBookLoans(bookId: number, page: number = 1, size: number = 100): Observable<LoanListResponse> {
    return this.loadLoans(page, size, undefined, bookId);
  }
}
