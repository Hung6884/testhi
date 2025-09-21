const express = require('express');
const rollCallStudentController = require('../../controllers/rollCallStudent.controller');

const router = express.Router();
router.get(
  '/get-by-date-vehicle-code',
  rollCallStudentController.findByDateAndVehicleCode,
);
router.get(
  '/get-by-vehicle-code',
  rollCallStudentController.findByVehicleCode,
);
module.exports = router;
