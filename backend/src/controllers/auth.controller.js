const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  authService,
  //   userService,
  //   tokenService,
  //   emailService,
} = require('../services/index');

const register = async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   req.body.isActive = false;
  //   const data = await userService.register(req.body);
  //   if (data.status === httpStatus.OK) {
  //     return res.status(httpStatus.OK).send(data.data);
  //   }
  //   return res.status(data.status).send({
  //     message: data.message,
  //   });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const data = await authService.login(username, password);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};
const loginByRFIDCode = async (req, res) => {
  let isStudent = false;
  //student login
  if (req.originalUrl.includes('/auth/student/login-by-rfid')) {
    isStudent = true;
  }
  const data = await authService.loginByRFIDCode(req.body?.rfidCode, isStudent);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const logout = async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   const data = await authService.logout(req.headers.userId);
  //   if (data.status === httpStatus.OK) {
  //     return res.status(httpStatus.OK).send(data.data);
  //   }
  //   return res.status(data.status).send({
  //     message: data.message,
  //   });
};

const forgotPassword = catchAsync(async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   const resetPasswordToken = await tokenService.generateResetPasswordToken(
  //     req.body.email,
  //   );
  //   await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  //   res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   await authService.resetPassword(req.query.token, req.body.password);
  //   res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   const verifyEmailToken = await tokenService.generateVerifyEmailToken(
  //     req.user,
  //   );
  //   await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  //   res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   const data = await authService.verifyEmail(req.query.token);
  //   if (data.status === httpStatus.OK) {
  //     return res.status(httpStatus.OK).send({
  //       data: data.data,
  //     });
  //   }
  //   return res.status(data.status).send({
  //     message: data.message,
  //   });
};

const changePassword = async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   const data = await authService.changePassword(
  //     req.headers.userId,
  //     {
  //       ...req.body,
  //       modified_by: req.headers.account_name,
  //       user_id: req.headers.userId,
  //     },
  //     false,
  //   );
  //   if (data.status === httpStatus.OK) {
  //     return res.status(httpStatus.OK).send(data.data);
  //   }
  //   return res.status(data.status).send({
  //     message: data.message,
  //   });
};

const changePasswordByAdmin = async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   const data = await authService.changePassword(req.params.id, {
  //     ...req.body,
  //     modified_by: req.headers.account_name,
  //     user_id: req.headers.userId,
  //   });
  //   if (data.status === httpStatus.OK) {
  //     return res.status(httpStatus.OK).send(data.data);
  //   }
  //   return res.status(data.status).send({
  //     message: data.message,
  //   });
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  changePassword,
  changePasswordByAdmin,
  loginByRFIDCode,
};
