import dropRight from 'lodash/dropRight';

const initState = {
  alerts: [],
};

const Notification = {
  namespace: 'notification',
  state: initState,
  effects: {},
  reducers: {
    createNotification(state, { payload }) {
      return { ...initState, ...state, alerts: [...state.alerts, payload] };
    },
    removeNotification(state) {
      return { ...initState, ...state, alerts: dropRight(state.alerts) };
    },
  },
};

export default Notification;
