// src/controllers/productionOrderDirect.controller.js
const service = require('../services/productionOrderDirect.service');

exports.getList = async (req, res) => {
  try {
    const data = await service.getList(req.body || {});
    return res.json(data);
  } catch (err) {
    console.error('DIRECT getList error:', err);
    return res.status(500).json({ message: err?.message || 'Error' });
  }
};
exports.sumaryPrice = async (req, res) => {
  try {
    const total = await service.getSumPrice(req.body, req.headers);
    res.json(total);
  } catch (e) {
    console.error('Direct sumaryPrice error:', e);
    res.status(500).json({ message: 'error' });
  }
};