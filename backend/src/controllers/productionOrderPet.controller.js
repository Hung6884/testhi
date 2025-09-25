const service = require('../services/productionOrderPet.service');

exports.getList = async (req, res) => {
  try {
    const result = await service.getList(req.body || {}, req.headers);
    res.json(result);
  } catch (err) {
    console.error('PET getList error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.sumaryPrice = async (req, res) => {
  try {
    const result = await service.getSumPrice(req.body || {}, req.headers);
    res.json(result);
  } catch (err) {
    console.error('PET sumaryPrice error:', err.message);
    res.status(500).json({ message: err.message });
  }
};
