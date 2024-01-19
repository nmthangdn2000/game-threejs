import { Model } from 'mongoose';
import { IRestaurant } from '../interfaces/restaurant/restaurant.interface';
import RestaurantModel, { IRestaurantModel } from '../models/restaurant.model';
import { pagination, removeFile } from './base.service';

class RestaurantService {
  private restaurantModel: Model<IRestaurantModel> = RestaurantModel;

  async getAll() {
    return this.restaurantModel.find();
  }

  async getById(id: string) {
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) throw new Error('Restaurant does not exist');
    return restaurant;
  }

  async create(data: IRestaurant, image?: string) {
    data.image = `files/${image}`;
    const newRestaurant = new this.restaurantModel(data);
    return newRestaurant.save();
  }

  async updateById(id: string, data: IRestaurant, image?: string) {
    if (image) data.image = `files/${image}`;

    const restaurant = await this.restaurantModel.findByIdAndUpdate(id, { ...data, updatedAt: new Date() });
    if (!restaurant) throw new Error('Can not update restaurant');

    if (image && restaurant.image) removeFile(restaurant.image);

    return restaurant;
  }

  async deleteById(id: string) {
    const restaurant = await this.restaurantModel.findByIdAndDelete(id);
    if (!restaurant) throw new Error('Can not delete restaurant');
    if (restaurant.image) removeFile(restaurant.image);
    return restaurant;
  }
}

export default new RestaurantService();
