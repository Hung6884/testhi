const { isActive } = require('@/constant/mapping/course');
const Joi = require('joi');

const createRFCard = {
  body: Joi.object().keys({
    code: Joi.string().required(),
    cardNumber: Joi.string().required(),
    csdtCode: Joi.string().optional(),
    note: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
  }),
};

const updateRFCard = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    code: Joi.string().required(),
    cardNumber: Joi.string().required(),
    csdtCode: Joi.string().optional(),
    note: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
  }),
};

const lockRFCard = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  createRFCard,
  updateRFCard,
  lockRFCard,
};
