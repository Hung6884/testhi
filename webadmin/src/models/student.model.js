import { formatMessage } from 'umi';
import {
  studentService,
  administrationService,
  trainingCategoryService,
  courseService,
  rfCardService,
  licenseCategoryService,
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
  rfCards: [],
  selectedStudentId: null,
};

const StudentModel = {
  namespace: 'Students',
  state: initState,
  effects: {
    *queryTableData({ payload = {} }, { call, put }) {
      try {
        const response = yield call(studentService.queryList, payload);
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
        const response = yield call(studentService.createData, payload);
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
    *updateTableData({ id, payload }, { call, put }) {
      try {
        yield call(studentService.updateData, id, payload);
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
    *lockTableData({ payload }, { call, put }) {
      try {
        yield call(studentService.lockData, payload);
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
        yield call(studentService.unlockData, payload);
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
    *getModalResourceData({ payload }, { call, put }) {
      try {
        const response = yield call(studentService.getById, payload);
        const responseAdministration = yield call(
          administrationService.queryList,
        );
        const trainingCategories = yield call(
          trainingCategoryService.queryList,
        );
        const responseLicenseCategory = yield call(
          licenseCategoryService.queryList,
          payload,
        );
        const courses = yield call(courseService.queryList);

        yield put({
          type: 'setModalResourceData',
          payload: {
            studentData: response,
            trainingCategoryList: (trainingCategories?.rows || []).map(
              (item) => ({
                label: item.name,
                value: item.code,
              }),
            ),
            licenseCategoryList: (responseLicenseCategory?.rows || []).map(
              (item) => ({
                label: item.name,
                value: item.code,
              }),
            ),
            courses: (courses?.rows || []).map((item) => ({
              label: item.name,
              value: item.name,
            })),
            administrationList: (responseAdministration?.rows || []).map(
              (item) => ({
                label: item.fullName,
                value: item.id,
              }),
            ),
          },
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    *getRFCards({ payload }, { call, put }) {
      try {
        const response = yield call(rfCardService.getRFCards);
        yield put({
          type: 'setRFCards',
          payload: response,
        });
        yield put({
          type: 'setSelectedStudentId',
          payload: payload || null,
        });
        return response;
      } catch (error) {
        console.error('Error fetching unassigned RF Cards for student:', error);
        return [];
      }
    },
    *assignRFCard({ rfCardId, studentId }, { call, put }) {
      try {
        yield call(studentService.assignRFCard, rfCardId, studentId);
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
    *unAssignRFCard({ studentId, payload }, { call, put }) {
      try {
        yield call(studentService.unAssignRFCard, studentId, payload);
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
    setRFCards(state, { payload }) {
      return {
        ...state,
        rfCards: payload,
      };
    },
    setSelectedStudentId(state, { payload }) {
      return {
        ...state,
        selectedStudentId: payload,
      };
    },
    setTableData(state, { payload }) {
      return {
        ...initState,
        ...state,
        tableData: payload,
      };
    },
  },
};

export default StudentModel;
