import { isEmpty } from 'lodash';
import moment from 'moment';
export function formatRFLabel(teacherName, studentName) {
  if (!isEmpty(teacherName)) {
    return `  -  GV. ${teacherName}`;
  }
  if (!isEmpty(studentName)) {
    return `  - HV. ${studentName}`;
  }
  return '';
}

export function compareDiffByKeys(fpt, dat, keysToCompare = []) {
  if (fpt && !dat) return true;
  let diffCount = 0;
  for (const key of keysToCompare) {
    const val1 = fpt[key];
    const val2 = dat[key];
    if (val1 instanceof Date && val2 instanceof Date) {
      if (val1.getTime() !== val2.getTime()) {
        diffCount++;
        console.log(
          `Thông tin khác nhau, trường ${key}, fpt: ${val1.getTime()}, dat: ${val2.getTime()} `,
        );
        break;
      }
    } else {
      /* else if (key === 'birthday') {
      const fptBirthday = moment(val1);
      const datBirthday = moment(val2);
      if (!fptBirthday.isSame(datBirthday, 'day')) {
        console.log(
          `Thông tin khác nhau, trường ${key}, fpt: ${val1}, dat: ${val2} `,
        );
        diffCount++;
        break;
      }
    } */
      if (val1 !== val2) {
        console.log(
          `Thông tin khác nhau, trường ${key}, fpt: ${val1}, dat: ${val2} `,
        );
        diffCount++;
        break;
      }
    }
  }

  return diffCount > 0;
}
