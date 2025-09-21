import { request } from './request';

async function queryList(params = {}) {
  return request('/student', {
    params,
  });
}

async function createData(params = {}) {
  return request('/student', {
    method: 'POST',
    data: params,
  });
}

async function updateData(id, params) {
  return request(`/student/${id}`, {
    method: 'PUT',
    data: params,
  });
}

async function lockData(id) {
  return request(`/student/lock/${id}`, {
    method: 'patch',
  });
}

async function unlockData(id) {
  return request(`/student/unlock/${id}`, {
    method: 'patch',
  });
}

async function getById(id) {
  if (!id) return {};
  return request(`/student/${id}`);
}

async function assignRFCard(rfCardId, studentId) {
  return request(`/student/rf-card/assign/${studentId}`, {
    method: 'PATCH',
    data: { rfCardId },
  });
}

async function unAssignRFCard(id, params) {
  return request(`/student/rf-card/unassign/${id}`, {
    method: 'put',
    data: params,
  });
}

export default {
  queryList,
  createData,
  updateData,
  lockData,
  unlockData,
  getById,
  assignRFCard,
  unAssignRFCard,
};
