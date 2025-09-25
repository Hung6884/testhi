// src/repositories/productionOrderDirect.repository.js
const { QueryTypes } = require('sequelize');
const db = require('../database'); // export sequelize instance { sequelize }
const sequelize = db.sequelize || db;

/** ===== Enums / Maps (clone từ Java FE) ===== */
const STATUS_MAP = {
  CREATED: 0,        // Chưa duyệt lệnh
  APPROVAL: 1,       // Chưa hồ
  SIZED: 2,          // Chưa in (đã hồ xong)
  PRINTING: 3,       // Đang in dở
  COMPLETE: 4,       // Hoàn thành in
  DELIVERING: 5,     // Đang giao hàng (nếu có dùng)
  DELIVERED: 6       // Backend cũ dùng DELIVERED = 6 trong FE
};
// reverse map code->key
const STATUS_BY_CODE = Object.fromEntries(Object.entries(STATUS_MAP).map(([k, v]) => [v, k]));
// payment
const PAYMENT_BY_CODE = { 0: 'UNPAID', 1: 'PAID', 2: 'PARTPAY' };
const YESNO_BY_NUM = (v) => (v === 0 ? 'NO' : v === 1 ? 'YES' : v === 2 ? 'MAYBE' : null);

/** ===== Helpers ===== */
function fmtDurationVi(fromMs, toMs) {
  const from = Number(fromMs); const to = Number(toMs);
  if (!from || !to || to < from) return '';
  const mins = Math.round((to - from) / 60000);
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h && m) return `${h} giờ ${m} phút`;
  if (h) return `${h} giờ`;
  return `${m} phút`;
}

// Tính "thời gian ra mẫu" theo trạng thái thực tế của đơn trực tiếp
function computeTimeProcessing(r, now = Date.now()) {
  const st = Number(r.status);
  let start = null, end = null;
  switch (st) {
    case STATUS_MAP.CREATED:
    case STATUS_MAP.APPROVAL:
      start = r.ordered_time || r.time_created;
      end   = now;
      break;
    case STATUS_MAP.SIZED:
      start = r.sizing_time_start || r.ordered_time || r.time_created;
      end   = r.sizing_time_end || now;
      break;
    case STATUS_MAP.PRINTING:
      start = r.printing_time_start || r.sizing_time_end || r.sizing_time_start || r.ordered_time;
      end   = now;
      break;
    case STATUS_MAP.COMPLETE:
      start = r.printing_time_start || r.sizing_time_end || r.ordered_time || r.time_created;
      end   = r.printing_time_end || r.delivery_time_end || now;
      break;
    default:
      start = r.time_created || r.ordered_time;
      end   = now;
  }
  return fmtDurationVi(start, end);
}

// completed time ưu tiên (giống Java: sort by completed)
const COMPLETED_EXPR = `
  COALESCE(po.delivery_time_end, po.printing_time_end, po.sizing_time_end)
`;

