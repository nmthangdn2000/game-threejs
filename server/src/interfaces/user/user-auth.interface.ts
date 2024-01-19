import { ROLE } from '../../common/constants';

export interface UserAuth extends Request {
  uid: string;
  role: ROLE;
}
