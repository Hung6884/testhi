import get from 'lodash/get';

const createIntl = function createIntl(locale, localeMap) {
  return {
    getMessage: function getMessage(id, defaultMessage) {
      var msg =
        get(localeMap, id.replace(/\[(\d+)\]/g, '.$1').split('.')) || '';
      if (msg) return msg;
      var localKey = locale.replace('_', '-');
      if (localKey === 'zh-CN') {
        return defaultMessage;
      }
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      // var intl = intlMap['zh-CN'];
      // return intl ? intl.getMessage(id, defaultMessage) : defaultMessage;
      return defaultMessage;
    },
    locale: locale,
  };
};

const enUS = {
  moneySymbol: '$',
  deleteThisLine: 'Delete this line',
  copyThisLine: 'Copy this line',
  form: {
    lightFilter: {
      more: 'More',
      clear: 'Clear',
      confirm: 'Confirm',
      itemUnit: 'Items',
    },
  },
  tableForm: {
    search: 'Query',
    reset: 'Reset',
    submit: 'Submit',
    collapsed: 'Expand',
    expand: 'Collapse',
    inputPlaceholder: 'Please enter',
    selectPlaceholder: 'Please select',
  },
  alert: {
    clear: 'Clear',
    selected: 'Selected',
    item: 'Item',
  },
  pagination: {
    total: {
      range: ' ',
      total: 'of',
      item: 'items',
    },
    locale: {
      items_per_page: 'items / page',
    },
  },
  tableToolBar: {
    leftPin: 'Pin to left',
    rightPin: 'Pin to right',
    noPin: 'Unpinned',
    leftFixedTitle: 'Fixed to the left',
    rightFixedTitle: 'Fixed to the right',
    noFixedTitle: 'Not Fixed',
    reset: 'Reset',
    columnDisplay: 'Column Display',
    columnSetting: 'Table Settings',
    fullScreen: 'Full Screen',
    exitFullScreen: 'Exit Full Screen',
    reload: 'Refresh',
    density: 'Density',
    densityDefault: 'Default',
    densityLarger: 'Larger',
    densityMiddle: 'Middle',
    densitySmall: 'Compact',
  },
  stepsForm: {
    next: 'Next',
    prev: 'Previous',
    submit: 'Finish',
  },
  loginForm: {
    submitText: 'Login',
  },
  editableTable: {
    onlyOneLineEditor: 'Only one line can be edited',
    onlyAddOneLine: 'Only one line can be added',
    action: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      add: 'add a row of data',
    },
  },
  tableLocale: {
    emptyText: 'Empty Text',
    filterTitle: 'Filter',
    sortTitle: 'Sort',
    expand: 'Expand',
    collapse: 'Collapse',
    triggerDesc: 'Descending Order',
    triggerAsc: 'Ascending Order',
    cancelSort: 'Cancel Sort',
    noData: 'No Data',
  },
  switch: {
    open: 'open',
    close: 'close',
  },
};

