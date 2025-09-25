// src/repositories/productionOrderPet.repository.js
const { QueryTypes } = require('sequelize');
const db = require('../database'); // nơi export sequelize
const sequelize = db.sequelize || db;

/* =========================
   ENUM & HELPERS
   ========================= */

// Map status chuỗi <-> code theo PET
const STATUS_CODE = {
  CREATED: 0,
  APPROVAL: 1,
  PRINTING: 2,
  PRINTED: 3,
  EXTRACTING: 4,
  EXTRACTED: 5,
  DELIVERING: 6,
  COMPLETE: 7,
  CUTTED: 8,
  ORDERED: 9,
};
const STATUS_BY_CODE = Object.fromEntries(Object.entries(STATUS_CODE).map(([k, v]) => [v, k]));

// Payment: tùy DB bạn — mặc định 0=UNPAID, 1=PAID, 2=PARTPAY
const PAYMENT_CODE = { UNPAID: 0, PAID: 1, PARTPAY: 2 };
const PAYMENT_BY_CODE = { 0: 'UNPAID', 1: 'PAID', 2: 'PARTPAY' };

// YES/NO tinyint
function ynToTiny(v) {
  if (v == null || v === 'null') return null;
  if (v === 1 || v === 'YES' || v === true) return 1;
  if (v === 0 || v === 'NO'  || v === false) return 0;
  return null;
}

function likeParam(x) {
  return x ? `%${x}%` : x;
}

function normStatusList(lst) {
  if (!Array.isArray(lst) || !lst.length) return null;
  const nums = lst.map(v => (Number.isInteger(v) ? v : STATUS_CODE[String(v)?.toUpperCase()]))
                  .filter(v => Number.isInteger(v));
  return nums.length ? nums : null;
}
function normPaymentOne(v) {
  if (v == null || v === 'null') return null;
  if (Number.isInteger(v)) return v;
  return PAYMENT_CODE[String(v)?.toUpperCase()] ?? null;
}
function normPaymentList(lst) {
  if (!Array.isArray(lst) || !lst.length) return null;
  const nums = lst.map(v => (Number.isInteger(v) ? v : PAYMENT_CODE[String(v)?.toUpperCase()]))
                  .filter(v => Number.isInteger(v));
  return nums.length ? nums : null;
}

/* =========================
   TIME PROCESSING (đơn giản)
   ========================= */

function fmtDurationVi(fromMs, toMs) {
  const from = Number(fromMs); const to = Number(toMs);
  if (!from || !to || to < from) return '';
  const mins = Math.round((to - from) / 60000);
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h && m) return `${h} giờ ${m} phút`;
  if (h) return `${h} giờ`;
  return `${m} phút`;
}

/**
 * Tính thời gian xử lý tương đối theo các mốc có trong bảng PET:
 * - ordered_time (BIGINT)
 * - print_time_end, extract_time_end, delivery_time_end (BIGINT)
 * Không có *_start trong schema => xử lý tối giản.
 */
function computeTimeProcessingPET(row, now = Date.now()) {
  const st = Number(row.status);
  const ordered = row.ordered_time || null;
  const printEnd = row.print_time_end || null;
  const extractEnd = row.extract_time_end || null;
  const deliverEnd = row.delivery_time_end || null;

  let start = ordered || null;
  let end = now;

  switch (st) {
    case STATUS_CODE.CREATED:
    case STATUS_CODE.APPROVAL:
    case STATUS_CODE.PRINTING:
      start = ordered;
      end = now;
      break;
    case STATUS_CODE.PRINTED:
      start = ordered;
      end = printEnd || now;
      break;
    case STATUS_CODE.EXTRACTING:
      start = printEnd || ordered;
      end = now;
      break;
    case STATUS_CODE.EXTRACTED:
      start = printEnd || ordered;
      end = extractEnd || now;
      break;
    case STATUS_CODE.DELIVERING:
      start = extractEnd || printEnd || ordered;
      end = now;
      break;
    case STATUS_CODE.COMPLETE:
      start = ordered;
      end = deliverEnd || extractEnd || printEnd || now;
      break;
    case STATUS_CODE.CUTTED:
    case STATUS_CODE.ORDERED:
    default:
      start = ordered;
      end = now;
      break;
  }

  return fmtDurationVi(start, end);
}

