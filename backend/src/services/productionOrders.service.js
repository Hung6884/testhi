'use strict';

const repo = require('../repositories/productionOrders.repository');
const DT = require('../utils/date.util');

/** ============================
 *  ENUM MAPPING (clone từ Java)
 *  ============================
 */
const STATUS_MAP = {
  CREATED: 0, APPROVAL: 1, PRINTING: 2, PRINTED: 3,
  EXTRACTING: 4, EXTRACTED: 5, DELIVERING: 6, COMPLETE: 7,
  CUTTED: 8, ORDERED: 9,
};
const PAYMENT_MAP = { UNPAID: 0, PAID: 1, PARTPAY: 2 };
const YESNO_MAP = { NO: 0, YES: 1, MAYBE: 2 };

// Nhóm trạng thái “đang sản xuất” đang dùng ở Java/FE
const STATUS_GROUPS = {
  BEING_PRODUCED: [
    STATUS_MAP.APPROVAL,
    STATUS_MAP.PRINTING,
    STATUS_MAP.PRINTED,
    STATUS_MAP.EXTRACTING,
    STATUS_MAP.EXTRACTED,
  ],
};

/** --------------------------------
 *  Chuẩn hoá tham số thời gian (y như Java)
 *  --------------------------------
 */
function normalizeDateRanges(p) {
  if (p.fromOrderTime != null)        p.fromOrderTime        = DT.startOfDay(p.fromOrderTime);
  if (p.toOrderTime != null)          p.toOrderTime          = DT.endOfDay(p.toOrderTime);

  if (p.fromCreatedTime != null)      p.fromCreatedTime      = DT.startOfDay(p.fromCreatedTime);
  if (p.toCreatedTime != null)        p.toCreatedTime        = DT.endOfDay(p.toCreatedTime);

  if (p.fromExtractingTimeEnd != null)p.fromExtractingTimeEnd= DT.startOfDay(p.fromExtractingTimeEnd);
  if (p.toExtractingTimeEnd != null)  p.toExtractingTimeEnd  = DT.endOfDay(p.toExtractingTimeEnd);

  if (p.fromCompletedTime != null)    p.fromCompletedTime    = DT.startOfDay(p.fromCompletedTime);
  if (p.toCompletedTime != null)      p.toCompletedTime      = DT.endOfDay(p.toCompletedTime);

  if (p.fromDeliverTimeEnd != null)   p.fromDeliverTimeEnd   = DT.startOfDay(p.fromDeliverTimeEnd);
  if (p.toDeliverTimeEnd != null)     p.toDeliverTimeEnd     = DT.endOfDay(p.toDeliverTimeEnd);
  return p;
}

/** --------------------------------
 *  Chuẩn hoá / Mapping tham số filter
 *  --------------------------------
 */