const viVN = {
  moneySymbol: '₫',
  form: {
    lightFilter: {
      more: 'Nhiều hơn',
      clear: 'Trong',
      confirm: 'Xác nhận',
      itemUnit: 'Mục',
    },
  },
  tableForm: {
    search: 'Tìm kiếm',
    reset: 'Làm lại',
    submit: 'Gửi đi',
    collapsed: 'Mở rộng',
    expand: 'Thu gọn',
    inputPlaceholder: 'Nhập dữ liệu',
    selectPlaceholder: 'Vui lòng chọn',
  },
  alert: {
    clear: 'Xóa',
    selected: 'đã chọn',
    item: 'mục',
  },
  tableLocale: {
    emptyText: 'Không có dữ liệu',
    filterTitle: 'Lọc',
    sortTitle: 'Sắp xếp',
    expand: 'Mở rộng',
    collapse: 'Thu gọn',
    triggerDesc: 'Sắp xếp giảm dần',
    triggerAsc: 'Sắp xếp tăng dần',
    cancelSort: 'Hủy sắp xếp',
  },
  pagination: {
    total: {
      range: ' ',
      total: 'trên',
      item: 'phần tử',
    },
    locale: {
      items_per_page: 'phần tử / trang',
    },
  },
  tableToolBar: {
    leftPin: 'Ghim bên trái',
    rightPin: 'Ghim bên phải',
    noPin: 'Bỏ ghim',
    leftFixedTitle: 'Cố định bên trái',
    rightFixedTitle: 'Cố định bên phải',
    noFixedTitle: 'Chưa cố định',
    reset: 'Làm lại',
    columnDisplay: 'Cột hiển thị',
    columnSetting: 'Cấu hình',
    fullScreen: 'Chế độ toàn màn hình',
    exitFullScreen: 'Thoát chế độ toàn màn hình',
    reload: 'Làm mới',
    density: 'Mật độ hiển thị',
    densityDefault: 'Mặc định',
    densityLarger: 'Mặc định',
    densityMiddle: 'Trung bình',
    densitySmall: 'Chật',
  },
  stepsForm: {
    next: 'Sau',
    prev: 'Trước',
    submit: 'Kết thúc',
  },
  loginForm: {
    submitText: 'Đăng nhập',
  },
  editableTable: {
    action: {
      save: 'Lưu',
      cancel: 'Hủy',
      delete: 'Xóa',
      add: 'Thêm một hàng dữ liệu',
    },
  },
  switch: {
    open: 'mở',
    close: 'đóng',
  },
};

const zhCN = {
  moneySymbol: '$',
  deleteThisLine: '删除此行',
  copyThisLine: '复制此行',
  form: {
    lightFilter: {
      more: '更多',
      clear: '清除',
      confirm: '确认',
      itemUnit: '项',
    },
  },
  tableForm: {
    search: '查询',
    reset: '重置',
    submit: '提交',
    collapsed: '展开',
    expand: '折叠',
    inputPlaceholder: '请输入',
    selectPlaceholder: '请选择',
  },
  alert: {
    clear: '清除',
    selected: '已选择',
    item: '项',
  },
  pagination: {
    total: {
      range: ' ',
      total: '共',
      item: '项',
    },
    locale: {
      items_per_page: '项/页',
    },
  },
  tableToolBar: {
    leftPin: '固定到左侧',
    rightPin: '固定到右侧',
    noPin: '未固定',
    leftFixedTitle: '固定到左侧',
    rightFixedTitle: '固定到右侧',
    noFixedTitle: '未固定',
    reset: '重置',
    columnDisplay: '列显示',
    columnSetting: '表格设置',
    fullScreen: '全屏',
    exitFullScreen: '退出全屏',
    reload: '刷新',
    density: '密度',
    densityDefault: '默认',
    densityLarger: '大',
    densityMiddle: '中',
    densitySmall: '紧凑',
  },
  stepsForm: {
    next: '下一步',
    prev: '上一步',
    submit: '完成',
  },
  loginForm: {
    submitText: '登录',
  },
  editableTable: {
    onlyOneLineEditor: '只能编辑一行',
    onlyAddOneLine: '只能添加一行',
    action: {
      save: '保存',
      cancel: '取消',
      delete: '删除',
      add: '添加一行数据',
    },
  },
  tableLocale: {
    emptyText: '空文本',
    filterTitle: '过滤',
    sortTitle: '排序',
    expand: '展开',
    collapse: '折叠',
    triggerDesc: '降序',
    triggerAsc: '升序',
    cancelSort: '取消排序',
    noData: '没有数据',
  },
  switch: {
    open: '打开',
    close: '关闭',
  },
};

const enUSIntl = createIntl('en_US', enUS);
const viVNIntl = createIntl('vi_VN', viVN);
const zhCNIntl = createIntl('zh_CN', zhCN);

const locale = {
  'vi-VN': viVNIntl,
  'en-US': enUSIntl,
  'zh-CN': zhCNIntl,
};

export function getAntdLocale(key) {
  if (!key || !locale[key]) {
    return viVNIntl;
  }
  return locale[key];
}
