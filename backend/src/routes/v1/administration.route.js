const express = require('express');
const administrationController = require('../../controllers/administration.controller');

const router = express.Router();

router.get('/', administrationController.search);

module.exports = router;
