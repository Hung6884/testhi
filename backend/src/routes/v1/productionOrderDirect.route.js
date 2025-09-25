// src/routes/productionOrderDirect.route.js
const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/productionOrderDirect.controller');

// POST /api/v1/production-orders-direct/get-list
router.post('/get-list', ctrl.getList);
router.post('/get-sumary-price', ctrl.sumaryPrice);

module.exports = router;