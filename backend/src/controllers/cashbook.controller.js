const svc = require('../services/cashbook.service');

exports.getList = async (req, res) => {
  try {
    const data = await svc.getList(req.body || {});
    return res.json(data);
  } catch (e) {
    console.error('Cashbook getList error:', e);
    return res.status(500).json({ message: 'Error' });
  }
};

exports.getTotal = async (req, res) => {
  try {
    const data = await svc.getTotal(req.body || {});
    return res.json(data);
  } catch (e) {
    console.error('Cashbook getTotal error:', e);
    return res.status(500).json({ message: 'Error' });
  }
};