/** ===== WHERE builder ===== */
function buildWhere(p) {
  const cond = [];
  const repl = {};

  // deleteStatus (Java truyền YesNoStatus) -> DB tinyint
  if (p.deleteStatus === 0 || p.deleteStatus === 1) {
    cond.push(`po.is_delete = :deleteStatus`);
    repl.deleteStatus = p.deleteStatus;
  } else {
    cond.push(`po.is_delete = 0`);
  }

  // isPattern (Yes/No) + patternId
  if (p.isPattern === 1) {
    cond.push(`(po.pattern_id IS NOT NULL OR po.personal_pattern_id IS NOT NULL)`);
  } else if (p.isPattern === 0) {
    cond.push(`(po.pattern_id IS NULL AND po.personal_pattern_id IS NULL)`);
  }
  if (p.patternId) {
    cond.push(`po.pattern_id = :patternId`);
    repl.patternId = p.patternId;
  }

  // isExportWarehouse
  if (p.isExportWarehouse === 0 || p.isExportWarehouse === 1) {
    cond.push(`po.is_export_warehouse = :isExportWarehouse`);
    repl.isExportWarehouse = p.isExportWarehouse;
  }

  // basic text filters
  if (p.code)        { cond.push(`po.code LIKE :code`); repl.code = `%${p.code}%`; }
  if (p.orderCode)   { cond.push(`po.order_code LIKE :orderCode`); repl.orderCode = `%${p.orderCode}%`; }
  if (p.style)       { cond.push(`po.style LIKE :style`); repl.style = `%${p.style}%`; }
  if (p.printer)     { // tìm theo tên/code máy in
    cond.push(`(mp.name LIKE :printer OR mp.code LIKE :printer)`);
    repl.printer = `%${p.printer}%`;
  }

  // customer
  if (p.customerId)    { cond.push(`po.customer = :customerId`); repl.customerId = p.customerId; }
  if (p.customerCode)  { cond.push(`c.code LIKE :customerCode`); repl.customerCode = `%${p.customerCode}%`; }
  if (p.customerName)  { cond.push(`c.name LIKE :customerName`); repl.customerName = `%${p.customerName}%`; }

  // painter / saler / colorTester / printor (id + name)
  if (p.painterId)     { cond.push(`po.painter = :painterId`); repl.painterId = p.painterId; }
  if (p.painterName)   { cond.push(`up.name LIKE :painterName`); repl.painterName = `%${p.painterName}%`; }

  if (p.salerId)       { cond.push(`po.saler = :salerId`); repl.salerId = p.salerId; }
  if (p.salerName)     { cond.push(`us.name LIKE :salerName`); repl.salerName = `%${p.salerName}%`; }

  if (p.colorTesterId)   { cond.push(`po.color_tester = :colorTesterId`); repl.colorTesterId = p.colorTesterId; }
  if (p.colorTesterName) { cond.push(`uct.name LIKE :colorTesterName`); repl.colorTesterName = `%${p.colorTesterName}%`; }

  if (p.printorId)     { cond.push(`po.printor = :printorId`); repl.printorId = p.printorId; }
  if (p.printorName)   { cond.push(`upr.name LIKE :printorName`); repl.printorName = `%${p.printorName}%`; }

  // priceStatus: 1 = có đơn giá >0 ; 2 = rỗng/0
  if (p.priceStatus === 1)      cond.push(`po.price IS NOT NULL AND po.price > 0`);
  else if (p.priceStatus === 2) cond.push(`(po.price IS NULL OR po.price = 0)`);

  // statuses
  if (Array.isArray(p.lstStatus) && p.lstStatus.length) {
    // nếu FE gửi status string -> convert sang code nếu cần, nhưng trong DB là tinyint
    // ở layer service sẽ convert rồi; ở đây assume lstStatus là mảng string: CREATED... => convert nhanh:
    const toCodes = p.lstStatus.map(s => STATUS_MAP[s] ?? s).filter(v => v !== undefined && v !== null);
    if (toCodes.length) {
      cond.push(`po.status IN (:lstStatus)`);
      repl.lstStatus = toCodes;
    }
  }

  // payment
  if (Number.isInteger(p.paymentStatus)) {
    cond.push(`po.payment_status = :paymentStatus`);
    repl.paymentStatus = p.paymentStatus;
  }
  if (Array.isArray(p.lstPaymentStatus) && p.lstPaymentStatus.length) {
    cond.push(`po.payment_status IN (:lstPaymentStatus)`);
    repl.lstPaymentStatus = p.lstPaymentStatus;
  }

  // date ranges
  if (p.fromOrderTime)        { cond.push(`po.ordered_time >= :fromOrderTime`); repl.fromOrderTime = p.fromOrderTime; }
  if (p.toOrderTime)          { cond.push(`po.ordered_time <= :toOrderTime`);   repl.toOrderTime   = p.toOrderTime;   }

  if (p.fromCreatedTime)      { cond.push(`po.time_created >= :fromCreatedTime`); repl.fromCreatedTime = p.fromCreatedTime; }
  if (p.toCreatedTime)        { cond.push(`po.time_created <= :toCreatedTime`);   repl.toCreatedTime   = p.toCreatedTime;   }

  if (p.fromExtractingTimeEnd){ cond.push(`po.printing_time_end >= :fromExtractingTimeEnd`); repl.fromExtractingTimeEnd = p.fromExtractingTimeEnd; }
  if (p.toExtractingTimeEnd)  { cond.push(`po.printing_time_end <= :toExtractingTimeEnd`);   repl.toExtractingTimeEnd   = p.toExtractingTimeEnd;   }

  if (p.fromCompletedTime)    { cond.push(`${COMPLETED_EXPR} >= :fromCompletedTime`); repl.fromCompletedTime = p.fromCompletedTime; }
  if (p.toCompletedTime)      { cond.push(`${COMPLETED_EXPR} <= :toCompletedTime`);   repl.toCompletedTime   = p.toCompletedTime;   }

  const whereSql = cond.length ? `WHERE ${cond.join('\n  AND ')}` : '';
  return { whereSql, repl };
}

