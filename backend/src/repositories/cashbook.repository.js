const { QueryTypes } = require('sequelize');
const db = require('../database');          // nơi export sequelize
const sequelize = db.sequelize || db;

/** ==== enum helpers giống FE ==== */
const YESNO_TO_NUM = { NO: 0, YES: 1 };
const NUM_TO_YESNO = (v) => (v === 1 ? 'YES' : v === 0 ? 'NO' : null);

// rtype: 0 = Phiếu thu, 1 = Phiếu chi, 2 = Phiếu ghi nợ
const TYPE_BY_NUM = { 0: 0, 1: 1, 2: 2 };

// state: 0 Chưa xử lý, 1 Đã xử lý
const STATE_BY_NUM = { 0: 0, 1: 1 };

// payment method (DB tinyint) -> code FE
const PAYMENT_NUM_TO_CODE = {
  0: 'CASH',
  1: 'TECHCOMBANK',
  2: 'VIETCOMBANK',
  3: 'SEABANK',
  4: 'NAMABANK',
};
const PAYMENT_CODE_TO_NUM = Object.fromEntries(
  Object.entries(PAYMENT_NUM_TO_CODE).map(([k, v]) => [v, Number(k)])
);

/** WHERE builder */
function buildWhere(p) {
  const cond = [];
  const repl = {};

  if (p.code) { cond.push(`reh.code LIKE :code`); repl.code = `%${p.code}%`; }
  if (p.state !== undefined && p.state !== null && p.state !== 'null' && p.state !== '') {
    cond.push(`reh.state = :state`); repl.state = Number(p.state);
  }
  if (p.type !== undefined && p.type !== null && p.type !== 'null' && p.type !== '') {
    cond.push(`reh.rtype = :rtype`); repl.rtype = Number(p.type);
  }
  if (p.customerName) {
    cond.push(`c.name LIKE :customerName`); repl.customerName = `%${p.customerName}%`;
  }
  if (p.supplierName) {
    cond.push(`s.name LIKE :supplierName`); repl.supplierName = `%${p.supplierName}%`;
  }
  if (p.createdBy) {
    cond.push(`u.name LIKE :createdBy`); repl.createdBy = `%${p.createdBy}%`;
  }
  if (p.fromDate) { cond.push(`reh.created_at >= :fromDate`); repl.fromDate = Number(p.fromDate); }
  if (p.toDate)   { cond.push(`reh.created_at <= :toDate`);   repl.toDate   = Number(p.toDate  ); }

  if (p.isPet === 'YES') {
    cond.push(`reh.is_pet = 1`);
  } else if (p.isThernal === 'YES') {
    cond.push(`(reh.is_pet IS NULL OR reh.is_pet = 0)`);
  }

  if (p.customerId) {
    cond.push(`reh.customer_id = :customerId`); repl.customerId = Number(p.customerId);
  }

  if (p.paymentMethod && p.paymentMethod !== 'null') {
    const pm = PAYMENT_CODE_TO_NUM[p.paymentMethod];
    if (pm !== undefined) { cond.push(`reh.payment_method = :paymentMethod`); repl.paymentMethod = pm; }
  }

  const whereSql = cond.length ? `WHERE ${cond.join('\n  AND ')}` : '';
  return { whereSql, repl };
}

exports.findAndCount = async (p) => {
  const { whereSql, repl } = buildWhere(p);

  const limit  = Number(p.pageSize || 20);
  const offset = (Number(p.pageNumber || 1) - 1) * limit;
  const usePaging = !(p.isExportExcel === true);

  const selectSql = `
    SELECT
      reh.*,
      c.id   AS customer_id_join,  c.name AS customer_name,
      s.id   AS supplier_id_join,  s.name AS supplier_name,
      u.id   AS created_by_join,   u.name AS created_by_name
    FROM revenue_expenditure_history reh
      LEFT JOIN customers c ON c.id = reh.customer_id
      LEFT JOIN suppliers s ON s.id = reh.supplier_id
      LEFT JOIN users     u ON u.id = reh.created_by
    ${whereSql}
    ORDER BY reh.id DESC
    ${usePaging ? 'LIMIT :limit OFFSET :offset' : ''}
  `;

  const countSql = `
    SELECT COUNT(*) AS cnt
    FROM revenue_expenditure_history reh
      LEFT JOIN customers c ON c.id = reh.customer_id
      LEFT JOIN suppliers s ON s.id = reh.supplier_id
      LEFT JOIN users     u ON u.id = reh.created_by
    ${whereSql}
  `;

  const rows = await sequelize.query(selectSql, {
    type: QueryTypes.SELECT,
    replacements: { ...repl, limit, offset },
  });

  const cnt = await sequelize.query(countSql, {
    type: QueryTypes.SELECT,
    replacements: repl,
  });
  const count = Number(cnt?.[0]?.cnt || 0);

  const list = rows.map((r) => ({
    id: r.id,
    code: r.code || null,
    type: TYPE_BY_NUM[r.rtype] ?? null,
    note: r.note || null,
    value: r.value != null ? Number(r.value) : null,
    state: STATE_BY_NUM[r.state] ?? null,
    isPet: NUM_TO_YESNO(r.is_pet),
    paymentMethod: PAYMENT_NUM_TO_CODE[r.payment_method] ?? null,

    customer: (r.customer_id_join || r.customer_name) ? {
      id: r.customer_id_join || r.customer_id,
      name: r.customer_name || null,
    } : null,
    supplier: (r.supplier_id_join || r.supplier_name) ? {
      id: r.supplier_id_join || r.supplier_id,
      name: r.supplier_name || null,
    } : null,
    createdBy: (r.created_by_join || r.created_by_name) ? {
      id: r.created_by_join || r.created_by,
      name: r.created_by_name || null,
    } : null,

    createdAt: r.created_at || null,
    updatedAt: r.updated_at || null,
    image: r.image || null,
    balance: r.balance != null ? Number(r.balance) : null,
    reduceCost: r.reduce_cost != null ? Number(r.reduce_cost) : null,
  }));

  return { rows: list, count };
};

/** === TotalObject: revenue + expenditure === */
exports.total = async (p) => {
  const { whereSql, repl } = buildWhere(p);

  const sql = `
    SELECT
      SUM(CASE WHEN reh.rtype = 0 THEN reh.value ELSE 0 END) AS revenue,
      SUM(CASE WHEN reh.rtype = 1 THEN reh.value ELSE 0 END) AS expenditure
    FROM revenue_expenditure_history reh
      LEFT JOIN customers c ON c.id = reh.customer_id
      LEFT JOIN suppliers s ON s.id = reh.supplier_id
      LEFT JOIN users     u ON u.id = reh.created_by
    ${whereSql}
  `;

  const [row] = await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: repl,
  });

  return {
    revenue: Number(row?.revenue || 0),
    expenditure: Number(row?.expenditure || 0),
  };
};
