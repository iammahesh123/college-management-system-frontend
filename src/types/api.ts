export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  code?: string;
  data: T;
  fieldErrors?: string[];
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
