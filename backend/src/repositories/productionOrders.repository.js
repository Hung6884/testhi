const { QueryTypes } = require('sequelize');
const db = require('../database'); // nơi export sequelize
const sequelize = db.sequelize || db;

// ===== Enums (clone Java) =====
const STATUS_MAP = {
  CREATED: 0, APPROVAL: 1, PRINTING: 2, PRINTED: 3,
  EXTRACTING: 4, EXTRACTED: 5, DELIVERING: 6, COMPLETE: 7,
  CUTTED: 8, ORDERED: 9,
};
const STATUS_BY_CODE = Object.fromEntries(Object.entries(STATUS_MAP).map(([k, v]) => [v, k]));

const PAYMENT_BY_CODE = { 0: 'UNPAID', 1: 'PAID', 2: 'PARTPAY' };
const YESNO_BY_NUM = (v) => (v === 0 ? 'NO' : v === 1 ? 'YES' : v === 2 ? 'MAYBE' : null);

const PRINT_TYPE_MAP = {
  THERMAL: ['printer'],
  PET: ['pet'],
  DIRECT: ['printer-TT', 'printer-tt'],
};

// ===== helpers =====
function fmtDurationVi(fromMs, toMs) {
  const from = Number(fromMs); const to = Number(toMs);
  if (!from || !to || to < from) return '';
  const mins = Math.round((to - from) / 60000);
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h && m) return `${h} giờ ${m} phút `;
  if (h) return `${h} giờ `;
  return `${m} phút `;
}

function computeTimeProcessing(r, now = Date.now()) {
  const st = Number(r.status);
  let start = null, end = null;
  switch (st) {
    case 0: // CREATED
    case 1: // APPROVAL
      start = r.ordered_time || r.time_created;
      end   = now;
      break;
    case 2: // PRINTING
      start = r.print_time_start || r.time_created || r.ordered_time;
      end   = now;
      break;
    case 3: // PRINTED
      start = r.print_time_start || r.time_created || r.ordered_time;
      end   = r.print_time_end || now;
      break;
    case 4: // EXTRACTING
      start = r.print_time_end || r.print_time_start || r.time_created;
      end   = now;
      break;
    case 5: // EXTRACTED
      start = r.extracting_time_start || r.print_time_end || r.print_time_start;
      end   = r.extracting_time_end || now;
      break;
    case 6: // DELIVERING
      start = r.extracting_time_end || r.print_time_end || r.print_time_start;
      end   = now;
      break;
    case 7: // COMPLETE
      start = r.ordered_time || r.time_created;
      end   = r.delivery_time_end || r.extracting_time_end || r.print_time_end || now;
      break;
    case 8: // CUTTED
      start = r.print_time_end || r.extracting_time_start || r.print_time_start || r.ordered_time;
      end   = now;
      break;
    case 9: // ORDERED
      start = r.ordered_time || r.time_created;
      end   = now;
      break;
    default:
      start = r.time_created || r.ordered_time;
      end   = now;
  }
  return fmtDurationVi(start, end);
}

// CompletedTime: giả định theo thứ tự ưu tiên của quy trình
// Nếu Java của bạn khác, thay biểu thức dưới đây
const COMPLETED_EXPR = `
  COALESCE(po.delivery_time_end, po.extracting_time_end, po.print_time_end)
`;

