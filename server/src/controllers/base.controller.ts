import { Response } from 'express';

const responseSuccess = (res: Response, message: string = 'Success') => {
  res.status(200).json({
    success: true,
    message,
  });
};

const responseSuccessWithData = (res: Response, data?: any, message: string = 'Success') => {
  res.status(200).json({
    success: true,
    message,
    data,
  });
};

const responseError = (res: Response, message: string) => {
  return res.status(200).json({
    success: false,
    message,
  });
};

export { responseSuccess, responseSuccessWithData, responseError };
