import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const fileStorage = multer.diskStorage({
  destination: (request: Request, file: Express.Multer.File, cb: DestinationCallback): void => {
    cb(null, './public/files');
  },

  filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback): void => {
    const originalname = file.originalname.split('.');
    const fileName = Date.now() + '.' + originalname[originalname.length - 1];
    cb(null, fileName);
  },
});

const fileFilter = (request: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

export const uploadDiskStorage = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});