// ===== WHERE builder =====
function buildWhere(p) {
  const cond = [];
  const repl = {};

  // deleteStatus (mặc định 0 = NO)
  if (p.deleteStatus === 0 || p.deleteStatus === 1) {
    cond.push(`po.is_delete = :isDelete`);
    repl.isDelete = p.deleteStatus;
  } else {
    cond.push(`po.is_delete = 0`);
  }

  // Pattern
  if (p.isPattern === 1) { // YES
    cond.push(`(po.pattern_id IS NOT NULL OR po.personal_pattern_id IS NOT NULL)`);
  } else if (p.isPattern === 0) { // NO
    cond.push(`(po.pattern_id IS NULL AND po.personal_pattern_id IS NULL)`);
  }

  // isExportWarehouse
  if (p.isExportWarehouse === 0 || p.isExportWarehouse === 1) {
    cond.push(`po.is_export_warehouse = :isExportWarehouse`);
    repl.isExportWarehouse = p.isExportWarehouse;
  }

  // code / orderCode / style
  if (p.code)        { cond.push(`po.code LIKE :code`); repl.code = `%${p.code}%`; }
  if (p.orderCode)   { cond.push(`po.order_code LIKE :orderCode`); repl.orderCode = `%${p.orderCode}%`; }
  if (p.style)       { cond.push(`po.style LIKE :style`); repl.style = `%${p.style}%`; }

  // customer
  if (p.customerId)    { cond.push(`po.customer = :customerId`); repl.customerId = p.customerId; }
  if (p.customerCode)  { cond.push(`c.code LIKE :customerCode`); repl.customerCode = `%${p.customerCode}%`; }
  if (p.customerName)  { cond.push(`c.name LIKE :customerName`); repl.customerName = `%${p.customerName}%`; }

  // billetPrinterName (tên máy in phôi)
  if (p.billetPrinterName) { cond.push(`m_bp.name LIKE :billetPrinterName`); repl.billetPrinterName = `%${p.billetPrinterName}%`; }

  // painter / saler / colorTester / printor
  if (p.painterId)     { cond.push(`po.painter = :painterId`); repl.painterId = p.painterId; }
  if (p.painterName)   { cond.push(`up.name LIKE :painterName`); repl.painterName = `%${p.painterName}%`; }

  if (p.salerId)       { cond.push(`po.saler = :salerId`); repl.salerId = p.salerId; }
  if (p.salerName)     { cond.push(`us.name LIKE :salerName`); repl.salerName = `%${p.salerName}%`; }

  if (p.colorTesterId)   { cond.push(`po.color_tester = :colorTesterId`); repl.colorTesterId = p.colorTesterId; }
  if (p.colorTesterName) { cond.push(`uct.name LIKE :colorTesterName`); repl.colorTesterName = `%${p.colorTesterName}%`; }

  if (p.printorId)     { cond.push(`po.printor = :printorId`); repl.printorId = p.printorId; }
  if (p.printorName)   { cond.push(`upr.name LIKE :printorName`); repl.printorName = `%${p.printorName}%`; }

  // printer (String): tìm theo code/name của máy (join m_bp)
  if (p.printer) {
    cond.push(`(m_bp.code LIKE :printer OR m_bp.name LIKE :printer)`);
    repl.printer = `%${p.printer}%`;
  }

  // priceStatus (giả định: 1 = có đơn giá > 0; 2 = không có/0)
  if (p.priceStatus === 1) {
    cond.push(`po.price IS NOT NULL AND po.price > 0`);
  } else if (p.priceStatus === 2) {
    cond.push(`(po.price IS NULL OR po.price = 0)`);
  }

  // status / lstStatus
  if (Array.isArray(p.lstStatus) && p.lstStatus.length) {
    cond.push(`po.status IN (:lstStatus)`); repl.lstStatus = p.lstStatus;
  }

  // paymentStatus / lstPaymentStatus
  if (Number.isInteger(p.paymentStatus)) {
    cond.push(`po.payment_status = :paymentStatus`); repl.paymentStatus = p.paymentStatus;
  }
  if (Array.isArray(p.lstPaymentStatus) && p.lstPaymentStatus.length) {
    cond.push(`po.payment_status IN (:lstPaymentStatus)`); repl.lstPaymentStatus = p.lstPaymentStatus;
  }

  // Date ranges
  if (p.fromOrderTime)        { cond.push(`po.ordered_time >= :fromOrderTime`); repl.fromOrderTime = p.fromOrderTime; }
  if (p.toOrderTime)          { cond.push(`po.ordered_time <= :toOrderTime`);   repl.toOrderTime   = p.toOrderTime; }

  if (p.fromCreatedTime)      { cond.push(`po.time_created >= :fromCreatedTime`); repl.fromCreatedTime = p.fromCreatedTime; }
  if (p.toCreatedTime)        { cond.push(`po.time_created <= :toCreatedTime`);   repl.toCreatedTime   = p.toCreatedTime; }

  if (p.fromExtractingTimeEnd){ cond.push(`po.extracting_time_end >= :fromExtractingTimeEnd`); repl.fromExtractingTimeEnd = p.fromExtractingTimeEnd; }
  if (p.toExtractingTimeEnd)  { cond.push(`po.extracting_time_end <= :toExtractingTimeEnd`);   repl.toExtractingTimeEnd   = p.toExtractingTimeEnd; }

  // completedTime dùng biểu thức COMPLETED_EXPR
  if (p.fromCompletedTime)    { cond.push(`${COMPLETED_EXPR} >= :fromCompletedTime`); repl.fromCompletedTime = p.fromCompletedTime; }
  if (p.toCompletedTime)      { cond.push(`${COMPLETED_EXPR} <= :toCompletedTime`);   repl.toCompletedTime   = p.toCompletedTime; }

  if (p.fromDeliverTimeEnd)   { cond.push(`po.delivery_time_end >= :fromDeliverTimeEnd`); repl.fromDeliverTimeEnd = p.fromDeliverTimeEnd; }
  if (p.toDeliverTimeEnd)     { cond.push(`po.delivery_time_end <= :toDeliverTimeEnd`);   repl.toDeliverTimeEnd   = p.toDeliverTimeEnd; }

  // ColorTest role constraint (nếu có)
  if (p.colorTesterIdOfCustomer) {
    // Nếu muốn ràng theo KH thay vì đơn, đổi sang:  AND c.color_tester = :colorTesterIdOfCustomer
    cond.push(`po.color_tester = :colorTesterIdOfCustomer`);
    repl.colorTesterIdOfCustomer = p.colorTesterIdOfCustomer;
  }

  // printType -> m_bp.type IN (...)
  if (p.printType && PRINT_TYPE_MAP[p.printType]) {
    cond.push(`m_bp.type IN (:__ptypes)`); repl.__ptypes = PRINT_TYPE_MAP[p.printType];
  }

  const whereSql = cond.length ? `WHERE ${cond.join('\n  AND ')}` : '';
  return { whereSql, repl };
}

