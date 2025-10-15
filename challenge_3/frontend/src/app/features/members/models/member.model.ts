/**
 * Represents a library member.
 */
export interface Member {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  membershipDate: Date;
  membershipExpiry?: Date;
  status: 'active' | 'suspended' | 'expired';
  maxLoans: number;
  createdAt?: Date;
  updatedAt?: Date;
}
