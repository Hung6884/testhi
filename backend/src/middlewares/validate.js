const Joi = require('joi');
const httpStatus = require('http-status');
const pick = require('lodash/pick');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

const validate = (schema, options) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object, options);
  if (error) {
    if (req.file) {
      const filePath = path.join(req.file.destination, req.file.filename);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          logger.error(`Error deleting file: ${unlinkErr.message}`);
        } else {
          logger.info(`Deleted uploaded file: ${filePath}`);
        }
      });
    }
    const errorMessage = error.details.map((details) => details.message);
    return res.status(httpStatus.BAD_REQUEST).send({
      message: errorMessage,
    });
  }

  Object.assign(req, value);
  next();
};

module.exports = validate;
