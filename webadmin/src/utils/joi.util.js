import isArray from 'lodash/isArray';
import join from 'lodash/join';
import keys from 'lodash/keys';

class ValidationError extends Error {
  constructor(message = 'Validation failed') {
    super(message);
    this.details = new Map();
  }
}

export function joiError(error) {
  const details = {};
  if (error && isArray(error.details)) {
    for (const joiError of error.details) {
      const keyPath = join(joiError.path, '.');
      if (!keyPath) {
        continue;
      }
      details[keyPath] = {
        ...joiError.context,
        message: joiError.message,
      };
    }
  }
  return { error: keys(details).length > 0 ? details : null };
}

joiError.create = (errorPath, message = 'Validation failed') => {
  const errorKey = errorPath
    .split(/[[\]]{1,2}/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .join('.');
  const column = new Map();
  column.set('key', errorKey);
  column.set('path', errorKey.split('.'));
  column.set('message', message);

  const _error = new ValidationError();
  _error.details.set(errorKey, Object.fromEntries(column));

  // eslint-disable-next-line no-unused-vars
  return { ..._error, details: Array.from(_error.details, ([_, v]) => v) };
};
