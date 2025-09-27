// src/repositories/receipt.repository.js
const { Op } = require('sequelize');
const moment = require('moment');

// Lấy models từ database index
// YÊU CẦU: src/database/index.js phải export { sequelize, ReceiptOutside, Customer, User }
const db = require('../database');
const sequelize = db.sequelize || db;

// Thử lấy models trực tiếp từ db export; nếu không có thì fallback qua sequelize.models
const ReceiptOutside =
  db.ReceiptOutside || sequelize.models.receipt_outside;
const Customer =
  db.Customer || sequelize.models.customers;
const User =
  db.User || sequelize.models.users;

// Kiểm tra model để báo lỗi sớm (tránh undefined.findAndCountAll)
if (!ReceiptOutside || !ReceiptOutside.findAndCountAll) {
  throw new Error(
    '[receipt.repository] Model ReceiptOutside chưa được khởi tạo. ' +
      'Hãy kiểm tra src/database/index.js (export & associations) ' +
      'hoặc tên model trong sequelize.models (receipt_outside).'
  );
}

// enum mapping giống Java
const PAYMENT_ENUM_TO_DB = { UNPAID: 0, PARTPAY: 1, PAID: 2 };
const PAYMENT_DB_TO_ENUM = { 0: 'UNPAID', 1: 'PARTPAY', 2: 'PAID' };

exports.getList = async (params = {}) => {
  let {
    customerId,
    customerName,
    createdById,
    createdByName,
    fromCreatedAt,
    toCreatedAt,
    paymentStatus,
    isPet,
    isThernal,
    pageNumber = 1,
    pageSize = 20,
  } = params;

  // Ép số an toàn
  const page = Number(pageNumber) > 0 ? Number(pageNumber) : 1;
  const size = Number(pageSize) > 0 ? Number(pageSize) : 20;
  const offset = (page - 1) * size;

  // where chính cho bảng receipt_outside
  const where = {};
  // where cho join customers
  const customerWhere = {};
  // where cho join users (createdBy)
  const createdByWhere = {};

  // --- filter thời gian (start/end of day giống Java) ---
  const hasFrom = fromCreatedAt != null && fromCreatedAt !== '';
  const hasTo = toCreatedAt != null && toCreatedAt !== '';
  if (hasFrom) {
    where.createdAt = {
      ...(where.createdAt || {}),
      [Op.gte]: moment(Number(fromCreatedAt)).startOf('day').toDate(),
    };
  }
  if (hasTo) {
    where.createdAt = {
      ...(where.createdAt || {}),
      [Op.lte]: moment(Number(toCreatedAt)).endOf('day').toDate(),
    };
  }

  // --- payment status ---
  if (paymentStatus) {
    const code = PAYMENT_ENUM_TO_DB[paymentStatus];
    if (code !== undefined) where.payment_status = code;
  }

  // --- customer filter ---
  if (customerId) customerWhere.id = customerId;
  if (customerName)
    customerWhere.name = { [Op.like]: `%${String(customerName).trim()}%` };
  // giả định cột is_pet / is_thernal ở bảng customers
  if (isPet === 'YES') customerWhere.is_pet = 'YES';
  if (isThernal === 'YES') customerWhere.is_thernal = 'YES';

  // --- createdBy filter ---
  if (createdById) createdByWhere.id = createdById;
  if (createdByName)
    createdByWhere.name = { [Op.like]: `%${String(createdByName).trim()}%` };

  // --- query list + count (distinct để tránh nhân bản khi join) ---
  const { rows, count } = await ReceiptOutside.findAndCountAll({
    where,
    include: [
      {
        model: Customer,
        as: 'customer',
        required: false,
        where: Object.keys(customerWhere).length ? customerWhere : undefined,
        attributes: ['id', 'code', 'name', 'is_pet', 'is_thernal'],
      },
      {
        model: User,
        as: 'createdBy',
        required: false,
        where: Object.keys(createdByWhere).length ? createdByWhere : undefined,
        attributes: ['id', 'name'],
      },
    ],
    order: [
      ['createdAt', 'DESC'],
      ['id', 'DESC'],
    ],
    offset,
    limit: size,
    distinct: true,
  });

  // --- convert DTO (giống ReceiptOutsideDto) ---
  const list = rows.map((r) => ({
    id: r.id,
    content: r.content,
    value: r.value != null ? Number(r.value) : null,
    remainder: r.remainder != null ? Number(r.remainder) : null,
    paymentStatus:
      PAYMENT_DB_TO_ENUM[
        // phòng trường hợp field là string/number
        String(r.payment_status) in PAYMENT_DB_TO_ENUM
          ? String(r.payment_status)
          : r.payment_status
      ] ?? null,
    note: r.note ?? null,
    createdAt:
      r.createdAt?.getTime?.() ??
      (r.createdAt ? +new Date(r.createdAt) : null),

    customer: r.customer
      ? { id: r.customer.id, code: r.customer.code, name: r.customer.name }
      : null,
    createdBy: r.createdBy
      ? { id: r.createdBy.id, name: r.createdBy.name }
      : null,
  }));

  return { list, count, pageNumber: page, pageSize: size };
};
