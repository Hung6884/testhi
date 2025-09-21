const mapValues = require('lodash/mapValues');
const { Op, fn, Sequelize } = require('sequelize');
const {
  models: { Student, StudentFaceImage, Teacher, TrainingVehicle, Course },
} = require('../database/index');
const helper = require('../utils/helper.js');
const { isEmpty } = require('lodash');
const logger = require('@/config/logger');
const { parse, format } = require('date-fns');

const filterByCodesAndCourse = async (codes, courseCode, csdtCode) => {
  return await Student.findAll({
    where: {
      code: { [Op.in]: codes },
      courseCode: courseCode,
      csdtCode: csdtCode,
    },
  });
};

const search = async ({ page, per, filters = {}, sorts = [] }) => {
  const { limit, offset } = helper.paginate(page, per);
  const where = {};
  const extraConditions = [];
  for (const p in filters) {
    if (!isEmpty(filters[p])) {
      if (p === 'status') {
        //where['isActive'] = filters[p] === '1' ? true : false;
        if (filters[p] === '1') {
          where['isActive'] = true;
        } else {
          where['isActive'] = { [Op.or]: [null, false] };
        }
      } else if (p === 'birthday') {
        const parsedDate = parse(filters[p], 'dd/MM/yyyy', new Date());
        const formattedDate = format(parsedDate, 'yyyy-MM-dd');
        extraConditions.push(
          Sequelize.where(Sequelize.fn('DATE', Sequelize.col('ngay_sinh')), {
            [Op.eq]: formattedDate,
          }),
        );
      } else {
        where[p] = { [Op.iLike]: `%${filters[p]}%` };
      }
    }
  }
  if (isEmpty(sorts)) {
    sorts = [['updated_date', 'DESC']];
  }
  return await Student.findAndCountAll({
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
    order: [...sorts],
  });
};

const findById = async (id) => {
  return await Student.findOne({
    where: {
      id,
    },
    include: [
      {
        model: StudentFaceImage,
        attributes: ['id', 'studentId', 'imageCategory', 'imageType', 'url'],
        as: 'studentFaceImages',
        required: false,
      },
      {
        model: Teacher,
        attributes: [
          'id',
          'code',
          'avatar',
          'middleName',
          'name',
          'drivingLicenseCategory',
          'cndtCode',
          'csdtCode',
        ],
        as: 'teacher',
        required: false,
      },
      {
        model: TrainingVehicle,
        attributes: [
          'id',
          'code',
          'licensePlate',
          'drivingLicenseCategory',
          'manufacturingYear',
        ],
        as: 'trainingVehicle',
        required: false,
      },
      {
        model: Course,
        attributes: [
          'id',
          'code',
          'name',
          'trainingCategory',
          'courseStartDate',
          'courseEndDate',
          'trainingDate',
          'examinationDate',
        ],
        as: 'course',
        required: false,
      },
    ],
    distinct: true,
  });
};

const save = async (body) => {
  const student = await Student.create(body);
  return student;
};

const updateById = async (studentData, student) => {
  if (!isEmpty(studentData.middleName) && !isEmpty(studentData.name)) {
    studentData.fullName = `${studentData.middleName} ${studentData.name}`;
  }
  await student.update(studentData);
  return student;
};

const lockById = async (id) => {
  const student = await Student.findByPk(id);
  if (!student) {
    return null;
  }
  await student.update({ isActive: false });
  return student;
};

const unlockById = async (id) => {
  const student = await Student.findByPk(id);
  if (!student) {
    return null;
  }
  await student.update({ isActive: 1 });
  return student;
};

const findByPk = async (id) => {
  return await Student.findByPk(id);
};

const findByCode = async (code) => {
  return await Student.findOne({
    where: {
      code: code,
    },
  });
};

const removeOldRFCardFromStudent = async (rfidCode) => {
  return await Student.update(
    {
      rfidCode: null,
      rfidNumber: null,
      updatedDate: fn('NOW'),
    },
    {
      where: {
        rfidCode: rfidCode,
      },
    },
  );
};

const upsert = async (students) => {
  try {
    const result = await Student.bulkCreate(students, {
      updateOnDuplicate: [
        'name',
        'middleName',
        'fullName',
        'birthday',
        'permanentResidence',
        'residence',
        'nationalId',
        'nationalIdIssueDate',
        'courseId',
        'gender',
        'nationality',
        'drivingLicenseCategory',
        'trainingCategory',
        'isActive',
      ],
    });
    return result;
  } catch (err) {
    logger.error('upsert update/insert to student error', err.message);
    return null;
  }
};

const getByRFCard = async (rfidCode) => {
  return await Student.sequelize.query(
    `
SELECT
  lx.nguoi_lxid AS id,
	lx.ho_va_ten AS "studentName",
	lx.ma_dk AS "studentCode",
	lx.anh_chup AS "studentAvatar",
	lx.hang_dao_tao AS "trainingCategory",
	lx.hang_gplx AS "drivingLicenseCategory",
	gv.ma_gv AS "teacherCode",
	gv.ten_day_du AS "teacherName",
	gv.anh_chup AS "teacherAvatar",
	kh.ma_kh AS "courseCode",
	kh.ten_kh AS "courseName",
	xt.ma_xe AS "trainingVehicleCode",
	xt.bien_so_xe AS "licensePlate",
	dat.so_seri AS "datSerialNumber",
	dat.so_sim AS "datSimNumber",
  th.ma_the AS "rfidCode",
	th.so_the AS "rfidNumber"
FROM nguoi_lx lx
LEFT JOIN public.the_rf th ON lx.rfid = th.ma_the AND th.is_active = true
LEFT JOIN giao_vien gv ON lx.giao_vien_id = gv.giao_vien_id AND gv.is_active = true
LEFT JOIN khoa_hoc kh ON lx.khoa_hoc_id = kh.khoa_hoc_id AND kh.is_active = true
LEFT JOIN xe_tap_lai xt ON lx.ma_xe_tap = xt.ma_xe AND xt.is_active = true
LEFT JOIN dat_device dat ON xt.dat_device_id = dat.id AND dat.status = true
WHERE lx.rfid = :rfidCode AND lx.is_active = true
    `,
    {
      replacements: { rfidCode },
      type: Student.sequelize.QueryTypes.SELECT,
    },
  );
};

module.exports = {
  filterByCodesAndCourse,
  search,
  findById,
  save,
  updateById,
  lockById,
  unlockById,
  findByPk,
  findByCode,
  removeOldRFCardFromStudent,
  upsert,
  getByRFCard,
};
