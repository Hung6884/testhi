const initState = {
  collapsed: false,
  topNavEnable: false,
  headFixed: true,
};

const GlobalModel = {
  namespace: 'global',

  state: initState,

  effects: {},

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...initState,
        ...state,
        collapsed: payload,
      };
    },
    setTopNavEnable(state, { payload }) {
      return {
        ...initState,
        ...state,
        topNavEnable: payload,
      };
    },
    setHeadFixed(state, { payload }) {
      return {
        ...initState,
        ...state,
        headFixed: payload,
      };
    },
  },
};

export default GlobalModel;
