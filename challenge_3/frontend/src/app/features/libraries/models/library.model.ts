/**
 * Represents a library entity from the API
 */
export interface Library {
  id: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Data required to create a new library
 */
export interface LibraryCreate {
  name: string;
  address: string;
  phone?: string;
  email?: string;
}

/**
 * Data for updating a library
 */
export interface LibraryUpdate {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

/**
 * Response when listing libraries
 */
export interface LibraryListResponse {
  items: Library[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