/* =========================
   WHERE builder
   ========================= */

function buildWhereAndBinds(p) {
  const where = ['1=1'];
  const binds = {};

  // Xóa/không xóa (is_delete tinyint); mặc định NO (0) nếu không truyền
  const isDeleteTiny = ynToTiny(p.isDelete);
  if (isDeleteTiny != null) {
    where.push('p.is_delete = :isDelete');
    binds.isDelete = isDeleteTiny;
  } else {
    where.push('p.is_delete = 0');
  }

  // code / orderCode / style
  if (p.code)      { where.push('p.code LIKE :code'); binds.code = likeParam(p.code); }
  if (p.orderCode) { where.push('p.order_code LIKE :orderCode'); binds.orderCode = likeParam(p.orderCode); }
  if (p.style)     { where.push('p.style LIKE :style'); binds.style = likeParam(p.style); }

  // customer (FK: p.customer)
  if (p.customerId != null) { where.push('p.customer = :customerId'); binds.customerId = p.customerId; }
  if (p.customerCode)       { where.push('c.code LIKE :customerCode'); binds.customerCode = likeParam(p.customerCode); }
  if (p.customerName)       { where.push('c.name LIKE :customerName'); binds.customerName = likeParam(p.customerName); }

  // painter (FK: p.painter)
  if (p.painterId != null)  { where.push('p.painter = :painterId'); binds.painterId = p.painterId; }
  if (p.painterName)        { where.push('up.name LIKE :painterName'); binds.painterName = likeParam(p.painterName); }

  // printor (FK: p.printor) – nếu cần lọc theo tên người in
  if (p.printorId != null)  { where.push('p.printor = :printorId'); binds.printorId = p.printorId; }
  if (p.printorName)        { where.push('upr.name LIKE :printorName'); binds.printorName = likeParam(p.printorName); }

  // máy in: FK p.printer (id), hoặc tìm theo tên/code máy
  if (p.machine != null && p.machine !== 'null') {
    where.push('p.printer = :machineId');
    binds.machineId = Number(p.machine);
  }
  if (p.billetPrinterName) {
    where.push('(mpr.name LIKE :billetPrinterName OR mpr.code LIKE :billetPrinterName)');
    binds.billetPrinterName = likeParam(p.billetPrinterName);
  }

  // pattern
  if (p.patternId != null) {
    where.push('p.pattern_id = :patternId');
    binds.patternId = p.patternId;
  }

  // is_print_extract (tinyint) nếu cần lọc in/ép chung
  const isExtractTiny = ynToTiny(p.isExtract);
  if (isExtractTiny != null) {
    where.push('p.is_print_extract = :isExtract');
    binds.isExtract = isExtractTiny;
  }

  // is_save
  const isSaveTiny = ynToTiny(p.isSave);
  if (isSaveTiny != null) {
    where.push('p.is_save = :isSave');
    binds.isSave = isSaveTiny;
  }

  // status / lstStatus (tinyint)
  const lstStatus = normStatusList(p.lstStatus) ||
                    (p.status && STATUS_CODE[String(p.status)?.toUpperCase()] != null
                      ? [STATUS_CODE[String(p.status)?.toUpperCase()]]
                      : null);
  if (lstStatus) { where.push('p.status IN (:lstStatus)'); binds.lstStatus = lstStatus; }

  // payment
  const paymentOne = normPaymentOne(p.paymentStatus);
  if (paymentOne != null) { where.push('p.payment_status = :paymentStatus'); binds.paymentStatus = paymentOne; }

  const lstPayment = normPaymentList(p.lstPaymentStatus);
  if (lstPayment) { where.push('p.payment_status IN (:lstPaymentStatus)'); binds.lstPaymentStatus = lstPayment; }

  // Time ranges (BIGINT ms). createdAt là DATETIME => dùng FROM_UNIXTIME(ms/1000)
  if (p.fromOrderTime != null) { where.push('p.ordered_time >= :fromOrderTime'); binds.fromOrderTime = p.fromOrderTime; }
  if (p.toOrderTime   != null) { where.push('p.ordered_time <= :toOrderTime');   binds.toOrderTime   = p.toOrderTime; }

  if (p.fromCreatedTime != null) { where.push('p.createdAt >= FROM_UNIXTIME(:fromCreatedTime/1000)'); binds.fromCreatedTime = p.fromCreatedTime; }
  if (p.toCreatedTime   != null) { where.push('p.createdAt <= FROM_UNIXTIME(:toCreatedTime/1000)');   binds.toCreatedTime   = p.toCreatedTime; }

  if (p.fromDeliveryTime != null) { where.push('p.delivery_time_end >= :fromDeliveryTime'); binds.fromDeliveryTime = p.fromDeliveryTime; }
  if (p.toDeliveryTime   != null) { where.push('p.delivery_time_end <= :toDeliveryTime');   binds.toDeliveryTime   = p.toDeliveryTime; }

  return { whereSql: where.join(' AND '), binds };
}

