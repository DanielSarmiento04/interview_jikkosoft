/**
 * Membership status type (matches API MembershipStatus enum).
 */
export type MembershipStatus = 'active' | 'suspended' | 'expired';

/**
 * Represents a library member (matches API MemberResponse schema).
 */
export interface Member {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  member_number: string;
  membership_date: string;
  membership_expiry?: string | null;
  status: MembershipStatus;
  max_loans: number;
  created_at: string;
  updated_at: string;
}

/**
 * Request payload for creating a new member (matches API MemberCreate schema).
 */
export interface MemberCreate {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  member_number?: string | null;
  max_loans?: number;
}

/**
 * Request payload for updating a member (matches API MemberUpdate schema).
 */
export interface MemberUpdate {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  max_loans?: number | null;
  status?: MembershipStatus | null;
}

/**
 * Member with statistics (matches API MemberWithStats schema).
 */
export interface MemberWithStats extends Member {
  active_loans_count: number;
  total_loans_count: number;
  has_overdue: boolean;
}

/**
 * Paginated member list response (matches API MemberListResponse schema).
 */
export interface MemberListResponse {
  items: Member[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}
