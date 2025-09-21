import { request } from './request';

async function queryList(params = {}) {
  return request('/training-vehicle', {
    params,
  });
}

async function getById(id) {
  if (!id) return {};
  return request(`/training-vehicle/${id}`);
}

async function lockData(id) {
  return request(`/training-vehicle/lock/${id}`, {
    method: 'patch',
  });
}

async function unlockData(id) {
  return request(`/training-vehicle/unlock/${id}`, {
    method: 'patch',
  });
}

async function createData(params = {}) {
  return request('/training-vehicle', {
    method: 'POST',
    data: params,
  });
}

async function updateData(id, params) {
  return request(`/training-vehicle/${id}`, {
    method: 'PUT',
    data: params,
  });
}

async function assignDat(deviceId, vehicleId, datDeviceSerial) {
  return request(`/training-vehicle/assign/${vehicleId}`, {
    method: 'PATCH',
    data: { deviceId, datDeviceSerial },
  });
}

async function unAssignDatDeviceToVehicle(id, params) {
  return request(`/training-vehicle/unassign/${id}`, {
    method: 'put',
    data: params,
  });
}

export default {
  queryList,
  getById,
  lockData,
  unlockData,
  createData,
  updateData,
  assignDat,
  unAssignDatDeviceToVehicle,
};
