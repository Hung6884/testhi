import { request } from './request';

async function queryList(params = {}) {
  return request('/dat-device', {
    params,
  });
}

async function getById(id) {
  if (!id) return {};
  return request(`/dat-device/${id}`);
}

async function createData(params = {}) {
  return request('/dat-device', {
    method: 'POST',
    data: params,
  });
}

async function updateData(id, params) {
  return request(`/dat-device/${id}`, {
    method: 'PUT',
    data: params,
  });
}

async function deleteData(id) {
  return request(`/dat-device/${id}`, {
    method: 'DELETE',
  });
}

async function getNotAssigned() {
  return request('/dat-device/device/get-not-assigned', {
    method: 'GET',
  });
}

export default {
  queryList,
  getById,
  createData,
  updateData,
  deleteData,
  getNotAssigned,
};
