import { formatMessage } from 'umi';
import { datDeviceService } from '../ui/service';

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
  datDeviceDetail: {},
};

const DatDeviceModel = {
  namespace: 'DatDevices',
  state: initState,
  effects: {
    *queryTableData({ payload = {} }, { call, put }) {
      try {
        const response = yield call(datDeviceService.queryList, payload);
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
    *createTableData({ payload }, { call, put }) {
      try {
        const response = yield call(datDeviceService.createData, payload);
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
              id: 'datDevice.message.success.create',
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
        yield call(datDeviceService.updateData, id, payload);
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'success',
            message: formatMessage({
              id: 'datDevice.message.success.update',
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
    *deleteTableData({ id }, { call, put }) {
      try {
        yield call(datDeviceService.deleteData, id);
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'success',
            message: formatMessage({
              id: 'datDevice.message.success.delete',
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
    *getModalResourceData({ payload }, { call, put }) {
      try {
        const response = yield call(datDeviceService.getById, payload);

        yield put({
          type: 'setModalResourceData',
          payload: {
            datDeviceData: response,
          },
        });
        return true;
      } catch (error) {
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
  },
};

export default DatDeviceModel;
