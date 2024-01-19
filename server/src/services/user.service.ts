import { FilterQuery, Model } from 'mongoose';
import { ReadableStreamDefaultReader } from 'stream/web';
import { LIMIT, ROLE } from '../common/constants';
import hashPassword from '../common/hashPassword';
import { UserAuth } from '../interfaces/user/user-auth.interface';
import { UserFilter } from '../interfaces/user/user-filter.interfcae';
import { IUser } from '../interfaces/user/user.interface';
import UserModel, { IUserModel } from '../models/user.model';
import { pagination, removeFile } from './base.service';

class UserService {
  private userModel: Model<IUserModel> = UserModel;

  async getAll(filter: UserFilter) {
    const { page = 1, limit = LIMIT, fullname } = filter;
    const query: FilterQuery<IUserModel> = fullname ? { fullname: { $regex: fullname, $options: 'i' } } : {};

    const countDocument = this.userModel.countDocuments(query);
    const getUsers = this.userModel
      .find(query)
      .skip(page * limit - limit)
      .sort({ createdAt: -1 })
      .limit(limit);

    const [total, users] = await Promise.all([countDocument, getUsers]);

    return {
      totalPage: pagination(total, limit),
      currentPage: page,
      data: users,
    };
  }

  async getById(id?: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new Error('user does not exist');
    return user;
  }

  async updateById(id?: string, data?: IUser, file?: string) {
    const user = await this.userModel.findById(id).lean();
    if (!user) throw new Error('Can not update user');

    let avatar = user.avatar;
    if (file) avatar = `files/${file}`;

    console.log(file);
    console.log(avatar);

    const update = await this.userModel.findByIdAndUpdate(
      id,
      { ...data, avatar, updatedAt: new Date() },
      { new: true }
    );

    if (file && user.avatar) removeFile(user.avatar);

    return update;
  }

  async updateProfile(data?: IUser, userAuth?: UserAuth, file?: string) {
    const user = await this.userModel.findById(userAuth?.uid).lean();
    if (!user) throw new Error('Can not update user');
    let avatar = user.avatar;

    if (file) avatar = `files/${file}`;

    if (userAuth?.role === ROLE.USER) delete data?.role;

    if (data?.password) data.password = hashPassword.sha512(`${user.email}${data?.password}`);

    const update = await this.userModel.findByIdAndUpdate(
      user._id,
      { ...data, avatar, updatedAt: new Date() },
      { new: true }
    );

    if (file && user.avatar) removeFile(user.avatar);

    return update;
  }

  async deleteById(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new Error('Can not delete user');
    return user;
  }
}

export default new UserService();
