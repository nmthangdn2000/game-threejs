import { Document, Schema, model } from 'mongoose';
import { GENDER, ROLE, USER_STATUS } from '../common/constants';
import { IUser } from '../interfaces/user/user.interface';

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    gender: { type: Number, enum: GENDER, required: false },
    dateOfBirth: { type: String, required: false },
    status: { type: Number, enum: USER_STATUS, default: USER_STATUS.ACTIVE },
    role: { type: Number, enum: ROLE, default: ROLE.USER },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = model<IUserModel>('User', UserSchema);

export default UserModel;
