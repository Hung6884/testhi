import { request } from './request';

async function queryList(params = {}) {
  return request('/administration', {
    params,
  });
}

export default {
  queryList,
};
