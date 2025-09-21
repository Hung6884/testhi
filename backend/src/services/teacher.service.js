const teacherRepository = require('../repositories/teacher.repository');
const rfCardRepository = require('../repositories/rfCard.repository');
const InternalServerError = require('../utils/response/InternalServerError');
const UnAuthorizedError = require('../utils/response/UnAuthorizedError');
const ResponseDataSuccess = require('../utils/response/ResponseDataSuccess');
const NotFoundError = require('../utils/response/NotFoundError');
const {
  models: { DrivingLicenseCategory },
} = require('@/database');
const logger = require('@/config/logger');
const { required } = require('joi');
const { isEmpty } = require('lodash');
const { fn } = require('sequelize');

const search = async ({ options, filters, sorts }) => {
  try {
    const { count, rows } = await teacherRepository.search({
      ...options,
      filters,
      sorts,
    });
    return new ResponseDataSuccess({ count, rows });
  } catch (err) {
    logger.error('Search Teacher ERROR', err.message);
    return new InternalServerError(err.message);
  }
};
const findByName = async (user) => {
  try {
    const teachers = await teacherRepository.findByName(user.toLowerCase());
    return new ResponseDataSuccess({ teachers });
  } catch (err) {
    return new InternalServerError(err.message);
  }
};

const create = async (body) => {
  try {
    const teacherCodeExisted = await teacherRepository.findByCode(body.code);
    if (teacherCodeExisted) {
      return new InternalServerError(
        'Đã tồn tại mã giáo viên ' + teacherCodeExisted.code,
      );
    }
    const teacher = await teacherRepository.save(body);
    return new ResponseDataSuccess(teacher);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_CREATE_TEACHER', error.message);

    return new InternalServerError(error);
  }
};

const updateById = async (id, body) => {
  try {
    const teacher = await teacherRepository.findByPk(id);

    if (!teacher) {
      return new NotFoundError('Giáo viên không tồn tại');
    }
    const teacherCodeExisted = await teacherRepository.findByCode(body.code);
    if (teacherCodeExisted && teacherCodeExisted.id != id) {
      return new InternalServerError(
        `Đã tồn tại mã giáo viên ${teacherCodeExisted.code}`,
      );
    }
    body.updatedDate = fn('NOW');
    const res = await teacherRepository.updateById(body, teacher);

    return new ResponseDataSuccess(res);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_UPDATE_TEACHER_BY_ID', error.message);

    return new InternalServerError(error);
  }
};
const lockById = async (id) => {
  try {
    const teacher = await teacherRepository.lockById(id);
    if (!teacher) {
      return new NotFoundError('Giáo viên không tồn tại');
    }

    return new ResponseDataSuccess('Success');
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_LOCK_TEACHER_BY_ID', e.message);

    return new InternalServerError(e);
  }
};

const unlockById = async (id) => {
  try {
    const teacher = await teacherRepository.unlockById(id);
    if (!teacher) {
      return new NotFoundError('Giáo viên không tồn tại');
    }

    return new ResponseDataSuccess('Success');
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_UNLOCK_TEACHER_BY_ID', e.message);

    return new InternalServerError(e);
  }
};
const findById = async (id) => {
  try {
    const teacher = await teacherRepository.findById(id);
    if (teacher) return new ResponseDataSuccess(teacher);
    return new NotFoundError('Giáo viên không tồn tại');
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_FIND_TEACHER_BY_ID', e.message);

    return new InternalServerError(e);
  }
};

const assignRFCard = async (teacherId, body) => {
  try {
    const teacher = await teacherRepository.findByPk(teacherId);
    if (!teacher) {
      return new NotFoundError('Giáo viên không tồn tại');
    }

    if (!isEmpty(teacher.rfidCode)) {
      return new InternalServerError('Giáo viên đã có thẻ rồi');
    }

    const rfCard = await rfCardRepository.findByPk(body.rfCardId);
    if (!rfCard) {
      return new NotFoundError('Thẻ RF không tồn tại');
    }

    await teacherRepository.removeOldRFCardFromTeacher(rfCard.code);

    await teacherRepository.updateById(
      {
        rfidCode: rfCard.code,
        rfidNumber: rfCard.cardNumber,
        updatedDate: fn('NOW'),
      },
      teacher,
    );

    return new ResponseDataSuccess('Success');
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_ASSIGN_RF_CARD_TEACHER', error.message);
    return new InternalServerError(error);
  }
};

const unAssignRFCard = async (id, body) => {
  try {
    const teacher = await teacherRepository.findByPk(id);
    if (!teacher) {
      return new NotFoundError('Giáo viên không tồn tại');
    }
    const result = await teacherRepository.updateById(body, teacher);
    return new ResponseDataSuccess(result);
  } catch (error) {
    logger.error(
      'ERROR_OCCURRED_WHILE_UNASSIGN_RF_CARD_TEACHER',
      error.message,
    );
    return new InternalServerError(error);
  }
};

module.exports = {
  findByName,
  search,
  create,
  updateById,
  findById,
  lockById,
  unlockById,
  assignRFCard,
  unAssignRFCard,
};
