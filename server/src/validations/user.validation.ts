import Joi from 'joi';
import { GENDER, ROLE, USER_STATUS } from '../common/constants';
import { IUser } from '../interfaces/user/user.interface';

export const schemaUser = Joi.object<IUser, true>({
  password: Joi.string().min(6),
  firstName: Joi.string(),
  avatar: Joi.string().optional(),
  lastName: Joi.string(),
  gender: Joi.number().valid(...Object.values(GENDER)),
  dateOfBirth: Joi.date().raw(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }),
  status: Joi.number().valid(...Object.values(USER_STATUS)),
  role: Joi.number().valid(...Object.values(ROLE)),
});
