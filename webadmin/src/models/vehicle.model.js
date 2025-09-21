import { formatMessage } from 'umi';
import {
  vehicleService,
  licenseCategoryService,
  datDeviceService,
} from '../ui/service';

const initState = {
  tableData: {
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 20,
      showSizeChanger: true,
      showQuickJumper: true,
    },
  },
  modalResourceData: {},
  vehicleDetail: {},
  datDevices: [],
  selectedVehicleId: null,
};

const VehicleModel = {
  namespace: 'Vehicles',
  state: initState,
  effects: {
    *queryTableData({ payload = {} }, { call, put }) {
      try {
        const response = yield call(vehicleService.queryList, payload);
        const { rows = [], count = 0 } = response;

        yield put({
          type: 'setTableData',
          payload: {
            ...initState.tableData,
            list: rows,
            pagination: {
              ...initState.tableData.pagination,
              current: payload.page,
              pageSize: payload.pageSize,
              total: count,
            },
          },
        });

        return {
          ...initState.tableData,
          list: rows,
          pagination: {
            ...initState.tableData.pagination,
            current: payload.page,
            pageSize: payload.pageSize,
            total: count,
          },
        };
      } catch (error) {
        console.log('error', error);
        return false;
      }
    },
    *lockTableData({ payload }, { call, put }) {
      try {
        yield call(vehicleService.lockData, payload);
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'success',
            message: formatMessage({ id: 'app.global.success' }),
          },
        });
        return true;
      } catch (error) {
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'error',
            message: error.message
              ? error.message
              : formatMessage({
                  id: 'error.message.unknown',
                }),
          },
        });
        return false;
      }
    },
    *unlockRecord({ payload }, { call, put }) {
      try {
        yield call(vehicleService.unlockData, payload);
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'success',
            message: formatMessage({
              id: 'app.global.success',
            }),
          },
        });
        return true;
      } catch (error) {
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'error',
            message: error.message
              ? error.message
              : formatMessage({
                  id: 'error.message.unknown',
                }),
          },
        });
        return false;
      }
    },
    *createTableData({ payload }, { call, put }) {
      try {
        const response = yield call(vehicleService.createData, payload);
        if (response?.data?.message) {
          yield put({
            type: 'notification/createNotification',
            payload: {
              type: 'error',
              message:
                response.data.message ??
                formatMessage({ id: 'error.message.unknown' }),
            },
          });
          return false;
        }
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'success',
            message: formatMessage({
              id: 'vehicle.message.success.create',
            }),
          },
        });
        return true;
      } catch (error) {
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'error',
            message: error.message
              ? error.message
              : formatMessage({
                  id: 'error.message.unknown',
                }),
          },
        });

        return false;
      }
    },
    *updateTableData({ id, payload }, { call, put }) {
      try {
        yield call(vehicleService.updateData, id, payload);
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'success',
            message: formatMessage({
              id: 'vehicle.message.success.update',
            }),
          },
        });
        return true;
      } catch (error) {
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'error',
            message: error.message
              ? error.message
              : formatMessage({
                  id: 'error.message.unknown',
                }),
          },
        });
        return false;
      }
    },
    *deleteTableData({ payload }, { call, put }) {
      try {
        yield call(vehicleService.removeData, payload);
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'success',
            message: formatMessage({ id: 'vehicle.message.success.delete' }),
          },
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    *getModalResourceData({ payload }, { call, put }) {
      try {
        const response = yield call(vehicleService.getById, payload);
        const responseLicenseCategory = yield call(
          licenseCategoryService.queryList,
          payload,
        );

        yield put({
          type: 'setModalResourceData',
          payload: {
            vehicleData: response,
            licenseCategoryList: (responseLicenseCategory?.rows || []).map(
              (item) => ({
                label: item.code,
                value: item.code,
              }),
            ),
          },
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    *getDatDevices({ payload }, { call, put }) {
      try {
        const response = yield call(datDeviceService.queryList);
        yield put({
          type: 'setDatDevices',
          payload: response?.rows || [],
        });
        yield put({
          type: 'setSelectedVehicleId',
          payload: payload || null,
        });
        return response?.rows || [];
      } catch (error) {
        console.error('Error fetching unassigned DAT devices:', error);
        return [];
      }
    },
    *assignDatDeviceToVehicle({ deviceId, vehicleId }, { call, put }) {
      try {
        yield call(vehicleService.assignDat, deviceId, vehicleId);
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'success',
            message: formatMessage({
              id: 'vehicle.message.success.assignDat',
            }),
          },
        });
        return true;
      } catch (error) {
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'error',
            message: error.message
              ? error.message
              : formatMessage({
                  id: 'error.message.unknown',
                }),
          },
        });
        return false;
      }
    },
    *unAssignDatDeviceToVehicle({ id, payload }, { call, put }) {
      try {
        yield call(vehicleService.unAssignDatDeviceToVehicle, id, payload);
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'success',
            message: formatMessage({
              id: 'app.global.success',
            }),
          },
        });
        return true;
      } catch (error) {
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'error',
            message: error.message
              ? error.message
              : formatMessage({
                  id: 'error.message.unknown',
                }),
          },
        });
        return false;
      }
    },
  },
  reducers: {
    setTableData(state, { payload }) {
      return {
        ...state,
        tableData: payload,
      };
    },
    setModalResourceData(state, { payload }) {
      return {
        ...state,
        modalResourceData: payload,
      };
    },
    setVehicleDetail(state, { payload }) {
      return {
        ...state,
        vehicleDetail: payload,
      };
    },
    setDatDevices(state, { payload }) {
      return {
        ...state,
        datDevices: payload,
      };
    },
    setSelectedVehicleId(state, { payload }) {
      return {
        ...state,
        selectedVehicleId: payload,
      };
    },
  },
};

export default VehicleModel;
