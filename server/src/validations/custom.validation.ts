import Joi from 'joi';
import * as mongodb from 'mongodb';

interface ExtendedStringSchema extends Joi.StringSchema {
  objectId(): this;
}

interface ExtendedJoi extends Joi.Root {
  string(): ExtendedStringSchema;
}

const stringObjectExtension: Joi.Extension = {
  type: 'string',
  base: Joi.string(),
  messages: {
    'string.objectId': '{{#label}} must be a valid mongo id',
  },
  rules: {
    objectId: {
      validate: (value: any, helpers) => {
        if (!mongodb.ObjectId.isValid(value)) {
          return helpers.error('string.objectId');
        }

        return value;
      },
    },
  },
};

export const JoiObj: ExtendedJoi = Joi.extend(stringObjectExtension);
