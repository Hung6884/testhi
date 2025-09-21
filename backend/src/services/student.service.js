const studentRepository = require('../repositories/student.repository');
const rfCardRepository = require('../repositories/rfCard.repository');
const studentFaceImageRepository = require('../repositories/studentFaceImage.repository');
const InternalServerError = require('../utils/response/InternalServerError');
const UnAuthorizedError = require('../utils/response/UnAuthorizedError');
const ResponseDataSuccess = require('../utils/response/ResponseDataSuccess');
const {
  models: { DrivingLicenseCategory },
} = require('@/database');
const logger = require('@/config/logger');
const { required } = require('joi');
const { isEmpty } = require('lodash');
const { fn } = require('sequelize');

const search = async ({ options, filters, sorts }) => {
  try {
    const { count, rows } = await studentRepository.search({
      ...options,
      filters,
      sorts,
    });
    return new ResponseDataSuccess({ count, rows });
  } catch (err) {
    logger.error('Search Student ERROR', err.message);
    return new InternalServerError(err.message);
  }
};

const create = async (body) => {
  try {
    const teacherCodeExisted = await studentRepository.findByCode(body.code);
    if (teacherCodeExisted) {
      return new InternalServerError(
        'Đã tồn tại mã học viên ' + teacherCodeExisted.code,
      );
    }
    const student = await studentRepository.save(body);
    return new ResponseDataSuccess(student);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_CREATE_STUDENT', error.message);

    return new InternalServerError(error);
  }
};

const updateById = async (id, body) => {
  try {
    const student = await studentRepository.findByPk(id);
    if (!student) {
      return new NotFoundError('Học viên không tồn tại');
    }

    const teacherCodeExisted = await studentRepository.findByCode(body.code);
    if (teacherCodeExisted && teacherCodeExisted.id != id) {
      return new InternalServerError(
        `Đã tồn tại mã học viên ${teacherCodeExisted.code}`,
      );
    }

    const res = await studentRepository.updateById(body, student);
    if (!isEmpty(body.faceImages)) {
      await studentFaceImageRepository.upsert(body.faceImages);
    }

    return new ResponseDataSuccess(res);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_UPDATE_STUDENT_BY_ID', error.message);

    return new InternalServerError(error);
  }
};
const lockById = async (id) => {
  try {
    const student = await studentRepository.lockById(id);
    if (!student) {
      return new NotFoundError('Học viên không tồn tại');
    }

    return new ResponseDataSuccess('Success');
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_LOCK_STUDENT_BY_ID', e.message);

    return new InternalServerError(e);
  }
};

const unlockById = async (id) => {
  try {
    const student = await studentRepository.unlockById(id);
    if (!student) {
      return new NotFoundError('Học viên không tồn tại');
    }

    return new ResponseDataSuccess('Success');
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_UNLOCK_STUDENT_BY_ID', e.message);

    return new InternalServerError(e);
  }
};
const findById = async (id) => {
  try {
    const student = await studentRepository.findById(id);
    if (student) return new ResponseDataSuccess(student);
    return new NotFoundError('Học viên không tồn tại');
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_FIND_STUDENT_BY_ID', e.message);

    return new InternalServerError(e);
  }
};

const assignRFCard = async (studentId, body) => {
  try {
    const student = await studentRepository.findByPk(studentId);
    if (!student) {
      return new NotFoundError('Giáo viên không tồn tại');
    }

    const rfCard = await rfCardRepository.findByPk(body.rfCardId);
    if (!isEmpty(student.rfidCode)) {
      return new InternalServerError('Giáo viên đã được gắn thẻ rồi');
    }

    if (!rfCard) {
      return new NotFoundError('Thẻ RF không tồn tại');
    }

    await studentRepository.removeOldRFCardFromStudent(rfCard.code);

    await studentRepository.updateById(
      {
        rfidCode: rfCard.code,
        rfidNumber: rfCard.cardNumber,
        rfidAddedDate: fn('NOW'),
        updatedDate: fn('NOW'),
      },
      student,
    );

    return new ResponseDataSuccess('Success');
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_ASSIGN_RF_CARD_STUDENT', error.message);
    return new InternalServerError(error);
  }
};

const unAssignRFCard = async (id, body) => {
  try {
    const student = await studentRepository.findByPk(id);
    if (!student) {
      return new NotFoundError('Giáo viên không tồn tại');
    }
    const result = await studentRepository.updateById(body, student);
    return new ResponseDataSuccess(result);
  } catch (error) {
    logger.error(
      'ERROR_OCCURRED_WHILE_UNASSIGN_RF_CARD_STUDENT',
      error.message,
    );
    return new InternalServerError(error);
  }
};

module.exports = {
  search,
  create,
  updateById,
  findById,
  lockById,
  unlockById,
  unAssignRFCard,
  assignRFCard,
};
