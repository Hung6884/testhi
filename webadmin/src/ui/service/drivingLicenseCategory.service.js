import { request } from './request';

async function queryList(params = {}) {
  return request('/driving-license-category', {
    params,
  });
}

export default {
  queryList,
};
