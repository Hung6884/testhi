// src/services/productionOrderDirect.service.js
const repo = require('../repositories/productionOrderDirect.repository');

exports.getList = async (payload) => {
  // Chuẩn hóa tham số giống Java (cắt trim, convert enum…)
  const p = { ...payload };

  // LstStatus có thể đang là chuỗi, để nguyên – repo sẽ tự convert tên -> code
  // PaymentStatus: nếu FE gửi 'UNPAID'/'PAID'/'PARTPAY' thì convert sang code
  const PAY2CODE = { UNPAID: 0, PAID: 1, PARTPAY: 2 };
  if (typeof p.paymentStatus === 'string') p.paymentStatus = PAY2CODE[p.paymentStatus];

  // YesNo => tinyint
  const YN2NUM = { NO: 0, YES: 1, MAYBE: 2, null: null, undefined: null };
  ['deleteStatus', 'isPattern', 'isExportWarehouse', 'isSortByCompletedTime', 'isSortByStyle'].forEach((k) => {
    if (typeof p[k] === 'string' && p[k] in YN2NUM) p[k] = YN2NUM[p[k]];
  });

  // gọi repo
  const { rows, count } = await repo.findAndCount(p);
  return { list: rows, count };
};
// --- helpers nhỏ cho start/end of day ---
function startOfDay(ms) {
  if (!ms) return null;
  const d = new Date(Number(ms));
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function endOfDay(ms) {
  if (!ms) return null;
  const d = new Date(Number(ms));
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

// Map payment & YES/NO giống FE
const PAY2CODE = { UNPAID: 0, PAID: 1, PARTPAY: 2 };
const YN2NUM   = { NO: 0, YES: 1, MAYBE: 2 };

// ... đã có exports.getList ở trên ...

// === SUM PRICE ===
exports.getSumPrice = async (body = {}, headers = {}) => {
  const p = { ...(body || {}) };

  // trim text fields
  [
    'code','orderCode','customerCode','customerName',
    'painterName','salerName','colorTesterName','printorName','printer','style'
  ].forEach((k) => {
    if (typeof p[k] === 'string') {
      const v = p[k].trim();
      p[k] = v.length ? v : null;
    }
  });

  // YES/NO -> number; mặc định deleteStatus = NO
  ['deleteStatus','isPattern','isExportWarehouse'].forEach((k) => {
    if (typeof p[k] === 'string' && p[k] in YN2NUM) p[k] = YN2NUM[p[k]];
  });
  if (p.deleteStatus == null) p.deleteStatus = 0;

  // payment
  if (typeof p.paymentStatus === 'string') p.paymentStatus = PAY2CODE[p.paymentStatus];
  if (Array.isArray(p.lstPaymentStatus)) {
    p.lstPaymentStatus = p.lstPaymentStatus.map((x) => (typeof x === 'string' ? PAY2CODE[x] : x)).filter(Number.isInteger);
  }

  // status: để dưới repo convert tiếp (đang hỗ trợ cả string & code)
  if (!Array.isArray(p.lstStatus)) p.lstStatus = [];

  // priceStatus (1: có giá >0, 2: không/0)
  p.priceStatus = p.priceStatus != null ? Number(p.priceStatus) : null;

  // time ranges -> chốt đầu/cuối ngày như Java
  if (p.fromOrderTime != null)         p.fromOrderTime         = startOfDay(p.fromOrderTime);
  if (p.toOrderTime != null)           p.toOrderTime           = endOfDay(p.toOrderTime);
  if (p.fromCreatedTime != null)       p.fromCreatedTime       = startOfDay(p.fromCreatedTime);
  if (p.toCreatedTime != null)         p.toCreatedTime         = endOfDay(p.toCreatedTime);
  if (p.fromExtractingTimeEnd != null) p.fromExtractingTimeEnd = startOfDay(p.fromExtractingTimeEnd);
  if (p.toExtractingTimeEnd != null)   p.toExtractingTimeEnd   = endOfDay(p.toExtractingTimeEnd);
  if (p.fromCompletedTime != null)     p.fromCompletedTime     = startOfDay(p.fromCompletedTime);
  if (p.toCompletedTime != null)       p.toCompletedTime       = endOfDay(p.toCompletedTime);

  // (tuỳ) ràng theo role color test từ header
  const role = headers['x-user-role'] || headers['X-User-Role'];
  const uid  = headers['x-user-id']   || headers['X-User-Id'];
  if (role && String(role).toUpperCase() === 'ROLE_COLOR_TEST' && uid) {
    p.colorTesterIdOfCustomer = Number(uid) || null;
  }

  const total = await repo.sumPrice(p);
  return Number(total || 0);
};
