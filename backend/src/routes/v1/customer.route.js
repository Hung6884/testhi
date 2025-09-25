'use strict';

const express = require('express');
const ctrl = require('../controllers/customer.controller');
const router = express.Router();

router.post('/customers/get-list', ctrl.getList);

module.exports = router;
