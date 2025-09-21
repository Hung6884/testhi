import { request } from './request';

async function queryList(params = {}) {
  return request('/teaching-subject', {
    params,
  });
}

export default {
  queryList,
};