function normalizeFilters(body, headers = {}) {
  const p = { ...(body || {}) };

  // Phân trang mặc định
  p.pageNumber = Number(p.pageNumber || 1);
  p.pageSize   = Number(p.pageSize || 20);

  // Trim chuỗi tìm kiếm
  for (const k of [
    'code','orderCode','customerCode','customerName','painterName',
    'salerName','colorTesterName','printorName','style',
    'billetPrinterName','printer','unit',
  ]) {
    if (typeof p[k] === 'string') {
      const v = p[k].trim();
      p[k] = v.length ? v : null;
    }
  }

  // deleteStatus: mặc định NO (0) nếu không gửi
  if (p.deleteStatus == null || p.deleteStatus === '' || p.deleteStatus === 'null') {
    p.deleteStatus = 'NO';
  }
  if (typeof p.deleteStatus !== 'number') {
    const ds = String(p.deleteStatus).toUpperCase();
    if (ds in YESNO_MAP) p.deleteStatus = YESNO_MAP[ds];
  }

  // status / lstStatus: nhận số hoặc chuỗi enum
  if (p.status != null && p.status !== 'null') {
    const s = (typeof p.status === 'number') ? p.status : STATUS_MAP[String(p.status).toUpperCase()];
    p.lstStatus = Number.isInteger(s) ? [s] : [];
  } else if (Array.isArray(p.lstStatus) && p.lstStatus.length) {
    p.lstStatus = p.lstStatus
      .map((x) => (typeof x === 'number' ? x : STATUS_MAP[String(x).toUpperCase()]))
      .filter(Number.isInteger);
  } else {
    p.lstStatus = [];
  }

  // ✅ listBeingProduced: chỉ bật khi thật sự “on”
  // - true / 1 / '1' / 'true'  => bật
  // - mảng có phần tử         => bật
  // - [] rỗng hoặc null       => KHÔNG bật
  const lbp = p.listBeingProduced;
  const lbpOn =
    lbp === true ||
    lbp === 1 ||
    lbp === '1' ||
    (typeof lbp === 'string' && lbp.toLowerCase() === 'true') ||
    (Array.isArray(lbp) && lbp.length > 0);

  if (lbpOn && (!p.lstStatus || p.lstStatus.length === 0)) {
    p.lstStatus = [...STATUS_GROUPS.BEING_PRODUCED];
  }

  // paymentStatus / lstPaymentStatus
  if (p.paymentStatus != null && p.paymentStatus !== 'null') {
    if (typeof p.paymentStatus !== 'number') {
      const ps = String(p.paymentStatus).toUpperCase();
      if (ps in PAYMENT_MAP) p.paymentStatus = PAYMENT_MAP[ps];
      else p.paymentStatus = null;
    }
  } else {
    p.paymentStatus = null;
  }

  if (Array.isArray(p.lstPaymentStatus) && p.lstPaymentStatus.length) {
    p.lstPaymentStatus = p.lstPaymentStatus
      .map((x) => (typeof x === 'number' ? x : PAYMENT_MAP[String(x).toUpperCase()]))
      .filter(Number.isInteger);
  } else {
    p.lstPaymentStatus = [];
  }

  // isPattern / isExportWarehouse: YES/NO/MAYBE
  for (const k of ['isPattern', 'isExportWarehouse']) {
    if (p[k] != null && p[k] !== '' && typeof p[k] !== 'number') {
      const u = String(p[k]).toUpperCase();
      if (u in YESNO_MAP) p[k] = YESNO_MAP[u];
    }
  }

  // printType: 1|2|3 hoặc 'THERMAL'|'PET'|'DIRECT' -> chuẩn về enum string cho repo
  if (p.printType != null && p.printType !== '' && p.printType !== 0 && p.printType !== '0') {
    if (typeof p.printType === 'number') {
      const idxToKey = { 1: 'THERMAL', 2: 'PET', 3: 'DIRECT' };
      p.printType = idxToKey[p.printType] || null;
    } else {
      const key = String(p.printType).toUpperCase();
      p.printType = ['THERMAL','PET','DIRECT'].includes(key) ? key : null;
    }
  } else {
    p.printType = null;
  }

  // isSortByCompletedTime / isSortByStyle: YES=1, NO=0 (MAYBE=2 => bỏ qua)
  for (const k of ['isSortByCompletedTime','isSortByStyle']) {
    if (p[k] != null && p[k] !== '' && typeof p[k] !== 'number') {
      const u = String(p[k]).toUpperCase();
      if (u in YESNO_MAP) p[k] = YESNO_MAP[u];
    }
  }

  // Excel: nếu true thì repo bỏ LIMIT
  p.isExportExcel = Boolean(p.isExportExcel);

  // (Tuỳ chọn) ràng theo role color test nếu gửi header
  const role = headers['x-user-role'] || headers['X-User-Role'];
  const uid  = headers['x-user-id']   || headers['X-User-Id'];
  if (role && String(role).toUpperCase() === 'ROLE_COLOR_TEST' && uid) {
    p.colorTesterIdOfCustomer = Number(uid) || null;
  }

  // Chuẩn hoá time range
  normalizeDateRanges(p);

  return p;
}

/** ============================
 *  SERVICE: getList
 *  ============================
 */
exports.getList = async (body, headers = {}) => {
  const p = normalizeFilters(body, headers);
  const { rows, count } = await repo.findAndCount(p);
  return { list: rows || [], count: Number(count || 0) };
};
