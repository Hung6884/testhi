import { formatMessage } from 'umi';
import { rollCallStudentService } from '../ui/service';

const initState = {
  modalResourceData: {},
};

const RollCallStudentModel = {
  namespace: 'RollCallStudents',
  state: initState,
  effects: {
    *findByDateAndVehicleCode({ payload }, { call, put }) {
      try {
        const response = yield call(
          rollCallStudentService.findByDateAndVehicleCode,
          payload,
        );
        yield put({
          type: 'setStudentSessions',
          payload: response,
        });
        return response;
      } catch (error) {
        console.error('Error fetching findByDateAndVehicleCode:', error);
        return [];
      }
    },
    *findByVehicleCode({ payload }, { call, put }) {
      try {
        const response = yield call(
          rollCallStudentService.findByVehicleCode,
          payload,
        );
        /* yield put({
          type: 'setSessions',
          payload: response,
        }); */
        return response;
      } catch (error) {
        console.error('Error fetching findByVehicleCode:', error);
        return [];
      }
    },
  },
  reducers: {
    setStudentSessions(state, { payload }) {
      return {
        ...state,
        studentSessions: payload,
      };
    },
  },
};

export default RollCallStudentModel;
