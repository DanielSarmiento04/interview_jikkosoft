/**
 * Represents a loan transaction (matches API LoanWithDetails schema).
 */
export interface Loan {
  id: number;
  book_id: number;
  member_id: number;
  checkout_date: string;
  due_date: string;
  return_date?: string | null;
  renewal_count: number;
  created_at: string;
  updated_at: string;
  book_title?: string | null;
  book_author?: string | null;
  member_name?: string | null;
  member_number?: string | null;
  is_overdue: boolean;
  days_overdue: number;
}

/**
 * Request payload for creating a loan (matches API LoanCreate schema).
 */
export interface LoanCreate {
  book_id: number;
  member_id: number;
  due_date?: string | null;
}

/**
 * Loan renewal response (matches API LoanRenewalResponse schema).
 */
export interface LoanRenewalResponse {
  id: number;
  new_due_date: string;
  renewal_count: number;
  message: string;
}

/**
 * Loan statistics (matches API LoanStatistics schema).
 */
export interface LoanStatistics {
  total_loans: number;
  active_loans: number;
  overdue_loans: number;
  completed_loans: number;
  total_renewals: number;
}

/**
 * Paginated loan list response (matches API LoanListResponse schema).
 */
export interface LoanListResponse {
  items: Loan[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}
