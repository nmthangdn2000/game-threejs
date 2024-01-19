import Joi from 'joi';
import { UserFilter } from '../interfaces/user/user-filter.interfcae';
import { JoiObj } from './custom.validation';

export const schemaProductFilter = Joi.object<UserFilter, true>().keys({
  fullname: JoiObj.string().objectId(),
  page: Joi.number().min(0),
  limit: Joi.number().min(0),
});
