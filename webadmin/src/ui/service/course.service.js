import { request } from './request';

async function queryList(params = {}) {
  return request('/course', {
    params,
  });
}

async function queryAll(params = {}) {
  return request('/tcm/test-case-templates/employees', {
    params,
  });
}

async function createData(params = {}) {
  return request('/course', {
    method: 'POST',
    data: params,
  });
}

async function updateData(id, params) {
  return request(`/course/${id}`, {
    method: 'PUT',
    data: params,
  });
}

async function lockData(id) {
  return request(`/course/lock/${id}`, {
    method: 'patch',
  });
}

async function getById(id) {
  if (!id) return {};
  return request(`/course/${id}`);
}

async function unlockData(id) {
  return request(`/course/unlock/${id}`, {
    method: 'patch',
  });
}

export default {
  queryList,
  createData,
  updateData,
  lockData,
  getById,
  unlockData,
  queryAll,
};
