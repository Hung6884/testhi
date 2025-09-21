const Sequelize = require('sequelize');
const {
  models: { RFCard, Teacher, Student },
} = require('../database/index');
const helper = require('../utils/helper.js');
const { isEmpty } = require('lodash');
const { sequelize } = require('../database/sequelize');
const logger = require('@/config/logger');

const { Op } = Sequelize;

const search = async ({
  page,
  per,
  filters = {},
  sorts = [['id', 'DESC']],
}) => {
  const { limit, offset } = helper.paginate(page, per);
  const where = {};
  for (const p in filters) {
    if (!isEmpty(filters[p])) {
      if (p === 'status') {
        //where['isActive'] = filters[p] === '1' ? true : false;
        if (filters[p] === '1') {
          where['isActive'] = true;
        } else {
          where['isActive'] = { [Op.or]: [null, false] };
        }
      } else {
        where[p] = { [Op.iLike]: `%${filters[p]}%` };
      }
    }
  }
  return await RFCard.findAndCountAll({
    offset,
    limit,
    where,
    distinct: true,
    order: [['createdDate', 'DESC'], ...sorts],
    include: [
      {
        model: Teacher,
        attributes: ['id', 'fullName'], // you can include more fields if needed
        required: false,
        as: 'teacher',
      },
      {
        model: Student,
        attributes: ['id', 'fullName'],
        required: false,
        as: 'student',
      },
    ],
    /* where: Sequelize.or(
    Sequelize.literal('"GVs"."cardCode" IS NOT NULL'),
    Sequelize.literal('"STs"."cardCode" IS NOT NULL')
  ) */
  });
};

/**
 * get all rf card which mapping with student, teacher
 */
const getRFCards = async () => {
  try {
    const result = await sequelize.query(
      `
    SELECT
      r.rfid AS id,
      r.ma_the AS code,
      r.so_the AS "cardNumber",
      t.giao_vien_id AS "teacherId",
      t.ma_gv AS "teacherCode",
      t.ten_day_du AS "teacherName",
      s.nguoi_lxid AS "studentId",
      s.ma_dk AS "studentCode",
      s.ho_va_ten AS "studentName"
    FROM the_rf r
    LEFT JOIN giao_vien t ON r.ma_the = t.ma_the_rfid
    LEFT JOIN nguoi_lx s ON r.ma_the = s.rfid
    WHERE r.is_Active = true
  `,
      {
        type: sequelize.QueryTypes.SELECT,
      },
    );

    return result;
  } catch (err) {
    logger.error('getRFCards error', err.message);
    return null;
  }
};

const findById = async (id) => {
  return await RFCard.findOne({
    where: {
      id,
    },
    distinct: true,
  });
};

const save = async (body) => {
  const rfCard = await RFCard.create(body);
  return rfCard;
};

const updateById = async (rfCardData, rfCard) => {
  await rfCard.update(rfCardData);
  return rfCard;
};

const lockById = async (id) => {
  const rfCard = await RFCard.findByPk(id);
  if (!rfCard) {
    return null;
  }
  await rfCard.update({ isActive: false });
  return rfCard;
};

const unlockById = async (id) => {
  const rfCard = await RFCard.findByPk(id);
  if (!rfCard) {
    return null;
  }
  await rfCard.update({ isActive: 1 });
  return rfCard;
};

const findByPk = async (id) => {
  return await RFCard.findByPk(id);
};

const findByCode = async (code) => {
  return await RFCard.findOne({
    where: {
      code: code,
    },
  });
};

const findByCardNumber = async (cardNumber) => {
  return await RFCard.findOne({
    where: {
      cardNumber: cardNumber,
    },
  });
};

module.exports = {
  search,
  findById,
  save,
  updateById,
  lockById,
  unlockById,
  findByPk,
  findByCode,
  findByCardNumber,
  getRFCards,
};
