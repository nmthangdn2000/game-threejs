import { Request } from 'express';
import { UserAuth } from './user/user-auth.interface';
export interface CustomRequest extends Request {
  user?: UserAuth;
}
