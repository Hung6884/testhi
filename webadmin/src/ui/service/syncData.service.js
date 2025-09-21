import { request } from './request';

async function queryCourses(params = {}) {
  return request('/sync/courses', {
    params,
  });
}

async function getStudentsByCourseCode(courseCode, params = {}) {
  return request(`/sync/courses/${courseCode}/students`,{
    params,
  });
}
async function syncCourses(data = []) {
  return request(`/sync/courses`, {
    method: 'POST',
    data,
  });
}
async function queryTeachers(params = {}) {
  return request('/sync/teachers', {
    params,
  });
}

async function syncTeachers(data = []) {
  return request(`/sync/teachers`, {
    method: 'POST',
    data,
  });
}

async function queryTrainingVehicles(params = {}) {
  return request('/sync/training-vehicles', {
    params,
  });
}

async function syncTrainingVehicles(data = []) {
  return request(`/sync/training-vehicles`, {
    method: 'POST',
    data,
  });
}

export default {
  queryCourses,
  getStudentsByCourseCode,
  syncCourses,
  queryTeachers,
  syncTeachers,
  queryTrainingVehicles,
  syncTrainingVehicles,
};
