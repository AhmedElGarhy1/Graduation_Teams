export interface PaginateResponse<T> {
  total: number;
  data: T[];
}
