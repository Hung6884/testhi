const express = require('express');

const router = express.Router();
const dbConnectionController = require('../../controllers/dbConnection.controller');

router.get('/', dbConnectionController.getDbConnection);

module.exports = router;
