import jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { ROLE, USER_STATUS } from '../common/constants';
import hashPassword from '../common/hashPassword';
import appConfig from '../configs/appConfig';
import { IUser } from '../interfaces/user/user.interface';
import UserModel, { IUserModel } from '../models/user.model';

class AuthService {
  private userModel: Model<IUserModel> = UserModel;

  async login(data: IUser) {
    const user = await this.userModel.findOne({ email: data.email }).select('+password').lean();
    if (!user) throw new Error('Email does not exist');

    if (user.status === USER_STATUS.BLOCK) throw new Error('Account has been locked');

    const password = hashPassword.sha512(`${data.email}${data.password}`);
    if (password !== user.password) throw new Error('Incorrect password');

    const payload = { uid: user._id, role: user.role };

    const token = jwt.sign(payload, appConfig.jwt.KEY_SECRET_JWT, { expiresIn: appConfig.jwt.EXPIRES_IN });

    delete user.password;

    return {
      ...user,
      token,
    };
  }

  async register(data: IUser) {
    const existingUser = await this.userModel.findOne({ email: data.email }).lean();
    if (existingUser) throw new Error('Email already exists');

    data.password = hashPassword.sha512(`${data.email}${data.password}`);
    data.status = USER_STATUS.ACTIVE;
    data.role = ROLE.USER;

    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async changePassword(id?: string, password?: string) {
    const existingUser = await this.userModel.findById(id).lean();
    if (!existingUser) throw new Error('User does not exist');

    password = hashPassword.sha512(`${existingUser.email}${password}`);

    return this.userModel.findByIdAndUpdate(id, { password, updateAt: new Date() });
  }
}

export default new AuthService();
