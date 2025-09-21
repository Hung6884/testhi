const httpStatus = require('http-status');
const { syncDataService } = require('../services');

const queryCourses = async (req, res) => {
  const data = await syncDataService.queryCourses();
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const getStudentsByCourseCode = async (req, res) => {
  const data = await syncDataService.getStudentsByCourseCode(req.params.code, req.query?.csdtCode);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const syncCourses = async (req, res) => {
  const data = await syncDataService.syncCourses(req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const queryTeachers = async (req, res) => {
  const data = await syncDataService.queryTeachers();
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const syncTeachers = async (req, res) => {
  const data = await syncDataService.syncTeachers(req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const queryTrainingVehicles = async (req, res) => {
  const data = await syncDataService.queryTrainingVehicles();
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const syncTrainingVehicles = async (req, res) => {
  const data = await syncDataService.syncTrainingVehicles(req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

module.exports = {
  queryCourses,
  getStudentsByCourseCode,
  syncCourses,
  queryTeachers,
  syncTeachers,
  queryTrainingVehicles,
  syncTrainingVehicles,
};
