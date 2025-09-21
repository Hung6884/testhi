import { request } from './request';

async function queryList(params = {}) {
  return request('/teacher', {
    params,
  });
}

async function getById(id) {
  if (!id) return {};
  return request(`/teacher/${id}`);
}

async function createData(params = {}) {
  return request('/teacher', {
    method: 'POST',
    data: params,
  });
}

async function updateData(id, params) {
  return request(`/teacher/${id}`, {
    method: 'PUT',
    data: params,
  });
}

async function lockData(id) {
  return request(`/teacher/lock/${id}`, {
    method: 'patch',
  });
}

async function unlockData(id) {
  return request(`/teacher/unlock/${id}`, {
    method: 'patch',
  });
}

async function unAssignRFCard(id, params) {
  return request(`/teacher/rf-card/unassign/${id}`, {
    method: 'put',
    data: params,
  });
}

async function assignRFCard(rfCardId, teacherId) {
  return request(`/teacher/rf-card/assign/${teacherId}`, {
    method: 'PATCH',
    data: { rfCardId },
  });
}

/* async function queryAll(params = {}) {
  return request('/tcm/test-case-templates/employees', {
    params,
  });
}

async function removeData(id) {
  return request(`/hrm/employee/${id}`, {
    method: 'delete',
  });
}

async function activateRecordById(id) {
  return request(`/hrm/employee/${id}`, {
    method: 'patch',
  });
} */

export default {
  queryList,
  getById,
  createData,
  updateData,
  lockData,
  unlockData,
  unAssignRFCard,
  assignRFCard,
};
