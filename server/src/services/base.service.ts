import { unlinkSync } from 'fs';

const pagination = (total: number, limit: number): number => {
  return Math.ceil(total / limit);
};

const removeFile = (filename: string) => {
  try {
    if (filename.split('/')[0] !== 'files') filename = `files/${filename}`;
    unlinkSync(`./public/${filename}`);
    console.log(`successfully deleted /public/${filename}`);
  } catch (err: any) {
    console.log(err.message);
  }
};

export { pagination, removeFile };
