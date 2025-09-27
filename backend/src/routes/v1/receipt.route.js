const express = require('express');
const router = express.Router();
const receiptController = require('../../controllers/receipt.controller');

router.post('/get-list', receiptController.getList);

module.exports = router;
