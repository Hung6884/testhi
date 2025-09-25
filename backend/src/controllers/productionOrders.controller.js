const service = require('../services/productionOrders.service');
const catchAsync = require('../utils/catchAsync'); // file này đã có trong utils/response

exports.getList = catchAsync(async (req, res) => {
  const { count, list } = await service.getList(req.body || {});
  res.json({ count, list });
});
