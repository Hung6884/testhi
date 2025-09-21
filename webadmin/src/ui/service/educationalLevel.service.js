import { request } from './request';

async function queryList(params = {}) {
  return request('/educational-level', {
    params,
  });
}

export default {
  queryList,
};
