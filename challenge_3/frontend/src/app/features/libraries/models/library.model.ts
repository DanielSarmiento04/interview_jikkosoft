/**
 * Represents a library entity.
 */
export interface Library {
  id?: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  books: number[]; // Array of Book IDs
  members: number[]; // Array of Member IDs
  createdAt?: Date;
  updatedAt?: Date;
}