function buildOrderBy(p) {
  if (p.isSortByCompletedTime === 1) {
    return `ORDER BY ${COMPLETED_EXPR} DESC, po.id DESC`;
  }
  if (p.isSortByStyle === 1) {
    return `ORDER BY po.style ASC, po.id DESC`;
  }
  return `ORDER BY po.id DESC`; // mới nhất trước
}

// ===== main findAndCount =====
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

      m_bp.id   AS machine_id,
      m_bp.code AS machine_code,
      m_bp.name AS machine_name,
      m_bp.type AS machine_type,
      m_bp.provider AS machine_provider,
      m_bp.ink  AS machine_ink
    FROM production_orders po
      LEFT JOIN customers c  ON c.id  = po.customer
      LEFT JOIN users     up ON up.id = po.painter
      LEFT JOIN users     us ON us.id = po.saler
      LEFT JOIN users     uct ON uct.id = po.color_tester
      LEFT JOIN users     upr ON upr.id = po.printor
      LEFT JOIN machines  m_bp ON m_bp.id = po.billet_printer
    ${whereSql}
    ${orderBy}
    ${p.isExportExcel ? '' : 'LIMIT :limit OFFSET :offset'}
  `;

  const countSql = `
    SELECT COUNT(DISTINCT po.id) AS cnt
    FROM production_orders po
      LEFT JOIN customers c  ON c.id  = po.customer
      LEFT JOIN users     up ON up.id = po.painter
      LEFT JOIN users     us ON us.id = po.saler
      LEFT JOIN users     uct ON uct.id = po.color_tester
      LEFT JOIN users     upr ON upr.id = po.printor
      LEFT JOIN machines  m_bp ON m_bp.id = po.billet_printer
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

  // map DTO như Java
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

      billetPrinter: (r.machine_id || r.machine_name) ? {
        id: r.machine_id || r.billet_printer,
        code: r.machine_code || null,
        name: r.machine_name || null,
        type: r.machine_type || null,
        provider: r.machine_provider || null,
        ink: r.machine_ink || null,
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

      goodsType: r.goods_type || null,
      unit: r.unit ? { name: r.unit } : null,

      price: r.price ?? null,
      quantity: r.quantity ?? null,
      defectiveQuantity: r.defective_quantity ?? null,
      printedQuantity: r.printed_quantity ?? null,
      remainder: r.remainder ?? null,
      packages: r.packages ?? null,

      image: r.images || r.image || null,
      qrUrl: r.qr_url || null,
      fileUrl: r.file_url || null,

      orderedTime: r.ordered_time || null,
      printTimeStart: r.print_time_start || null,
      printTimeEnd: r.print_time_end || null,
      extractingTimeStart: r.extracting_time_start || null,
      extractingTimeEnd: r.extracting_time_end || null,
      deliveryTimeEnd: r.delivery_time_end || null,

      timeProcessing,

      status: STATUS_BY_CODE[r.status] ?? null,
      paymentStatus: PAYMENT_BY_CODE[r.payment_status] ?? null,
      isDelete: YESNO_BY_NUM(Number(r.is_delete)),

      note: r.note || null,
      printNote: r.print_note || null,
      extractNote: r.extract_note || null,
      printParam: r.print_param || null,

      createdAt: r.time_created || r.created_at || null,
      createdBy: r.created_by || null,
      updatedAt: r.updated_at || null,
      updatedBy: r.updated_by || null,

      // giữ chỗ cho FE cũ
      lstExtractor: [],
      lstPrintor:  [],
      pattern: r.pattern_id ? { id: r.pattern_id } : null,
      personalPattern: r.personal_pattern_id ? { id: r.personal_pattern_id } : null,
      style: r.style || null,
      size: r.size || null,
      commandStatus: r.command_status || null,
      printer: r.printer || null,
      billetPrinterId: r.billet_printer || null,
    };
  });

  return { rows: list, count };
};
