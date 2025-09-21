const express = require('express');

const router = express.Router();
const syncDataController = require('../../controllers/syncData.controller');

router.get('/courses', syncDataController.queryCourses);

router.get('/courses/:code/students', syncDataController.getStudentsByCourseCode);
router.post('/courses', syncDataController.syncCourses);

router.get('/teachers', syncDataController.queryTeachers);

router.post('/teachers', syncDataController.syncTeachers);

router.get('/training-vehicles', syncDataController.queryTrainingVehicles);

router.post('/training-vehicles', syncDataController.syncTrainingVehicles);

module.exports = router;
