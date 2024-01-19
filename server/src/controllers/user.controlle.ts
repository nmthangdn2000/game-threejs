import { Request, Response } from 'express';
import { CustomRequest } from '../interfaces/CustomResponse.interface';
import { removeFile } from '../services/base.service';
import userService from '../services/user.service';
import { responseError, responseSuccess, responseSuccessWithData } from './base.controller';

export class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const data = await userService.getAll(req.query);
      return responseSuccessWithData(res, data);
    } catch (error: any) {
      console.log(error);
      return responseError(res, error.message);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const data = await userService.getById(req.params.id);
      return responseSuccessWithData(res, data);
    } catch (error: any) {
      console.log(error);
      return responseError(res, error.message);
    }
  }

  async getProfile(req: CustomRequest, res: Response) {
    try {
      const data = await userService.getById(req.user?.uid);
      return responseSuccessWithData(res, data);
    } catch (error: any) {
      console.log(error);
      return responseError(res, error.message);
    }
  }

  async updateById(req: CustomRequest, res: Response) {
    try {
      const data = await userService.updateById(req.params.id, req.body, req.file?.filename);
      return responseSuccessWithData(res, data);
    } catch (error: any) {
      console.log(error);
      if (req.file?.filename) removeFile(req.file.filename);
      return responseError(res, error.message);
    }
  }

  async updateProfile(req: CustomRequest, res: Response) {
    try {
      const data = await userService.updateProfile(req.body, req.user, req.file?.filename);
      return responseSuccessWithData(res, data);
    } catch (error: any) {
      console.log(error);
      if (req.file?.filename) removeFile(req.file.filename);
      return responseError(res, error.message);
    }
  }

  async deleteById(req: Request, res: Response) {
    try {
      await userService.deleteById(req.params.id);
      return responseSuccess(res, 'Delete user success');
    } catch (error: any) {
      console.log(error);
      return responseError(res, error.message);
    }
  }
}
