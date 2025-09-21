const { internalTraining } = require('@/constant/mapping/course');
const Joi = require('joi');

const createCourse = {
  body: Joi.object().keys({
    report1Code: Joi.string().required(),
    code: Joi.string().required(),
    name: Joi.string().required(),
    trainingCategory: Joi.string().required(),
    courseStartDate: Joi.date().required(),
    courseEndDate: Joi.date().required(),
    trainingDate: Joi.date().required(),
    examinationDate: Joi.date().required(),
    internalTraining: Joi.boolean().optional(),
  }),
};

const updateCourse = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    report1Code: Joi.string().required(),
    code: Joi.string().required(),
    name: Joi.string().required(),
    trainingCategory: Joi.string().required(),
    courseStartDate: Joi.date().required(),
    courseEndDate: Joi.date().required(),
    trainingDate: Joi.date().required(),
    examinationDate: Joi.date().required(),
    internalTraining: Joi.boolean().optional(),
  }),
};

const lockCourse = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  createCourse,
  updateCourse,
  lockCourse,
};
