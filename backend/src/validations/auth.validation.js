const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    username: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const loginByRFIDCode = {
  body: Joi.object().keys({
    rfidCode: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    new_password: Joi.string().required().custom(password),
    confirm_password: Joi.string()
      .custom(password)
      .equal(Joi.ref('new_password'))
      .required()
      .label('Confirm password')
      .messages({ 'any.only': '{{#label}} does not match with new password' }),
  }),
};

const changePasswordByAdmin = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    new_password: Joi.string().required().custom(password),
    confirm_password: Joi.string()
      .custom(password)
      .equal(Joi.ref('new_password'))
      .required()
      .label('Confirm password')
      .messages({ 'any.only': '{{#label}} does not match with new password' }),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  changePasswordByAdmin,
  loginByRFIDCode,
};
