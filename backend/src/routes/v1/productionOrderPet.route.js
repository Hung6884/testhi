const express = require('express');
const ctrl = require('../../controllers/productionOrderPet.controller');
const catchAsync = require('../../utils/catchAsync');

const router = express.Router();

// POST /production-order-pets/get-list
router.post('/get-list', catchAsync(ctrl.getList));
router.post('/get-sumary-price', ctrl.sumaryPrice);


module.exports = router;
