import { request } from './request';

async function queryList(params = {}) {
  return request('/training-category', {
    params,
  });
}

export default {
  queryList,
};
