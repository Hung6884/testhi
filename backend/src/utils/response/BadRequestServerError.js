const httpStatus = require('http-status');

class BadRequestServerError {
  constructor(message) {
    this.status = httpStatus.BAD_REQUEST;
    this.message = message || 'BAD_REQUEST';
  }
}

module.exports = BadRequestServerError;
