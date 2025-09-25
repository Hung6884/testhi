const express = require('express');
const router = express.Router();
const controller = require('../../controllers/cashbook.controller');

// GET LIST
router.post('/get-list', controller.getList);

// GET TOTAL
router.post('/get-totals', controller.getTotal);

module.exports = router;
