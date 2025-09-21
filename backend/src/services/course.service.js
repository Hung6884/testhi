const InternalServerError = require('../utils/response/InternalServerError');
const ResponseDataSuccess = require('../utils/response/ResponseDataSuccess');
const NotFoundError = require('../utils/response/NotFoundError');
const logger = require('../config/logger');
const dateUtils = require('../utils/date.util');

const courseRepository = require('../repositories/course.repository');
const { isEmpty, forEach } = require('lodash');

const validateBusiness = (body) => {
  const courseStartDate = dateUtils.stripTime(body.courseStartDate);
  const trainingDate = dateUtils.stripTime(body.trainingDate);
  const courseEndDate = dateUtils.stripTime(body.courseEndDate);
  const examinationDate = dateUtils.stripTime(body.examinationDate);

  if (courseStartDate >= trainingDate) {
    return 'Ngày khai giảng phải nhỏ hơn ngày Đào tạo';
  }
  if (trainingDate >= courseEndDate) {
    return 'Ngày đào tạo phải nhỏ hơn ngày bế giảng';
  }
  if (courseEndDate >= examinationDate) {
    return 'Ngày bế giảng phải nhỏ hơn ngày sát hạch';
  }
  return '';
};

const create = async (body) => {
  try {
    const errorMessage = validateBusiness(body);
    if (!isEmpty(errorMessage)) {
      return new InternalServerError(errorMessage);
    }

    const existDB = await courseRepository.findByCode(body.code);
    if (existDB) {
      return new InternalServerError(`Mã khóa học ${body.code} đã tồn tại`);
    }

    const existByReport1Code = await courseRepository.findByReport1Code(
      body.report1Code,
    );
    if (existByReport1Code) {
      return new InternalServerError(
        `Mã báo cáo ${body.report1Code} đã tồn tại`,
      );
    }

    const existReport1Code = courseRepository.findByCodeAndReportCode(
      body.code,
      body.report1Code,
    );
    if (!isEmpty(existReport1Code)) {
      return new InternalServerError(
        `Mã khóa học ${body.code} và mã báo cáo ${body.report1Code} đã tồn tại`,
      );
    }

    const course = await courseRepository.save(body);
    return new ResponseDataSuccess(course);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_CREATE_COURSE', error.message);

    return new InternalServerError(error);
  }
};

// const bulkCreate = async (employees) => {
//   try {
//     for (const employee of employees) {
//       const validation = await validateEmployeeData(employee);
//       if (!validation.valid) {
//         return new InternalServerError(validation.message);
//       }

//       await courseRepository.save(employee);
//     }

//     return new ResponseDataSuccess('SUCCESS');
//   } catch (error) {
//     logger.error('ERROR_OCCURRED_WHILE_BULK_CREATE_EMPLOYEE', error.message);

//     return new InternalServerError(error);
//   }
// };

const updateById = async (id, body) => {
  try {
    const errorMessage = validateBusiness(body);
    if (!isEmpty(errorMessage)) {
      return new InternalServerError(errorMessage);
    }

    const course = await courseRepository.findByPk(id);
    if (!course) {
      return new NotFoundError('Khóa học không tồn tại');
    }

    const courseByCode = await courseRepository.findByCode(body.code);
    if (courseByCode && courseByCode.id != id) {
      return new InternalServerError(`Mã khóa học ${body.code} đã tồn tại`);
    }

    const existByReport1Code = await courseRepository.findByReport1Code(
      body.report1Code,
    );
    if (existByReport1Code && existByReport1Code.id != id) {
      return new InternalServerError(
        `Mã báo cáo ${body.report1Code} đã tồn tại`,
      );
    }

    const existReport1Code = await courseRepository.findByCodeAndReportCode(
      body.code,
      body.report1Code,
    );
    let count = 0;
    if (!isEmpty(existReport1Code)) {
      forEach(existReport1Code, (r) => {
        if (r.id != id) {
          count++;
          return;
        }
      });
      if (count > 0) {
        return new InternalServerError(
          `Mã khóa học ${body.code} và mã báo cáo ${body.report1Code} đã tồn tại`,
        );
      }
    }

    const courseRes = await courseRepository.updateById(body, course);

    return new ResponseDataSuccess(courseRes);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_UPDATE_COURSE_BY_ID', error.message);

    return new InternalServerError(error);
  }
};

// const findAllByIdAndName = async (searchText) => {
//   try {
//     const query = searchText
//       ? {
//           [Op.or]: [
//             {
//               account: { [Op.iLike]: `%${searchText}%` },
//             },
//             {
//               fullName: { [Op.iLike]: `%${searchText}%` },
//             },
//             {
//               email: { [Op.iLike]: `%${searchText}%` },
//             },
//           ],
//         }
//       : {};
//     const employees = await courseRepository.findAllByIdAndName(query);
//     if (employees) return new ResponseDataSuccess(employees);
//     return new NotFoundError();
//   } catch (e) {
//     logger.error(
//       'ERROR_OCCURRED_WHILE_FIND_ALL_EMPLOYEES_BY_ID_AND_NAME',
//       e.message,
//     );

//     return new InternalServerError(e);
//   }
// };

// const findByQuery = async (id, body) => {
//   try {
//     const employee = await courseRepository.findByQuery(body);
//     if (employee) return new ResponseDataSuccess(employee);
//     return new NotFoundError();
//   } catch (e) {
//     logger.error('ERROR_OCCURRED_WHILE_FIND_EMPLOYEES_BY_QUERY', e.message);
//     return new InternalServerError(e);
//   }
// };

const lockById = async (id) => {
  try {
    const course = await courseRepository.lockById(id);
    if (!course) {
      return new NotFoundError('Khóa học không tồn tại');
    }

    return new ResponseDataSuccess('Success');
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_LOCK_COURSE_BY_ID', e.message);

    return new InternalServerError(e);
  }
};

const unlockById = async (id) => {
  try {
    const course = await courseRepository.unlockById(id);
    if (!course) {
      return new NotFoundError('Khóa học không tồn tại');
    }

    return new ResponseDataSuccess('Success');
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_UNLOCK_COURSE_BY_ID', e.message);

    return new InternalServerError(e);
  }
};

const findById = async (id) => {
  try {
    const course = await courseRepository.findById(id);
    if (course) return new ResponseDataSuccess(course);
    return new NotFoundError();
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_FIND_COURSE_BY_ID', e.message);

    return new InternalServerError(e);
  }
};

const search = async ({ options, filters, sorts }) => {
  try {
    const { count, rows } = await courseRepository.search({
      ...options,
      filters,
      sorts,
    });
    return new ResponseDataSuccess({ count, rows });
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_SEARCH_COURSE', e.message);
    return new InternalServerError(e);
  }
};

module.exports = {
  create,
  //   bulkCreate,
  updateById,
  findById,
  search,
  lockById,
  //   findByQuery,
  //   findAllByIdAndName,
  unlockById,
};
