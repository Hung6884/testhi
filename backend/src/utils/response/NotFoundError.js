const httpStatus = require('http-status');

class NotFoundError {
  constructor(message) {
    this.status = httpStatus.NOT_FOUND;
    this.message = message || 'NOT_FOUND';
  }
}

module.exports = NotFoundError;
