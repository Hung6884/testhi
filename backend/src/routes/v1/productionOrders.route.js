const express = require('express');
const ctrl = require('../../controllers/productionOrders.controller');


const router = express.Router();

router.post('/get-list', ctrl.getList);
router.post('/get-sumary-price', ctrl.sumaryPrice); 

module.exports = router;