function buildOrderSql(p) {
  if (p && (p.isSortByStyle === 1 || p.isSortByStyle === 'YES')) {
    return 'ORDER BY p.style ASC, p.id DESC';
  }
  return 'ORDER BY p.id DESC';
}

/* =========================
   CORE QUERIES
   ========================= */

exports.getListV3 = async (
  patternId, isExtract, _customerCode_unused, style, _unusedNull, code, orderCode,
  customerId, customerName, painterId, painterName, _salerId_unused, _salerName_unused,
  _processorId_unused, _processorName_unused, lstStatus, _unusedNull2, paymentStatus, lstPaymentStatus, isSave, isDelete,
  fromOrderTime, toOrderTime, fromCreatedTime, toCreatedTime, fromDeliveryTime, toDeliveryTime,
  isSortByStyle, pageable, billetPrinterName, machine
) => {
  const { whereSql, binds } = buildWhereAndBinds({
    patternId, isExtract, style, code, orderCode,
    customerId, customerName, painterId, painterName,
    lstStatus, paymentStatus, lstPaymentStatus,
    isSave, isDelete,
    fromOrderTime, toOrderTime, fromCreatedTime, toCreatedTime, fromDeliveryTime, toDeliveryTime,
    billetPrinterName, machine,
  });

  const orderSql = buildOrderSql({ isSortByStyle });
  let limitOffset = '';
  if (pageable && Number(pageable.pageSize) > 0) {
    const limit = Number(pageable.pageSize);
    const offset = (Number(pageable.pageNumber || 1) - 1) * limit;
    limitOffset = 'LIMIT :limit OFFSET :offset';
    binds.limit = limit;
    binds.offset = offset;
  }

  const sql = `
    SELECT
      p.*,
      c.id   AS customer_id_join, c.code AS customer_code, c.name AS customer_name,
      up.id  AS painter_id_join,  up.name AS painter_name,
      upr.id AS printor_id_join,  upr.name AS printor_name,
      mpr.id AS printer_id_join,  mpr.name AS printer_name, mpr.code AS printer_code
    FROM production_order_pets p
      LEFT JOIN customers c  ON c.id  = p.customer
      LEFT JOIN users     up ON up.id = p.painter
      LEFT JOIN users     upr ON upr.id = p.printor
      LEFT JOIN machines  mpr ON mpr.id = p.printer
    WHERE ${whereSql}
    ${orderSql}
    ${limitOffset}
  `;

  try {
    const rows = await sequelize.query(sql, { type: QueryTypes.SELECT, replacements: binds });

    // map về shape FE đang dùng
    return rows.map(r => {
      const timeProcessing = computeTimeProcessingPET(r);
      return {
        // core
        id: r.id,
        code: r.code,
        orderCode: r.order_code,
        style: r.style,
        size: r.size,

        // nested
        customer: r.customer_id_join ? { id: r.customer_id_join, code: r.customer_code, name: r.customer_name } : null,
        painter:  r.painter_id_join  ? { id: r.painter_id_join, name: r.painter_name } : null,
        printor:  r.printor_id_join  ? { id: r.printor_id_join, name: r.printor_name } : null,
        printer:  r.printer_id_join  ? { id: r.printer_id_join, name: r.printer_name, code: r.printer_code } : null,

        // numbers
        price: r.price != null ? Number(r.price) : null,
        quantity: r.quantity != null ? Number(r.quantity) : null,
        defectiveQuantity: r.defective_quantity != null ? Number(r.defective_quantity) : null,

        // time
        orderedTime: r.ordered_time || null,
        printTimeEnd: r.print_time_end || null,
        extractTimeEnd: r.extract_time_end || null,
        deliveryTimeEnd: r.delivery_time_end || null,
        timeProcessing,

        // status/payment
        status: STATUS_BY_CODE[r.status] ?? null,
        paymentStatus: PAYMENT_BY_CODE[r.payment_status] ?? null,

        // others
        unit: r.unit ? { name: r.unit } : null,
        image: r.images || null,
        note: r.note || null,
      };
    });
  } catch (err) {
    console.error('SQL ERROR(getListV3):', err?.parent?.sqlMessage || err?.sqlMessage || err?.message);
    console.error('SQL(getListV3):\n', sql);
    console.error('BINDS(getListV3):\n', binds);
    throw err;
  }
};

