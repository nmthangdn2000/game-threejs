import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { VALIDATION_TYPE } from '../common/constants';
import { removeFile } from '../services/base.service';

export const handleValidation = (
  schema: Joi.ObjectSchema,
  presence: Joi.PresenceMode,
  validateType: VALIDATION_TYPE
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data =
      validateType === VALIDATION_TYPE.BODY
        ? req.body
        : validateType === VALIDATION_TYPE.QUERY
        ? req.query
        : validateType === VALIDATION_TYPE.PARAMS
        ? req.params
        : req.headers;

    const { error }: Joi.ValidationResult = schema.options({ presence }).validate(data, { abortEarly: false });

    const valid = error == null;

    if (valid) return next();

    if (req.file) removeFile(req.file.filename);
    const message = error?.details.map((i) => i.message).join(', ');
    return res.status(422).json({ success: false, error: message });
  };
};

export const validation = {
  body: (schema: Joi.ObjectSchema, presence: Joi.PresenceMode = 'optional') => {
    return handleValidation(schema, presence, VALIDATION_TYPE.BODY);
  },
  query: (schema: Joi.ObjectSchema, presence: Joi.PresenceMode = 'optional') => {
    return handleValidation(schema, presence, VALIDATION_TYPE.QUERY);
  },
  params: (schema: Joi.ObjectSchema, presence: Joi.PresenceMode = 'optional') => {
    return handleValidation(schema, presence, VALIDATION_TYPE.PARAMS);
  },
  headers: (schema: Joi.ObjectSchema, presence: Joi.PresenceMode = 'optional') => {
    return handleValidation(schema, presence, VALIDATION_TYPE.HEADER);
  },
};
