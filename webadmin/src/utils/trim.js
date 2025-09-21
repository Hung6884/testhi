import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import mapValues from 'lodash/mapValues';
import trim from 'lodash/trim';
/**
 * 去除左边空格
 * @author LiQingSong
 */
export const ltrim = (val) => {
  return val.replace(/(^\s*)/g, '');
};

/**
 * 去除右边边空格
 * @author LiQingSong
 */
export const rtrim = (val) => {
  return val.replace(/(\s*$)/g, '');
};

/**
 * 去除两端 ,
 * @author LiQingSong
 */
export const trimComma = (val) => {
  return val.replace(/(^,*)|(,*$)/g, '');
};

/**
 * 去除两端 |
 * @author LiQingSong
 */
export const trimVerticalBar = (val) => {
  return val.replace(/(^\|*)|(\|*$)/g, '');
};

export const trimObjectStrings = (obj) => {
  return mapValues(obj, (value) => {
    if (isUndefined(value)) {
      return null;
    }
    if (isString(value)) {
      return trim(value) === '' ? null : trim(value);
    }
    return value;
  });
};