exports.countListV3 = async (
  patternId, isExtract, _customerCode_unused, style, _unusedNull, code, orderCode,
  customerId, customerName, painterId, painterName, _salerId_unused, _salerName_unused,
  _processorId_unused, _processorName_unused, lstStatus, _unusedNull2, paymentStatus, lstPaymentStatus, isSave, isDelete,
  fromOrderTime, toOrderTime, fromCreatedTime, toCreatedTime, fromDeliveryTime, toDeliveryTime, billetPrinterName, machine
) => {
  const { whereSql, binds } = buildWhereAndBinds({
    patternId, isExtract, style, code, orderCode,
    customerId, customerName, painterId, painterName,
    lstStatus, paymentStatus, lstPaymentStatus,
    isSave, isDelete,
    fromOrderTime, toOrderTime, fromCreatedTime, toCreatedTime, fromDeliveryTime, toDeliveryTime,
    billetPrinterName, machine,
  });

  const sql = `
    SELECT COUNT(DISTINCT p.id) AS cnt
    FROM production_order_pets p
      LEFT JOIN customers c  ON c.id  = p.customer
      LEFT JOIN users     up ON up.id = p.painter
      LEFT JOIN users     upr ON upr.id = p.printor
      LEFT JOIN machines  mpr ON mpr.id = p.printer
    WHERE ${whereSql}
  `;

  try {
    const rows = await sequelize.query(sql, { type: QueryTypes.SELECT, replacements: binds });
    return Number(rows?.[0]?.cnt || 0);
  } catch (err) {
    console.error('SQL ERROR(countListV3):', err?.parent?.sqlMessage || err?.sqlMessage || err?.message);
    console.error('SQL(countListV3):\n', sql);
    console.error('BINDS(countListV3):\n', binds);
    throw err;
  }
};

/* =========================
   findAndCount wrapper (service dùng)
   ========================= */