function buildOrderBy(p) {
  if (p.isSortByCompletedTime === 1) return `ORDER BY ${COMPLETED_EXPR} DESC, po.id DESC`;
  if (p.isSortByStyle === 1)         return `ORDER BY po.style ASC, po.id DESC`;
  return `ORDER BY po.id DESC`;
}

/** ===== Main findAndCount ===== */
exports.findAndCount = async (p) => {
  const { whereSql, repl } = buildWhere(p);
  const orderBy = buildOrderBy(p);

  const limit  = Number(p.pageSize || 20);
  const offset = (Number(p.pageNumber || 1) - 1) * limit;

  const selectSql = `
    SELECT
      po.*,
      c.id   AS customer_id,
      c.code AS customer_code,
      c.name AS customer_name,

      up.id  AS painter_id, up.username AS painter_username, up.name AS painter_name,
      us.id  AS saler_id,   us.username AS saler_username,   us.name AS saler_name,
      uct.id AS ct_id,      uct.username AS ct_username,     uct.name AS color_tester_name,
      upr.id AS printor_id, upr.username AS printor_username, upr.name AS printor_name,

      mp.id   AS printer_id,
      mp.code AS printer_code,
      mp.name AS printer_name
    FROM production_orders_directly po
      LEFT JOIN customers c   ON c.id   = po.customer
      LEFT JOIN users     up  ON up.id  = po.painter
      LEFT JOIN users     us  ON us.id  = po.saler
      LEFT JOIN users     uct ON uct.id = po.color_tester
      LEFT JOIN users     upr ON upr.id = po.printor
      LEFT JOIN machines  mp  ON mp.id  = po.printer
    ${whereSql}
    ${orderBy}
    ${p.isExportExcel ? '' : 'LIMIT :limit OFFSET :offset'}
  `;

  const countSql = `
    SELECT COUNT(DISTINCT po.id) AS cnt
    FROM production_orders_directly po
      LEFT JOIN customers c   ON c.id   = po.customer
      LEFT JOIN users     up  ON up.id  = po.painter
      LEFT JOIN users     us  ON us.id  = po.saler
      LEFT JOIN users     uct ON uct.id = po.color_tester
      LEFT JOIN users     upr ON upr.id = po.printor
      LEFT JOIN machines  mp  ON mp.id  = po.printer
    ${whereSql}
  `;

  const rows = await sequelize.query(selectSql, {
    type: QueryTypes.SELECT,
    replacements: { ...repl, limit, offset },
  });
  const cnt  = await sequelize.query(countSql, {
    type: QueryTypes.SELECT,
    replacements: repl,
  });
  const count = Number(cnt?.[0]?.cnt || 0);

  // map DTO trả về cho FE
  const list = rows.map((r) => {
    const timeProcessing = computeTimeProcessing(r);
    return {
      id: r.id,
      code: r.code,
      orderCode: r.order_code,

      customer: (r.customer_id || r.customer_name || r.customer_code) ? {
        id: r.customer_id || r.customer,
        code: r.customer_code || null,
        name: r.customer_name || null,
      } : null,

      painter: (r.painter_id || r.painter_name) ? {
        id: r.painter_id || r.painter, username: r.painter_username || null, name: r.painter_name || null,
      } : null,
      saler: (r.saler_id || r.saler_name) ? {
        id: r.saler_id || r.saler, username: r.saler_username || null, name: r.saler_name || null,
      } : null,
      colorTester: (r.ct_id || r.color_tester_name) ? {
        id: r.ct_id || r.color_tester, username: r.ct_username || null, name: r.color_tester_name || null,
      } : null,
      printor: (r.printor_id || r.printor_name) ? {
        id: r.printor_id || r.printor, username: r.printor_username || null, name: r.printor_name || null,
      } : null,

      unit: r.unit ? { name: r.unit } : null,
      goodsType: r.goods_type || null,

      price: r.price ?? null,
      quantity: r.quantity ?? null,
      defectiveQuantity: r.defective_quantity ?? null,
      printedQuantity: r.printed_quantity ?? 0,
      remainder: r.remainder ?? null,
      packages: r.packages ?? null,

      image: r.images || null,
      qrUrl: r.qr_url || null,
      fileUrl: r.file_url || null,

      orderedTime: r.ordered_time || null,
      sizingTimeStart: r.sizing_time_start || null,
      sizingTimeEnd: r.sizing_time_end || null,
      printingTimeStart: r.printing_time_start || null,
      printingTimeEnd: r.printing_time_end || null,
      deliveryTimeEnd: r.delivery_time_end || null,

      timeProcessing,

      status: STATUS_BY_CODE[r.status] ?? null,
      paymentStatus: PAYMENT_BY_CODE[r.payment_status] ?? null,
      isDelete: YESNO_BY_NUM(Number(r.is_delete)),

      note: r.note || null,
      sizingNote: r.sizing_note || null,
      printNote: r.print_note || null,
      printParam: r.print_param || null,

      createdAt: r.time_created || r.created_at || null,
      createdBy: r.created_by || null,
      updatedAt: r.updated_at || null,
      updatedBy: r.updated_by || null,
      style: r.style || null,
      size: r.size || null,

      // giữ đúng kiểu FE đang dùng
      lstExtractor: [],
      lstSizingRole: [], // Java build riêng từ bảng role, bạn có thể bổ sung nếu cần
      printer: (r.printer_id || r.printer_name) ? {
        id: r.printer_id || r.printer,
        code: r.printer_code || null,
        name: r.printer_name || null
      } : null,
    };
  });

  return { rows: list, count };
};
// === SUM TOTAL PRICE (printed_quantity * price) ===
exports.sumPrice = async (p) => {
  // Tận dụng lại builder hiện có
  const { whereSql, repl } = buildWhere(p);

  const sql = `
    SELECT COALESCE(SUM(COALESCE(po.printed_quantity,0) * COALESCE(po.price,0)), 0) AS total
    FROM production_orders_directly po
      LEFT JOIN customers c   ON c.id   = po.customer
      LEFT JOIN users     up  ON up.id  = po.painter
      LEFT JOIN users     us  ON us.id  = po.saler
      LEFT JOIN users     uct ON uct.id = po.color_tester
      LEFT JOIN users     upr ON upr.id = po.printor
      LEFT JOIN machines  mp  ON mp.id  = po.printer
    ${whereSql}
  `;

  const rows = await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: repl,
  });

  return Number(rows?.[0]?.total || 0);
};

