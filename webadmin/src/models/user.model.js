import isEmpty from 'lodash/isEmpty';
import omitBy from 'lodash/omitBy';
import pick from 'lodash/pick';
import { formatMessage, history } from 'umi';
import { getTokenInfo, removeToken, setToken } from '../utils/localToken';
import userService from '../ui/service/user.service';
import authService from '../ui/service/auth.service';

const initState = {
  currentUser: {
    isAuthorized: false,
    name: '',
    avatar: '',
    roles: [],
  },
  message: 0,
};

const UserModel = {
  namespace: 'User',
  global: true,
  state: initState,

  effects: {
    *queryAll({ payload }, { call, put }) {
      try {
        const response = yield call(userService.getUsers, {});
        return response;
      } catch (error) {}
    },
    *fetchCurrent({ payload }, { call, put }) {
      try {
        const response = yield getTokenInfo(payload);

        if (!isEmpty(response.body)) {
          const data = {
            isAuthorized: true,
            name: response.body.username,
            avatar: '',
            roles: [response.body.roleCode],
            employeeId: response.body.employeesId,
            userId: response.body.id,
          };
          yield put({
            type: 'saveCurrentUser',
            payload: data || {},
          });
          return true;
        }
      } catch (error) {}
      return false;
    },
    *queryTableData({ payload }, { call, put }) {
      try {
        const { page, per, ...searchParams } = payload;

        // Lọc bỏ các params empty
        const filteredParams = omitBy(searchParams, (param) => !param);

        const response = yield call(userService.getUsers, {
          page,
          per,
          searchParams: filteredParams,
        });

        yield put({
          type: 'setTableData',
          payload: {
            ...initState.tableData,
            list: response.rows || [],
            pagination: {
              ...initState.tableData.pagination,
              current: page,
              total: response?.count || 0,
            },
          },
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    *fetchMessage(_, { call, put }) {
      try {
        const response = yield call(userService.queryMessage);
        const { data } = response;
        yield put({
          type: 'saveMessage',
          payload: data || 0,
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    *login({ payload }, { call, put }) {
      let status = undefined;
      try {
        const response = yield call(
          authService.accountLogin,
          pick(payload, ['username', 'password']),
        );
        const { user, tokens } = response;
        yield call(setToken, {
          ...payload,
          token: tokens.access.token,
        });

        if (user) {
          yield put({
            type: 'saveCurrentUser',
            payload: {
              isAuthorized: true,
              ...user,
            },
          });

          yield put({
            type: 'notification/createNotification',
            payload: {
              type: 'success',
              message: formatMessage({
                id: 'page.user.login.form.login-success',
              }),
            },
          });
        }

        // Set user permissions for the global state after logging in.
        history.replace(payload.redirect || '/');
      } catch (error) {
        return {
          status: 'error',
          message: error.message,
        };
      }

      if (status === 'ok') {
        return true;
      } else if (status === 'error') {
        return false;
      }
      return undefined;
    },
    *register({ payload }, { call, put }) {
      let status = undefined;
      try {
        const response = yield call(
          authService.accountRegister,
          pick(payload, ['username', 'email', 'password']),
        );

        const { user, tokens } = response;

        if (user) {
          yield put({
            type: 'notification/createNotification',
            payload: {
              type: 'success',
              message: formatMessage({
                id: 'page.user.login.form.login-success',
              }),
            },
          });
        }
      } catch (error) {
        yield put({
          type: 'notification/createNotification',
          payload: {
            type: 'error',
            message: formatMessage({
              id: 'page.user.register.form.register-error',
            }),
          },
        });
        return {
          status: 'error',
          message: error.message,
        };
      }

      if (status === 'ok') {
        return true;
      } else if (status === 'error') {
        return false;
      }
      return undefined;
    },
    *logout({ payload }, { call, put }) {
      const {
        location: { pathname },
      } = history;

      yield call(removeToken, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: {
          ...initState.currentUser,
        },
      });
      if (pathname !== '/auth/login') {
        history.replace({
          pathname: '/auth/login',
          search: new URLSearchParams({ redirect: '/' }).toString(),
        });
      }
    },
  },

  reducers: {
    saveCurrentUser(state, { payload }) {
      return {
        ...initState,
        ...state,
        currentUser: {
          ...initState.currentUser,
          ...payload,
        },
      };
    },
    saveMessage(state, { payload }) {
      return {
        ...initState,
        ...state,
        message: payload,
      };
    },
  },
};

export default UserModel;
