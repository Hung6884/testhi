const httpStatus = require('http-status');

class ResponseDataSuccess {
  constructor(data, message) {
    this.status = httpStatus.OK;
    this.data = data || [];
    this.message = message || 'SUCCESS';
  }
}

module.exports = ResponseDataSuccess;
