const authService = require('./auth.service');
const syncDataService = require('./syncData.service');
const dbConnectionService = require('./dbConnection.service');
const initService = require('./init.service');
const tokenService = require('./token.service');
const teacherService = require('./teacher.service');
const courseService = require('./course.service');
const trainingCategoryService = require('./trainingCategory.service');
const administrationService = require('./administration.service');
const drivingLicenseCategoryService = require('./drivingLicenseCategory.service');
const trainingVehicleService = require('./trainingVehicle.service');
const datDeviceService = require('./datDevice.service');
const teachingSubjectService = require('./teachingSubject.service');
const educationalLevelService = require('./educationalLevel.service');
const rfCardService = require('./rfCard.service');
const studentService = require('./student.service');
const rollCallStudentService = require('./rollCallStudent.service');
module.exports = {
  authService,
  syncDataService,
  dbConnectionService,
  initService,
  tokenService,
  teacherService,
  courseService,
  trainingCategoryService,
  administrationService,
  drivingLicenseCategoryService,
  trainingVehicleService,
  datDeviceService,
  teachingSubjectService,
  educationalLevelService,
  rfCardService,
  studentService,
  rollCallStudentService,
};
