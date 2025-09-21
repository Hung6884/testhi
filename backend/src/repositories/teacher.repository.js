const mapValues = require('lodash/mapValues');
const Sequelize = require('sequelize');
const {
  models: { Teacher, DrivingLicenseCategory, EducationalLevel },
} = require('../database/index');
const helper = require('../utils/helper.js');
const { isEmpty } = require('lodash');
const logger = require('@/config/logger');

const { Op, fn, where: whereClause, col } = Sequelize;

const search = async ({ page, per, filters = {}, sorts = [] }) => {
  const { limit, offset } = helper.paginate(page, per);
  const where = {};
  for (const p in filters) {
    if (!isEmpty(filters[p])) {
      if (p === 'isActive') {
        //where['isActive'] = filters[p] === '1' ? true : false;
        if (filters[p] === '1') {
          where['isActive'] = true;
        } else {
          where['isActive'] = { [Op.or]: [null, false] };
        }
      } else if (p === 'rfidCode') {
        where[p] = {
          [Op.or]: [
            whereClause(fn('LOWER', col('so_the_rfid')), {
              [Op.like]: `%${filters[p].toLowerCase()}%`,
            }),
            whereClause(fn('LOWER', col('ma_the_rfid')), {
              [Op.like]: `%${filters[p].toLowerCase()}%`,
            }),
          ],
        };
      } else {
        where[p] = { [Op.iLike]: `%${filters[p]}%` };
      }
    }
  }
  return await Teacher.findAndCountAll({
    offset,
    limit,
    where,
    distinct: true,
    order: [['updatedDate', 'DESC'], ...sorts],
    include: [
      {
        model: DrivingLicenseCategory,
        attributes: ['code', 'name'],
        as: 'drivingLicenseCategoryTable',
        required: false,
      },
      {
        model: EducationalLevel,
        attributes: ['code', 'name'],
        as: 'educationalLevel',
        required: false,
      },
      /* {
        model: TeachingSubject,
        attributes: ['code', 'name'],
        as: 'teachingSubject',
        required: false,
      }, */
    ],
  });
};

const findByName = async (name) => {
  try {
    const teacher = await Teacher.findAll({
      where: {
        name: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('ten_gv')),
          Sequelize.Op.iLike,
          name.toLowerCase(),
        ),
      },
      raw: true,
    });
    return teacher;
  } catch (e) {
    console.log(e);
    return null;
  }
};
const findById = async (id) => {
  return await Teacher.findOne({
    where: {
      id,
    },
    distinct: true,
  });
};

const save = async (body) => {
  const teacher = await Teacher.create(body);
  return teacher;
};

const updateById = async (teacherData, teacher) => {
  teacherData.updatedDate = new Date();
  if (!isEmpty(teacherData.middleName) && !isEmpty(teacherData.name)) {
    teacherData.fullName = `${teacherData.middleName} ${teacherData.name}`;
  }
  await teacher.update(teacherData);
  return teacher;
};

const lockById = async (id) => {
  const teacher = await Teacher.findByPk(id);
  if (!teacher) {
    return null;
  }
  await teacher.update({ isActive: false, updatedDate: new Date() });
  return teacher;
};

const unlockById = async (id) => {
  const teacher = await Teacher.findByPk(id);
  if (!teacher) {
    return null;
  }
  await teacher.update({ isActive: true, updatedDate: new Date() });
  return teacher;
};

const findByPk = async (id) => {
  return await Teacher.findByPk(id);
};

const findByCode = async (code) => {
  return await Teacher.findOne({
    where: {
      code: code,
    },
  });
};

const removeOldRFCardFromTeacher = async (rfidCode) => {
  return await Teacher.update(
    { rfidCode: null, rfidNumber: null, updatedDate: fn('NOW') },
    {
      where: {
        rfidCode: rfidCode,
      },
    },
  );
};

const filterByCodes = async (codes) => {
  return await Teacher.findAll({
    where: {
      code: {
        [Op.in]: codes,
      },
    },
  });
};
const findAllByKeyPairs = async (filters) => {
  return await Teacher.findAll({
    where: {
      [Op.or]: filters,
    },
  });
};

const upsert = async (teachers) => {
  try {
    const now = new Date();
    const withUpdatedDate = teachers.map((t) => ({
      ...t,
      updatedDate: now,
    }));

    await Teacher.bulkCreate(withUpdatedDate, {
      updateOnDuplicate: [
        'avatar',
        'drivingLicenseCategory',
        'middleName',
        'name',
        'educationalLevelCode',
        'nationalId',
        'phone',
        'fullName',
        'birthday',
        'cndtCode',
        'createdDate',
        'isActive',
        'updatedDate',
      ],
    });
  } catch (err) {
    logger.error('upsert teacher error', err.message);
    return false;
  }
  return true;
};

const getByRFCard = async (rfidCode) => {
  return await Teacher.sequelize.query(
    `
SELECT
	gv.giao_vien_id AS "teacherId",
	gv.ma_gv AS "teacherCode",
	gv.ten_day_du AS "teacherName",
	gv.anh_chup AS "teacherAvatar",
  th.ma_the AS "rfidCode",
	th.so_the AS "rfidNumber"
FROM giao_vien gv
LEFT JOIN public.the_rf th ON gv.ma_the_rfid = th.ma_the AND th.is_active = true
WHERE gv.ma_the_rfid = :rfidCode AND gv.is_active = true
    `,
    {
      replacements: { rfidCode },
      type: Teacher.sequelize.QueryTypes.SELECT,
    },
  );
};

module.exports = {
  search,
  findById,
  findByName,
  save,
  updateById,
  lockById,
  unlockById,
  findByPk,
  findByCode,
  removeOldRFCardFromTeacher,
  filterByCodes,
  findAllByKeyPairs,
  upsert,
  getByRFCard,
};
