const isEmpty = require('lodash/isEmpty');
const { Op, Sequelize } = require('sequelize');
const {
  models: { Course },
} = require('../database/index');
const helper = require('../utils/helper');
const { parse, format } = require('date-fns');
const { courseMapping } = require('@/constant/mapping');
const logger = require('@/config/logger');

const updateById = async (courseData, course) => {
  courseData.updatedDate = new Date();
  await course.update(courseData);
  return course;
};

const lockById = async (id) => {
  const course = await Course.findByPk(id);
  if (!course) {
    return null;
  }
  await course.update({ isActive: false });
  return course;
};

const unlockById = async (id) => {
  const course = await Course.findByPk(id);
  if (!course) {
    return null;
  }
  await course.update({ isActive: 1 });
  return course;
};

const findByPk = async (id) => {
  return await Course.findByPk(id);
};

const findById = async (id) => {
  return await Course.findOne({
    where: {
      id,
    },
    distinct: true,
  });
};

const search = async ({ page, pageSize, filters = {}, sorts = [] }) => {
  const { offset, limit } = helper.paginate(page, pageSize);
  const where = {};
  const extraConditions = [];
  for (const property in filters) {
    if (!isEmpty(filters[property])) {
      if (filters[property] === '') {
        where[property] = null;
      } else if (
        [
          'courseStartDate',
          'courseEndDate',
          'trainingDate',
          'examinationDate',
        ].includes(property)
      ) {
        const parsedDate = parse(filters[property], 'dd/MM/yyyy', new Date());
        const formattedDate = format(parsedDate, 'yyyy-MM-dd');
        extraConditions.push(
          Sequelize.where(
            Sequelize.fn('DATE', Sequelize.col(courseMapping[property])),
            {
              [Op.eq]: formattedDate,
            },
          ),
        );
      } else if (property === 'internalTraining' && filters[property]) {
        where[property] = true;
      } else if (property === 'status') {
        //where['isActive'] = filters[property] === '1' ? true : false;
        if (filters[property] === '1') {
          where['isActive'] = true;
        } else {
          where['isActive'] = { [Op.or]: [null, false] };
        }
      } else {
        where[property] = { [Op.iLike]: `%${filters[property]}%` };
      }
    }
  }

  const response = await Course.findAndCountAll({
    offset,
    limit,
    where:
      extraConditions.length > 0
        ? {
            ...where,
            [Op.and]: extraConditions,
          }
        : where,
    distinct: true,
    order: [['updatedDate', 'DESC'], ...sorts],
  });

  return response;
};

const save = async (body) => {
  const course = await Course.create(body);
  return course;
};

const filterByCodes = async (codes) => {
  return await Course.findAll({
    where: {
      code: {
        [Op.in]: codes,
      },
    },
  });
};

const findByCode = async (code) => {
  return await Course.findOne({
    where: {
      code,
    },
  });
};
const findByReport1Code = async (report1Code) => {
  return await Course.findOne({
    where: {
      report1Code,
    },
  });
};
const findByCodeAndCsdtCode = async (code, csdtCode) => {
  return await Course.findOne({
    where: {
      code,
      csdtCode,
    },
  });
};

const findByCodeAndReportCode = async (code, report1Code) => {
  return await Course.findAll({
    where: {
      code,
      report1Code,
    },
  });
};

const upsert = async (courses) => {
  try {
    return await Course.bulkCreate(courses, {
      updateOnDuplicate: [
        'name',
        'trainingCategory',
        'courseStartDate',
        'courseEndDate',
        'createdDate',
        'internalTraining',
        'isActive',
        'updatedDate',
      ],
    });
  } catch (err) {
    logger.error('upsert update/insert to courses error', err.message);
    return null;
  }
};

const findAllByKeyPairs = async (filters) => {
  return await Course.findAll({
    where: {
      [Op.or]: filters,
    },
  });
};

module.exports = {
  search,
  findById,
  save,
  updateById,
  lockById,
  findByPk,
  unlockById,
  filterByCodes,
  findByCode,
  findByCodeAndCsdtCode,
  upsert,
  findAllByKeyPairs,
  findByCodeAndReportCode,
  findByReport1Code,
};
