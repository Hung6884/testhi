import { request } from './request';

async function queryCurrentUser() {
  return request('/user/info');
}

async function queryCurrentInfo() {
  return request('/user/get-current-user');
}

async function getPermissionByUserAPI(moduleName) {
  if (moduleName) {
    return request('/user/permissions-by-email', {
      method: 'POST',
      data: { moduleName },
    });
  }

  return {};
}

async function getUsers(params = {}) {
  const { page, per, searchParams, sorts } = params;
  return request('/user', {
    params: {
      page,
      per,
      ...searchParams,
      sorts,
    },
  });
}

export default {
  getPermissionByUserAPI,
  queryCurrentUser,
  queryCurrentInfo,
  getUsers,
};
