import { request } from './request';

async function accountLogin(params) {
  return request('/auth/login', {
    method: 'POST',
    data: params,
  });
}

async function accountRegister(params) {
  return request('/auth/register', {
    method: 'POST',
    data: params,
  });
}

export default {
  accountLogin,
  accountRegister,
};
