const catchAsync = require('../utils/catchAsync');
const receiptService = require('../services/receipt.service');

exports.getList = catchAsync(async (req, res) => {
  const result = await receiptService.getList(req.body);
  res.json(result);
});
