import { request } from './request';

async function queryList(params = {}) {
  return request('/rf-card', {
    params,
  });
}
async function getRFCards() {
  return request('/rf-card/get-all');
}

async function getById(id) {
  if (!id) return {};
  return request(`/rf-card/${id}`);
}

async function createData(params = {}) {
  return request('/rf-card', {
    method: 'POST',
    data: params,
  });
}

async function updateData(id, params) {
  return request(`/rf-card/${id}`, {
    method: 'PUT',
    data: params,
  });
}

async function lockData(id) {
  return request(`/rf-card/lock/${id}`, {
    method: 'patch',
  });
}

async function unlockData(id) {
  return request(`/rf-card/unlock/${id}`, {
    method: 'patch',
  });
}

/* async function getRFCardsUnassigned() {
  return request('/rf-card/student/get-unassigned', {
    method: 'GET',
  });
} */

export default {
  queryList,
  getById,
  createData,
  updateData,
  lockData,
  unlockData,
  getRFCards,
  //getRFCardsUnassigned,
};
