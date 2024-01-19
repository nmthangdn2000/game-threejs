import { Request, Response } from 'express';
import { CustomRequest } from '../interfaces/CustomResponse.interface';
import authService from '../services/auth.service';
import { responseError, responseSuccess, responseSuccessWithData } from './base.controller';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const data = await authService.login(req.body);
      return responseSuccessWithData(res, data);
    } catch (error: any) {
      console.log(error);
      return responseError(res, error.message);
    }
  }

  async register(req: Request, res: Response) {
    try {
      await authService.register(req.body);
      return responseSuccess(res, 'Register success');
    } catch (error: any) {
      console.log(error);
      return responseError(res, error.message);
    }
  }

  async changePassword(req: CustomRequest, res: Response) {
    try {
      await authService.changePassword(req.user?.uid, req.body.password);
      return responseSuccess(res, 'Change password success');
    } catch (error: any) {
      console.log(error);
      return responseError(res, error.message);
    }
  }
}
