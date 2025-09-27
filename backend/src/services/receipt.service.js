const receiptRepository = require('../repositories/receipt.repository');

exports.getList = async (params) => {
  return await receiptRepository.getList(params);
};
