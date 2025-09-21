import { formatMessage } from 'umi';
import { courseService, trainingCategoryService } from '../ui/service';

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
};

const CourseModel = {
  namespace: 'Courses',
  state: initState,
  effects: {
    *queryTableData({ payload = {} }, { call, put }) {
      try {
        const response = yield call(courseService.queryList, payload);
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
        const response = yield call(courseService.createData, payload);
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
              id: 'course.message.success.create',
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
    *editTableData({ id, payload }, { call, put }) {
      try {
        yield call(courseService.updateData, id, payload);
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'success',
            message: formatMessage({
              id: 'course.message.success.update',
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
    *lockTableData({ payload }, { call, put }) {
      try {
        yield call(courseService.lockData, payload);
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
    *getModalResourceData({ payload }, { call, put }) {
      try {
        const response = yield call(courseService.getById, payload);
        const responseTrainingCategory = yield call(
          trainingCategoryService.queryList,
        );

        yield put({
          type: 'setModalResourceData',
          payload: {
            courseData: response,
            trainingCategoryList: (responseTrainingCategory?.rows || []).map(
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
    *unlockRecord({ payload }, { call, put }) {
      try {
        yield call(courseService.unlockData, payload);
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
    setModalResourceData(state, { payload }) {
      return {
        ...initState,
        ...state,
        modalResourceData: payload,
      };
    },
    setTableData(state, { payload }) {
      return {
        ...initState,
        ...state,
        tableData: payload,
      };
    },
    setCourseDetail(state, { payload }) {
      return {
        ...initState,
        ...state,
        courseDetail: payload,
      };
    },
  },
};

export default CourseModel;
