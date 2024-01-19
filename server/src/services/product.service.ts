import { Model, FilterQuery, Types } from 'mongoose';
import { LIMIT, SORT_BY } from '../common/constants';
import { ProductFilter } from '../interfaces/product/product-filter.interface';
import { IProduct } from '../interfaces/product/product.interface';
import ProductModel, { IProductModel } from '../models/product.model';
import { pagination, removeFile } from './base.service';

class ProductService {
  private productModel: Model<IProductModel> = ProductModel;

  async getAll(filter: ProductFilter) {
    const { page = 1, limit = LIMIT, minPrice, maxPrice, name, sortBy, restaurant, status } = filter;
    const where: FilterQuery<IProductModel>[] = [{ isDelete: false }];

    if (minPrice) where.push({ unitPrice: { $gte: minPrice } });

    if (maxPrice) where.push({ unitPrice: { $lte: maxPrice } });

    if (name) where.push({ name: { $regex: name, $options: 'i' } });

    if (status) where.push({ status });

    if (restaurant && Types.ObjectId.isValid(restaurant)) {
      where.push({ restaurant: new Types.ObjectId(restaurant) });
    }

    const query: FilterQuery<IProductModel> = where.length > 0 ? { $and: where } : {};

    const sort: any =
      sortBy == SORT_BY.HIGHT_TO_LOW
        ? { unitPrice: -1 }
        : sortBy == SORT_BY.LOW_TO_HIGHT
        ? { unitPrice: 1 }
        : sortBy == SORT_BY.NEWST
        ? { createdAt: -1 }
        : {};

    const countDocument = this.productModel.countDocuments(query);
    const getProduct = this.productModel
      .find(query)
      .populate('restaurant', '-createdAt -updatedAt')
      .skip(page * limit - limit)
      .sort(sort)
      .limit(limit);

    const [total, products] = await Promise.all([countDocument, getProduct]);

    return {
      totalPage: pagination(total, limit),
      currentPage: page,
      data: products,
    };
  }

  async getById(id: string) {
    const product = await this.productModel.findById(id).populate('restaurant', '-createdAt -updatedAt');
    if (!product) throw new Error('Product does not exist');
    return product;
  }

  async create(data: IProduct, image?: string) {
    data.image = `files/${image}`;
    const newProduct = new this.productModel(data);
    return newProduct.save();
  }

  async updateById(id: string, data: IProduct, image?: string) {
    if (image) data.image = `files/${image}`;

    const product = await this.productModel.findByIdAndUpdate(id, {
      ...data,
      updatedAt: new Date(),
    });
    if (!product) throw new Error('Can not update product');

    if (image && product.image) removeFile(product.image);

    return product;
  }

  async deleteById(id: string) {
    const product = await this.productModel.findByIdAndUpdate(id, { isDelete: true, updatedAt: new Date() });
    if (!product) throw new Error('Can not delete product');
    if (product.image) removeFile(product.image);
    return product;
  }
}

export default new ProductService();