exports.findAndCount = async (p = {}) => {
  const rows = await exports.getListV3(
    p.patternId,
    p.isExtract,
    null,
    p.style,
    null,
    p.code,
    p.orderCode,
    p.customerId,
    p.customerName,
    p.painterId,
    p.painterName,
    null,
    null,
    null,
    null,
    p.lstStatus,
    null,
    p.paymentStatus,
    p.lstPaymentStatus,
    p.isSave,
    p.isDelete,
    p.fromOrderTime,
    p.toOrderTime,
    p.fromCreatedTime,
    p.toCreatedTime,
    p.fromDeliveryTime,
    p.toDeliveryTime,
    p.isSortByStyle,
    { pageNumber: p.pageNumber || 1, pageSize: p.pageSize || 20 },
    p.billetPrinterName,
    p.machine
  );

  const count = await exports.countListV3(
    p.patternId,
    p.isExtract,
    null,
    p.style,
    null,
    p.code,
    p.orderCode,
    p.customerId,
    p.customerName,
    p.painterId,
    p.painterName,
    null,
    null,
    null,
    null,
    p.lstStatus,
    null,
    p.paymentStatus,
    p.lstPaymentStatus,
    p.isSave,
    p.isDelete,
    p.fromOrderTime,
    p.toOrderTime,
    p.fromCreatedTime,
    p.toCreatedTime,
    p.fromDeliveryTime,
    p.toDeliveryTime,
    p.billetPrinterName,
    p.machine
  );

  return { rows, count };
};
exports.sumPrice = async (p = {}) => {
  const { QueryTypes } = require('sequelize');
  const db = require('../database');
  const sequelize = db.sequelize || db;

  // TẬN DỤNG CHÍNH buildWhere(p) của PET để filter khớp 100%
  const { whereSql, repl } = buildWhere(p);

  const sql = `
    SELECT
      SUM(COALESCE(p.printed_quantity, p.quantity, 0) * COALESCE(p.price, 0)) AS total_price
    FROM production_order_pets p
      LEFT JOIN customers c     ON c.id = p.customer
      LEFT JOIN users     u_painter  ON u_painter.id = p.painter
      LEFT JOIN users     u_printor  ON u_printor.id = p.printor
      LEFT JOIN machines  m_printer  ON m_printer.id = p.printer
    ${whereSql}
  `;

  const rows = await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: repl,
  });

  return Number(rows?.[0]?.total_price || 0);
};
// ===== WHERE builder dùng chung cho findAndCount và sumPrice =====
function buildWhere(p) {
  const cond = [];
  const repl = {};

  if (p.isDelete === 0 || p.isDelete === 1) {
    cond.push(`p.is_delete = :isDelete`);
    repl.isDelete = p.isDelete;
  } else {
    cond.push(`p.is_delete = 0`);
  }

  if (p.code) { cond.push(`p.code LIKE :code`); repl.code = `%${p.code}%`; }
  if (p.orderCode) { cond.push(`p.order_code LIKE :orderCode`); repl.orderCode = `%${p.orderCode}%`; }
  if (p.customerId) { cond.push(`p.customer = :customerId`); repl.customerId = p.customerId; }
  if (p.customerName) { cond.push(`c.name LIKE :customerName`); repl.customerName = `%${p.customerName}%`; }
  if (Array.isArray(p.lstStatus) && p.lstStatus.length) {
    cond.push(`p.status IN (:lstStatus)`); repl.lstStatus = p.lstStatus;
  }
  if (Number.isInteger(p.paymentStatus)) {
    cond.push(`p.payment_status = :paymentStatus`); repl.paymentStatus = p.paymentStatus;
  }

  if (p.fromOrderTime) { cond.push(`p.ordered_time >= :fromOrderTime`); repl.fromOrderTime = p.fromOrderTime; }
  if (p.toOrderTime) { cond.push(`p.ordered_time <= :toOrderTime`); repl.toOrderTime = p.toOrderTime; }

  if (p.fromCreatedTime) { cond.push(`p.createdAt >= :fromCreatedTime`); repl.fromCreatedTime = p.fromCreatedTime; }
  if (p.toCreatedTime) { cond.push(`p.createdAt <= :toCreatedTime`); repl.toCreatedTime = p.toCreatedTime; }

  if (p.fromDeliveryTime) { cond.push(`p.delivery_time_end >= :fromDeliveryTime`); repl.fromDeliveryTime = p.fromDeliveryTime; }
  if (p.toDeliveryTime) { cond.push(`p.delivery_time_end <= :toDeliveryTime`); repl.toDeliveryTime = p.toDeliveryTime; }

  return { whereSql: cond.length ? `WHERE ${cond.join(' AND ')}` : '', repl };
}
exports.sumPrice = async (p) => {
  const { whereSql, repl } = buildWhere(p);

  const sql = `
    SELECT SUM(p.price * IFNULL(p.delivery_quantity, 0)) AS total
    FROM production_order_pets p
      LEFT JOIN customers c ON c.id = p.customer
      LEFT JOIN users up    ON up.id = p.painter
      LEFT JOIN users upr   ON upr.id = p.printor
      LEFT JOIN machines mpr ON mpr.id = p.printer
    ${whereSql}
  `;

  const rows = await sequelize.query(sql, { replacements: repl, type: QueryTypes.SELECT });
  return rows[0]?.total || 0;
};

