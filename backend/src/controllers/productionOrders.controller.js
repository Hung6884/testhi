const service = require('../services/productionOrders.service');
const catchAsync = require('../utils/catchAsync'); // file này đã có trong utils/response

exports.getList = catchAsync(async (req, res) => {
  const { count, list } = await service.getList(req.body || {});
  res.json({ count, list });
});


exports.sumaryPrice = async (req, res) => {
  try {
    const total = await service.getSumPrice(req.body || {});
    // trả về số thuần (FE của bạn đang expect số)
    res.json(total);
  } catch (e) {
    console.error('ProductionOrders sumaryPrice error:', e);
    res.status(500).json({ message: 'Internal error' });
  }
};
