const rfCardRepository = require('../repositories/rfCard.repository');
const InternalServerError = require('../utils/response/InternalServerError');
const UnAuthorizedError = require('../utils/response/UnAuthorizedError');
const ResponseDataSuccess = require('../utils/response/ResponseDataSuccess');
const {
  models: { DrivingLicenseCategory },
} = require('@/database');
const logger = require('@/config/logger');
const { required } = require('joi');
const { isEmpty } = require('lodash');

const search = async ({ options, filters, sorts }) => {
  try {
    const { count, rows } = await rfCardRepository.search({
      ...options,
      filters,
      sorts,
    });
    return new ResponseDataSuccess({ count, rows });
  } catch (err) {
    logger.error('Search RF Card ERROR', err.message);
    return new InternalServerError(err.message);
  }
};
const getRFCards = async () => {
  try {
    const results = await rfCardRepository.getRFCards();
    return new ResponseDataSuccess(results);
  } catch (err) {
    logger.error('Get All RF Card ERROR', err.message);
    return new InternalServerError(err.message);
  }
};

const create = async (body) => {
  try {
    const cardCodeExisted = await rfCardRepository.findByCode(body.code);
    if (cardCodeExisted) {
      return new InternalServerError(
        'Đã tồn tại mã thẻ ' + cardCodeExisted.code,
      );
    }
    const cardNumberExisted = await rfCardRepository.findByCardNumber(
      body.cardNumber,
    );
    if (cardNumberExisted) {
      return new InternalServerError(
        'Đã tồn tại số thẻ ' + cardNumberExisted.cardNumber,
      );
    }
    const rfCard = await rfCardRepository.save(body);
    return new ResponseDataSuccess(rfCard);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_CREATE_RF_CARD', error.message);

    return new InternalServerError(error);
  }
};

const updateById = async (id, body) => {
  try {
    const rfCard = await rfCardRepository.findByPk(id);

    if (!rfCard) {
      return new NotFoundError('Thẻ RF không tồn tại');
    }
    const rfCardByCode = await rfCardRepository.findByCode(body.code);
    if (rfCardByCode && rfCard.id != rfCardByCode.id) {
      return new InternalServerError(`Mã thẻ ${body.code} đã tồn tại`);
    }
    const cardNumberExisted = await rfCardRepository.findByCardNumber(
      body.cardNumber,
    );
    if (cardNumberExisted && rfCard.id != cardNumberExisted.id) {
      return new InternalServerError(`Số thẻ ${body.cardNumber} đã tồn tại`);
    }

    const res = await rfCardRepository.updateById(body, rfCard);

    return new ResponseDataSuccess(res);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_UPDATE_RF_CARD_BY_ID', error.message);

    return new InternalServerError(error);
  }
};
const lockById = async (id) => {
  try {
    const rfCard = await rfCardRepository.lockById(id);
    if (!rfCard) {
      return new NotFoundError();
    }

    return new ResponseDataSuccess('Success');
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_LOCK_RF_CARD_BY_ID', e.message);

    return new InternalServerError(e);
  }
};

const unlockById = async (id) => {
  try {
    const rfCard = await rfCardRepository.unlockById(id);
    if (!rfCard) {
      return new NotFoundError();
    }

    return new ResponseDataSuccess('Success');
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_UNLOCK_RF_CARD_BY_ID', e.message);

    return new InternalServerError(e);
  }
};
const findById = async (id) => {
  try {
    const rfCard = await rfCardRepository.findById(id);
    if (rfCard) return new ResponseDataSuccess(rfCard);
    return new NotFoundError();
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_FIND_RF_CARD_BY_ID', e.message);

    return new InternalServerError(e);
  }
};

module.exports = {
  search,
  create,
  updateById,
  findById,
  lockById,
  unlockById,
  getRFCards,
};
