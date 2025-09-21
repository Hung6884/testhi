import { formatMessage } from 'umi';
import {
  teacherService,
  licenseCategoryService,
  educationalLevelService,
  rfCardService,
} from '../ui/service';

const initState = {
  allData: {
    list: [],
  },
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
  teacherDetail: {},
  rfCards: [],
  selectedTeacherId: null,
};

const TeacherModel = {
  namespace: 'Teachers',
  state: initState,
  effects: {
    *queryTableData({ payload = {} }, { call, put }) {
      try {
        const response = yield call(teacherService.queryList, payload);
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
        const response = yield call(teacherService.createData, payload);
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
              id: 'teacher.message.success.create',
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
        yield call(teacherService.updateData, id, payload);
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'success',
            message: formatMessage({
              id: 'teacher.message.success.update',
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
        yield call(teacherService.lockData, payload);
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
        yield call(teacherService.unlockData, payload);
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
        const response = yield call(teacherService.getById, payload);

        const responseLicenseCategory = yield call(
          licenseCategoryService.queryList,
          payload,
        );

        const educationalLevels = yield call(
          educationalLevelService.queryList,
          payload,
        );

        /* const teachingSubjects = yield call(
          teachingSubjectService.queryList,
          payload,
        ); */

        //const rfCards = yield call(rfCardService.getRFCardsUnassigned);

        yield put({
          type: 'setModalResourceData',
          payload: {
            teacherData: response,
            licenseCategoryList: (responseLicenseCategory?.rows || []).map(
              (item) => ({
                label: item.name,
                value: item.code,
              }),
            ),
            educationalLevelList: (educationalLevels?.rows || []).map(
              (item) => ({
                label: item.name,
                value: item.code,
              }),
            ),
            /* teachingSubjectList: (teachingSubjects?.rows || []).map((item) => ({
              label: item.name,
              value: item.code,
            })), */
            /* rfCardList: (rfCards?.rows || []).map((item) => ({
              label: item.code,
              value: item.code,
            })), */
          },
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    *getRFCardById({ payload }, { call, put }) {
      try {
        const response = yield call(rfCardService.getById, payload);
        /* yield put({
          type: 'setGetRFCardById',
          payload: response,
        }); */
        return response;
      } catch (error) {
        console.error('Error When get RF Card by id:', error);
        return [];
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
          type: 'setSelectedTeacherId',
          payload: payload || null,
        });
        return response;
      } catch (error) {
        console.error('Error fetching RF Cards:', error);
        return [];
      }
    },
    *assignRFCard({ rfCardId, teacherId }, { call, put }) {
      try {
        yield call(teacherService.assignRFCard, rfCardId, teacherId);
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
    *unAssignRFCard({ teacherId, payload }, { call, put }) {
      try {
        yield call(teacherService.unAssignRFCard, teacherId, payload);
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
    setAllData(state, { payload }) {
      return {
        ...initState,
        ...state,
        allData: payload,
      };
    },
    setTeacherDetail(state, { payload }) {
      return {
        ...initState,
        ...state,
        teacherDetail: payload,
      };
    },
    setRFCards(state, { payload }) {
      return {
        ...state,
        rfCards: payload,
      };
    },
    setSelectedTeacherId(state, { payload }) {
      return {
        ...state,
        selectedTeacherId: payload,
      };
    },
    /* setGetRFCardById(state, { payload }) {
      return {
        ...state,
        rfCardById: payload,
      };
    }, */
  },
};

export default TeacherModel;
