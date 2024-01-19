import { FilterQuery, Model, ObjectId, Types } from 'mongoose';
import { LIMIT, ORDER_STATUS, ROLE } from '../common/constants';
import { OrderFilter } from '../interfaces/order/order-filter.interface';
import { IOrder } from '../interfaces/order/order.interface';
import { UserAuth } from '../interfaces/user/user-auth.interface';
import OrderModel, { IOrderModel } from '../models/order.model';
import { IProductModel } from '../models/product.model';
import { pagination } from './base.service';

class OrderService {
  private orderModel: Model<IOrderModel> = OrderModel;

  async getAll(filter: OrderFilter) {
    const { page = 1, limit = LIMIT, from, orderStatus, productId, to, userId, sortBy } = filter;
    const where: FilterQuery<IProductModel>[] = [];

    if (from) where.push({ createdAt: { $gte: from } });

    if (to) where.push({ createdAt: { $lte: to } });

    if (orderStatus) where.push({ orderStatus });

    if (productId && Types.ObjectId.isValid(productId)) {
      where.push({ 'products.productId': new Types.ObjectId(productId) });
    }

    if (userId && Types.ObjectId.isValid(userId)) {
      where.push({ userId: new Types.ObjectId(userId) });
    }

    const query: FilterQuery<IProductModel> = where.length > 0 ? { $and: where } : {};

    const countDocument = this.orderModel.countDocuments(query);
    const getOrder = this.orderModel
      .find(query)
      .populate('userId', '-createdAt -updatedAt')
      .populate({
        path: 'products.productId',
        select: '-createdAt -updatedAt',
        populate: {
          path: 'restaurant',
          select: '-createdAt -updatedAt',
        },
      })
      .skip(page * limit - limit)
      .sort({ createdAt: -1 })
      .limit(limit);

    const [total, orders] = await Promise.all([countDocument, getOrder]);

    return {
      totalPage: pagination(total, limit),
      currentPage: page,
      data: orders,
    };
  }

  async getById(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('userId', '-createdAt -updatedAt')
      .populate({
        path: 'products.productId',
        select: '-createdAt -updatedAt',
        populate: {
          path: 'restaurant',
          select: '-createdAt -updatedAt',
        },
      });

    if (!order) throw new Error('Order does not exist');
    return order;
  }

  async getByUser(userId?: string) {
    return this.orderModel
      .find({ userId })
      .populate('userId', '-createdAt -updatedAt')
      .populate({
        path: 'products.productId',
        select: '-createdAt -updatedAt',
        populate: {
          path: 'restaurant',
          select: '-createdAt -updatedAt',
        },
      });
  }

  async create(data: IOrder, user?: UserAuth) {
    data.orderStatus = ORDER_STATUS.PENDDING;
    data.userId = user?.uid;

    const neworder = new this.orderModel(data);
    return neworder.save();
  }

  async updateById(id: string, data: IOrder, user?: UserAuth) {
    if (user?.role !== ROLE.ADMIN) delete data.orderStatus;
    const query = user?.role === ROLE.ADMIN ? { _id: id } : { _id: id, userId: user?.uid };

    const order = await this.orderModel.findOneAndUpdate(query, { ...data, updatedAt: new Date() });
    if (!order) throw new Error('Can not update order');
    return order;
  }

  async deleteById(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id);
    if (!order) throw new Error('Can not delete order');
    return order;
  }
}

export default new OrderService();
