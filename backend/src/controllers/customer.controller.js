'use strict';

const service = require('../services/customer.service');

exports.getList = async (req, res) => {
  try {
    const data = await service.getList(req.body || {}, req.headers || {});
    res.json(data);
  } catch (err) {
    console.error('Customer getList error:', err);
    res.status(500).json({ message: 'error' });
  }
};
