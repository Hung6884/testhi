const moment = require('moment');
const fs = require('fs');
const axios = require('axios');
//const mailConfig = require('../config/mail');
 

const paginate = (page, pageSize) => {
  let offset = 0;
  if (page > 1) {
    offset = (page - 1) * pageSize;
  }
 

  return {
    offset,
    limit: pageSize,
  };
};
 
const getCurrentTime = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
};
 
const convertDateTimeTimeStampToDate = (dateTime) => {
  return moment(dateTime, moment.ISO_8601, true).isValid()
    ? moment.utc(dateTime).format('YYYY-MM-DD')
    : null;
};
 
const convertDateTimeStampToTime = (dateTime) => {
  return moment(dateTime, moment.ISO_8601, true).isValid()
    ? moment.utc(dateTime).format('YYYY-MM-DD HH:mm')
    : null;
};
 
const convertDateStringToDate = (dateString) => {
  return moment.tz(dateString, 'YYYY-MM-DD', 'Asia/Ho_Chi_Minh').toDate();
};
 
const isEmpty = (obj) => Object.getOwnPropertyNames(obj).length === 0 && obj.constructor === Object;
 
const getCode = (key) => {
  const timeStamp = new Date().getTime();
  return `${key}-${timeStamp}`;
};
 
const mappingPurchaseOrder = (purchaseOrder) => {
  return {
    id: purchaseOrder.id,
    resource_id: purchaseOrder.resource_id,
    paci_role: purchaseOrder.paci_role,
    plan_value: purchaseOrder.plan_value,
    po_value: purchaseOrder.po_value,
    actual_value: purchaseOrder.actual_value,
    note: purchaseOrder.note,
  };
};
 
const removeFile = async (filePath) => {
  await fs.promises.access(filePath);
  await fs.promises.unlink(filePath);
};
 
const kebabCase = (string = '') =>
  string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

/**
 * Parses a date string and returns a JavaScript Date object.
 *
 * - If the string includes time → returns as-is.
 * - If no time:
 *    - If boundary is 'start' → start of day (00:00:00).
 *    - If boundary is 'end'   → start of next day (00:00:00 of the next day).
 *     - no boundary → sets time to current system time.
 * - If no input at all → returns current system time.
 *
 * @param {string} [input] - The date string (e.g., "2025-04-09" or "2025-04-09T14:30").
 * @param {'start' | 'end'} [boundary] - Optional boundary mode: 'start', 'end', or undefined.
 * @returns {Date} The parsed JavaScript Date object.
 */
const parseToSystemDate = (input, boundary) => {
  if (!input) {
    return new Date(); // No input → return current time
  }

  const hasTime = /\d{2}:\d{2}/.test(input);
  const date = new Date(input);

  if (hasTime || isNaN(date.getTime())) {
    return date; // Has time info → return as-is/ Invalid date
  }

  if (boundary === 'start') {
    date.setHours(0, 0, 0, 0);
    return date;
  }
 
  if (boundary === 'end') {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    return nextDay;
  }
 
  // No boundary → combine date with current time
  const now = new Date();
  date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
 
  return date;
}
 
 
module.exports = {
  paginate,
  getCurrentTime,
  isEmpty,
  mappingPurchaseOrder,
  removeFile,
  getCode,
  kebabCase,
  convertDateTimeTimeStampToDate,
  convertDateTimeStampToTime,
  convertDateStringToDate,
  parseToSystemDate,
};
