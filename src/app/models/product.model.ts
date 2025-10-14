export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  category?: string | null;
  imageUrl?: string | null;
}

export interface ProductQuery {
  search?: string | null;
  category?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  page?: number;      // 1-based
  pageSize?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortDir?: 'asc' | 'desc';
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
