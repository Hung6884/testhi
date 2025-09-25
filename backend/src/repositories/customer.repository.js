'use strict';

const { QueryTypes } = require('sequelize');
const db = require('../database');
const sequelize = db.sequelize || db;

const YESNO = { NO: 0, YES: 1, MAYBE: 2 };

function like(repl, key, v) {
  if (v != null && v !== '') {
    repl[key] = `%${v}%`;
    return true;
  }
  return false;
}

function buildWhereV3(p, ids) {
  const cond = ['1=1'];
  const repl = {};

  // lọc theo danh sách id (haveDebt xử lý xong truyền xuống)
  if (Array.isArray(ids) && ids.length) {
    cond.push('c.id IN (:ids)');
    repl.ids = ids.map(Number);
  }

  // phân loại
  if (p.type != null)      { cond.push('c.type = :type'); repl.type = Number(p.type); }
  if (p.source != null)    { cond.push('c.source = :source'); repl.source = Number(p.source); }
  if (p.commodity != null) { cond.push('c.commodity = :commodity'); repl.commodity = Number(p.commodity); }

  // user liên quan
  if (p.salerId)            { cond.push('c.saler = :salerId'); repl.salerId = Number(p.salerId); }
  if (p.colorTesterId)      { cond.push('c.color_tester = :colorTesterId'); repl.colorTesterId = Number(p.colorTesterId); }
  if (p.directColorTesterId){ cond.push('c.direct_color_tester = :directColorTesterId'); repl.directColorTesterId = Number(p.directColorTesterId); }

  // text search
  if (like(repl, 'name', p.name))             cond.push('c.name LIKE :name');
  if (like(repl, 'salerName', p.salerName))   cond.push('us.name LIKE :salerName');
  if (like(repl, 'code', p.code))             cond.push('c.code LIKE :code');
  if (like(repl, 'phone', p.phone))           cond.push('c.phone LIKE :phone');
  if (like(repl, 'address', p.address))       cond.push('c.address LIKE :address');
  if (like(repl, 'company', p.company))       cond.push('c.company LIKE :company');
  if (like(repl, 'colorTester', p.colorTester)) cond.push('uct.name LIKE :colorTester');

  // flags
  if (p.isPet === YESNO.YES)     cond.push('c.is_pet = 1');
  if (p.isPet === YESNO.NO)      cond.push('(c.is_pet IS NULL OR c.is_pet = 0)');
  if (p.isThernal === YESNO.YES) cond.push('c.is_thernal = 1');
  if (p.isThernal === YESNO.NO)  cond.push('(c.is_thernal IS NULL OR c.is_thernal = 0)');
  if (p.isDirect === YESNO.YES)  cond.push('c.is_direct = 1');
  if (p.isDirect === YESNO.NO)   cond.push('(c.is_direct IS NULL OR c.is_direct = 0)');

  return { whereSql: `WHERE ${cond.join(' AND ')}`, repl };
}

exports.getListV3 = async (
  type, source, commodity,
  ids, colorTesterId, directColorTesterId, salerId,
  name, salerName, code, phone, address, company,
  isPet, isThernal, isDirect,
  pageable, colorTester
) => {
  const p = {
    type, source, commodity,
    salerId, colorTesterId, directColorTesterId,
    name, salerName, code, phone, address, company,
    isPet, isThernal, isDirect,
    colorTester
  };

  const { whereSql, repl } = buildWhereV3(p, ids);

  const limit  = pageable && pageable.pageSize  ? Number(pageable.pageSize)  : 20;
  const offset = pageable && pageable.pageNumber ? (Number(pageable.pageNumber) - 1) * limit : 0;

  const sql = `
    SELECT
      c.*,
      us.id  AS saler_id,   us.name  AS saler_name,
      uct.id AS ct_id,      uct.name AS color_tester_name,
      uctd.id AS dct_id,    uctd.name AS direct_color_tester_name
    FROM customers c
      LEFT JOIN users us   ON us.id  = c.saler
      LEFT JOIN users uct  ON uct.id = c.color_tester
      LEFT JOIN users uctd ON uctd.id= c.direct_color_tester
    ${whereSql}
    ORDER BY c.id DESC
    ${pageable ? 'LIMIT :limit OFFSET :offset' : ''}
  `;

  const rows = await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: pageable ? { ...repl, limit, offset } : repl,
  });

  // map DTO đơn giản; nếu FE cần thêm trường, bổ sung ở đây
  const list = rows.map(r => ({
    id: r.id,
    code: r.code,
    name: r.name,
    phone: r.phone,
    address: r.address,
    company: r.company,
    saler: r.saler_id ? { id: r.saler_id, name: r.saler_name } : null,
    colorTester: r.ct_id ? { id: r.ct_id, name: r.color_tester_name } : null,
    directColorTester: r.dct_id ? { id: r.dct_id, name: r.direct_color_tester_name } : null,
    isPet: r.is_pet,
    isThernal: r.is_thernal,
    isDirect: r.is_direct,
    type: r.type,
    source: r.source,
    commodity: r.commodity,
    note: r.note || null,
    createdAt: r.created_at || r.time_created || null,
    updatedAt: r.updated_at || null,
  }));

  return list;
};

exports.countListV3 = async (
  type, source, commodity,
  ids, colorTesterId, directColorTesterId, salerId,
  name, salerName, code, phone, address, company,
  isPet, isThernal, isDirect,
  colorTester
) => {
  const p = {
    type, source, commodity,
    salerId, colorTesterId, directColorTesterId,
    name, salerName, code, phone, address, company,
    isPet, isThernal, isDirect,
    colorTester
  };

  const { whereSql, repl } = buildWhereV3(p, ids);

  const sql = `
    SELECT COUNT(DISTINCT c.id) AS cnt
    FROM customers c
      LEFT JOIN users us   ON us.id  = c.saler
      LEFT JOIN users uct  ON uct.id = c.color_tester
      LEFT JOIN users uctd ON uctd.id= c.direct_color_tester
    ${whereSql}
  `;

  const rows = await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: repl,
  });

  return Number(rows?.[0]?.cnt || 0);
};
