const express = require('express');
const ctrl = require('../../controllers/productionOrders.controller');


const router = express.Router();

router.post('/get-list', ctrl.getList);   // <-- phải là function

module.exports = router;
