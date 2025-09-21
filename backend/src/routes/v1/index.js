const express = require('express');
const authRoute = require('./auth.route');
const syncDataRoute = require('./syncData.route');
const dbConnectionRoute = require('./dbConnection.route');
const accountRoute = require('./account.route');
const teacherRoute = require('./teacher.route');
const courseRoute = require('./course.route');
const trainingCategoryRoute = require('./trainingCategory.route');
const administrationRoute = require('./administration.route');
const trainingVehicleRoute = require('./trainingVehicle.route');
const drivingLicenseCategoryRoute = require('./drivingLicenseCategory.route');
const datDeviceRoute = require('./datDevice.route');
const educationalLevelRoute = require('./educationalLevel.route');
const teachingSubjectRoute = require('./teachingSubject.route');
const rfCardRoute = require('./rfCard.route');
const studentRoute = require('./student.route');
const uploadRoute = require('./upload.route');
const rollCallStudentRoute = require('./rollCallStudent.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/db-connection',
    route: dbConnectionRoute,
  },
  {
    path: '/sync',
    route: syncDataRoute,
  },
  {
    path: '/account',
    route: accountRoute,
  },
  {
    path: '/teacher',
    route: teacherRoute,
  },
  {
    path: '/course',
    route: courseRoute,
  },
  {
    path: '/training-category',
    route: trainingCategoryRoute,
  },
  {
    path: '/administration',
    route: administrationRoute,
  },
  {
    path: '/driving-license-category',
    route: drivingLicenseCategoryRoute,
  },
  {
    path: '/training-vehicle',
    route: trainingVehicleRoute,
  },
  {
    path: '/dat-device',
    route: datDeviceRoute,
  },
  {
    path: '/educational-level',
    route: educationalLevelRoute,
  },
  {
    path: '/teaching-subject',
    route: teachingSubjectRoute,
  },
  {
    path: '/rf-card',
    route: rfCardRoute,
  },
  {
    path: '/student',
    route: studentRoute,
  },
  {
    path: '/upload',
    route: uploadRoute,
  },
  {
    path: '/roll-call-student',
    route: rollCallStudentRoute,
  },

  //   {
  //     path: '/role',
  //     route: roleRoute,
  //   },
  //   {
  //     path: '/permission',
  //     route: permissionRoute,
  //   },
  //   {
  //     path: '/',
  //     route: initRoute,
  //   },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
