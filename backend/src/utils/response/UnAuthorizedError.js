const httpStatus = require('http-status');

class UnAuthorizedError {
  constructor(message) {
    this.status = httpStatus.UNAUTHORIZED;
    this.message = message || 'UNAUTHORIZED';
  }
}

module.exports = UnAuthorizedError;
