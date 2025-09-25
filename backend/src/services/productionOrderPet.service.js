// src/services/productionOrderPet.service.js
'use strict';

const repo = require('../repositories/productionOrderPet.repository');
const DT = require('../utils/date.util');

/** =========================
 *  ENUM mapping giống Java/FE
 *  ========================= */
const STATUS_MAP = {
  CREATED: 0, APPROVAL: 1, PRINTING: 2, PRINTED: 3,
  EXTRACTING: 4, EXTRACTED: 5, DELIVERING: 6, COMPLETE: 7,
  CUTTED: 8, ORDERED: 9,
};
const PAYMENT_MAP = { UNPAID: 0, PAID: 1, PARTPAY: 2 };
const YESNO_MAP   = { NO: 0, YES: 1, MAYBE: 2 };

/** =========================
 *  Helpers chuẩn hoá
 *  ========================= */
function normStatusList(lst) {
  if (!Array.isArray(lst)) return null;
  const out = lst
    .map(v => (Number.isInteger(v) ? v : STATUS_MAP[String(v)?.toUpperCase()]))
    .filter(v => Number.isInteger(v));
  return out.length ? out : null;
}
function normPayment(v) {
  if (v == null || v === 'null') return null;
  return Number.isInteger(v) ? v : PAYMENT_MAP[String(v)?.toUpperCase()];
}
function normPaymentList(lst) {
  if (!Array.isArray(lst)) return null;
  const out = lst
    .map(v => (Number.isInteger(v) ? v : PAYMENT_MAP[String(v)?.toUpperCase()]))
    .filter(v => Number.isInteger(v));
  return out.length ? out : null;
}
function ynToNum(v) {
  if (v == null || v === 'null') return undefined;
  const s = (typeof v === 'string') ? v.toUpperCase() : v;
  if (v === true || s === 'YES' || v === 1) return 1;
  if (v === false || s === 'NO'  || v === 0) return 0;
  if (s === 'MAYBE' || v === 2) return 2;
  return undefined;
}

/** =========================
 *  Chuẩn hoá time range (ms)
 *  ========================= */
function normalizeDateRanges(p) {
  if (p.fromOrderTime != null)    p.fromOrderTime    = DT.startOfDay(p.fromOrderTime);
  if (p.toOrderTime != null)      p.toOrderTime      = DT.endOfDay(p.toOrderTime);

  if (p.fromCreatedTime != null)  p.fromCreatedTime  = DT.startOfDay(p.fromCreatedTime);
  if (p.toCreatedTime != null)    p.toCreatedTime    = DT.endOfDay(p.toCreatedTime);

  if (p.fromDeliveryTime != null) p.fromDeliveryTime = DT.startOfDay(p.fromDeliveryTime);
  if (p.toDeliveryTime != null)   p.toDeliveryTime   = DT.endOfDay(p.toDeliveryTime);
  return p;
}

/** =========================
 *  Chuẩn hoá filter dùng chung
 *  ========================= */
function normalizeFilters(body = {}, headers = {}) {
  const p = { ...(body || {}) };

  // Pagination
  p.pageNumber = Number(p.pageNumber || 1);
  p.pageSize   = Number(p.pageSize || 20);

  // Text fields
  for (const k of [
    'code','orderCode','customerCode','customerName',
    'painterName','salerName','processorName','billetPrinterName'
  ]) {
    if (typeof p[k] === 'string') {
      const v = p[k].trim();
      p[k] = v.length ? v : null;
    }
  }

  // YES/NO flags
  for (const k of ['isSave','isDelete','isExtract']) {
    if (p[k] != null && p[k] !== '' && typeof p[k] !== 'number') {
      const u = String(p[k]).toUpperCase();
      if (u in YESNO_MAP) p[k] = YESNO_MAP[u];
    }
  }
  // Mặc định không xoá
  if (p.isDelete == null) p.isDelete = YESNO_MAP.NO;

  // Payment
  p.paymentStatus     = normPayment(p.paymentStatus);
  p.lstPaymentStatus  = normPaymentList(p.lstPaymentStatus) || [];

  // Status (FE thường gửi ['COMPLETE'] cho màn PET accountant)
  p.lstStatus = normStatusList(p.lstStatus)
    || (p.status && STATUS_MAP[p.status?.toUpperCase()] != null
        ? [STATUS_MAP[p.status?.toUpperCase()]] : []);

  // Time ranges
  normalizeDateRanges(p);

  // Excel flag
  p.isExportExcel = Boolean(p.isExportExcel);

  // Một số alias để repo dễ dùng (repo đang LIKE theo 'printer' dạng string)
  if (p.billetPrinterName && !p.printer) p.printer = p.billetPrinterName;

  return p;
}

/** =========================
 *  SERVICE: getList (PET)
 *  ========================= */
exports.getList = async (body = {}) => {
  const p = normalizeFilters(body);
  const { rows, count } = await repo.findAndCount(p);
  return { list: rows, count: Number(count || 0) };
};

/** =========================
 *  SERVICE: getSumPrice (PET)
 *  ========================= */
exports.getSumPrice = async (body = {}, headers = {}) => {
  const p = normalizeFilters(body, headers);
  const total = await repo.sumPrice(p);           // sum(price * delivery_quantity) theo filter
  return Number(total || 0);
};
