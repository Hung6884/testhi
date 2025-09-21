import { syncDataService } from '../ui/service';
import { formatMessage } from 'umi';
const initState = {
  courseTableData: {
    data: {},
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 20,
      showSizeChanger: true,
      showQuickJumper: true,
    },
  },
};

const SyncDataModel = {
  namespace: 'SyncData',
  state: initState,
  effects: {
    *queryTableCourses({ payload = {} }, { call, put }) {
      try {
        const response = yield call(syncDataService.queryCourses, payload);

        yield put({
          type: 'setCourseTableData',
          payload: {
            ...initState.courseTableData,
            data: response,
          },
        });

        return {
          ...initState.courseTableData,
          data: response,
        };
      } catch (error) {
        console.log('error', error);
        return false;
      }
    },
    *getStudentsByCourseCode({ courseCode, payload = {} }, { call, put }) {
      try {
        const response = yield call(
          syncDataService.getStudentsByCourseCode,
          courseCode,
          payload,
        );

        return response;
      } catch (error) {
        console.log('error', error);
        return false;
      }
    },
    *syncCourses({ payload }, { call, put }) {
      try {
        const response = yield call(syncDataService.syncCourses, payload);
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'success',
            message: formatMessage({
              id: 'app.global.success',
            }),
          },
        });
        return response;
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
    *queryTableTeachers({ payload = {} }, { call, put }) {
      try {
        const response = yield call(syncDataService.queryTeachers, payload);

        yield put({
          type: 'setTeacherTableData',
          payload: {
            ...initState.teacherTableData,
            data: response,
          },
        });

        return {
          ...initState.teacherTableData,
          data: response,
        };
      } catch (error) {
        console.log('error', error);
        return false;
      }
    },
    *syncTeachers({ payload }, { call, put }) {
      try {
        const response = yield call(syncDataService.syncTeachers, payload);
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'success',
            message: formatMessage({
              id: 'app.global.success',
            }),
          },
        });
        return response;
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
    *queryTableTrainingVehicles({ payload = {} }, { call, put }) {
      try {
        const response = yield call(
          syncDataService.queryTrainingVehicles,
          payload,
        );

        yield put({
          type: 'setTrainingVehicleTableData',
          payload: {
            ...initState.trainingVehicleTableData,
            data: response,
          },
        });

        return {
          ...initState.trainingVehicleTableData,
          data: response,
        };
      } catch (error) {
        console.log('error', error);
        return false;
      }
    },
    *syncTrainingVehicles({ payload }, { call, put }) {
      try {
        const response = yield call(
          syncDataService.syncTrainingVehicles,
          payload,
        );
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'success',
            message: formatMessage({
              id: 'app.global.success',
            }),
          },
        });
        return response;
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
    setTeacherTableData(state, { payload }) {
      return {
        ...initState,
        ...state,
        teacherTableData: payload,
      };
    },
    setTrainingVehicleTableData(state, { payload }) {
      return {
        ...initState,
        ...state,
        trainingVehicleTableData: payload,
      };
    },
  },
};

export default SyncDataModel;
