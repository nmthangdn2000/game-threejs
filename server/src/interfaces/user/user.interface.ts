import { ROLE, USER_STATUS, GENDER } from '../../common/constants';

export interface IUser {
  email: string;
  password?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  gender?: GENDER;
  dateOfBirth?: Date;
  status?: USER_STATUS;
  role?: ROLE;
}
