import { Pagination } from '../pagtination.interface';

export interface UserFilter extends Pagination {
  fullname?: string;
}
