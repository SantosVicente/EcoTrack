export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}
