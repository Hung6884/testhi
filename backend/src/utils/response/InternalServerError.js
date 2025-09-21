const httpStatus = require('http-status');

class InternalServerError {
  constructor(message) {
    this.status = httpStatus.INTERNAL_SERVER_ERROR;
    this.message = message || 'INTERNAL_SERVER_ERROR';
  }
}

module.exports = InternalServerError;
