import Joi from 'joi';
import { joiError } from './joi.util';

/**
 * 判断是否是外链
 * @param {string} path
 * @returns {Boolean}
 * @author LiQingSong
 */
export const isExternal = (path) => {
  return /^(https?:|mailto:|tel:)/.test(path);
};

export function joiValidate(
  schema,
  data,
  options = {
    abortEarly: true,
    allowUnknown: true,
  },
) {
  if (Joi.isSchema(schema)) {
    const { error } = schema.validate(data, options);

    if (error) {
      throw joiError(error);
    }
  }
}

export const convertMonth = (month) => {
  return month < 10 ? `0${month}` : `${month}`;
};
