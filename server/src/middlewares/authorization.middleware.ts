import { NextFunction, Request, Response } from 'express';
import appConfig from '../configs/appConfig';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../interfaces/CustomResponse.interface';
import { ROLE } from '../common/constants';
import { UserAuth } from '../interfaces/user/user-auth.interface';

export const auth = (role?: ROLE[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split('Bearer')[1].trim() || '';
      const decoded = jwt.verify(token, appConfig.jwt.KEY_SECRET_JWT) as UserAuth;

      if (role && role.length > 0 && !role.includes(decoded.role)) {
        return res.status(403).json({
          status: 403,
          message: 'Forbidden',
        });
      }

      req.user = decoded;
      next();
    } catch (error: any) {
      console.log(error.message);

      return res.status(403).json({
        status: 403,
        message: 'Authorization failed',
      });
    }
  };
};
