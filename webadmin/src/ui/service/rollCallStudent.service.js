import { request } from './request';

async function findByDateAndVehicleCode(params) {
  return request('/roll-call-student/get-by-date-vehicle-code', {
    params,
  });
}
async function findByVehicleCode(params) {
  return request('/roll-call-student/get-by-vehicle-code', {
    params,
  });
}

export default {
  findByDateAndVehicleCode,
  findByVehicleCode
};
