// const httpStatus = require('http-status');

// const userService = require('./user.service');
// const ApiError = require('../../../utils/ApiError');
// const tokenTypes = require('../../../config/token');
const passwordHelper = require('../utils/password');
const InternalServerError = require('../utils/response/InternalServerError');
const UnAuthorizedError = require('../utils/response/UnAuthorizedError');
const ResponseDataSuccess = require('../utils/response/ResponseDataSuccess');
const accountRepository = require('../repositories/account.repository');
const studentRepository = require('../repositories/student.repository');
const teacherRepository = require('../repositories/teacher.repository');
// const tokenRepository = require('../repositories/token.repository');
// const config = require('../../../config/config');
// const sequelize = require('../../../database/index');
// const NotFoundError = require('../../../utils/response/NotFoundError');
// const BadRequestServerError = require('../../../utils/response/BadRequestError');
// const helper = require('../../../utils/helper');
// const roleRepository = require('../repositories/role.repository');
// const userRoleRepository = require('../repositories/userRole.repository');
const ErrorMessage = require('../constant/ErrorMessage');
const tokenService = require('./token.service');
const userRepository = require('../repositories/users.repository');
// const {
//   models: { Token },
// } = sequelize;

const logger = require('../config/logger');
const { isEmpty } = require('lodash');

const login = async (username, password) => {
  const usernameLower = (username || '').toLowerCase();

  const account = await userRepository.findByUserName(usernameLower);
  if (!account) {
    return new UnAuthorizedError(ErrorMessage.USER_IS_NOT_EXIST_IN_THE_SYSTEM);
  }

  // account.password (users.password)
  const match = await passwordHelper.isPasswordMatch(password, account.password);
  if (!match) {
    return new UnAuthorizedError(
      ErrorMessage.USER_ERROR_INCORRECT_USERNAME_OR_PASSWORD
    );
  }

// Quy ước của bạn: 0 = active, 1 = inactive/locked
const status = Number(account.active_status);
const isActive = status === 0 || account.active_status === '0'; // phòng trường hợp trả về dạng string

if (!isActive) {
  // (tuỳ bạn) semantics đúng hơn là 403:
  // return new ForbiddenError(ErrorMessage.USER_ERROR_UNACTIVATED);
  return new UnAuthorizedError(ErrorMessage.USER_ERROR_UNACTIVATED);
}


  const bodyForToken = {
    id: account.id,
    username: usernameLower,
    is_active: isActive,
    role: account.role,
    name: account.name,
    avatar: account.avatar,
  };

  try {
    const tokens = await tokenService.generateAuthTokens({ userData: bodyForToken });

    // nếu muốn lưu last login:
    // await userRepository.updateLastLogin(account.id);

    return new ResponseDataSuccess({ user: bodyForToken, tokens });
  } catch (e) {
    logger.error('TO DEBUG >==> file: auth.service.js > login > e:', e.message);
    return new InternalServerError(e.message);
  }
};

module.exports = { login };

const loginByRFIDCode = async (rfidCode, isStudent) => {
  if (isEmpty(rfidCode)) {
    return new InternalServerError(`Mã RFID ${rfidCode} không hợp lệ`);
  }
  let data = null;
  if (isStudent) {
    data = await studentRepository.getByRFCard(rfidCode);
  } else {
    data = await teacherRepository.getByRFCard(rfidCode);
  }
  if (isEmpty(data)) {
    return new UnAuthorizedError(
      `Mã RFID ${rfidCode} không tồn tại trong hệ thống`,
    );
  }

  try {
    const responseData = data[0];
    const tokens = await tokenService.generateAuthTokens({
      userData: responseData,
    });

    return new ResponseDataSuccess({ tokens });
  } catch (e) {
    logger.error(
      'TO DEBUG >==> file: auth.service.js:48 >==> loginByRFIDCode >==> e:',
      e.message,
    );
    return new InternalServerError(e.message);
  }
};

// /**
//  * Logout
//  * @param {string} refreshToken
//  * @returns {Promise}
//  */
// const logout = async (userId) => {
//   try {
//     await tokenRepository.clearTokenByUserId(userId);
//     return new ResponseDataSuccess();
//   } catch (err) {
//     logger.error(
//       'TO DEBUG >==> file: auth.service.js:69 >==> logout >==> err:',
//       err.message,
//     );
//     return new InternalServerError();
//   }
// };

// /**
//  * Refresh auth tokens
//  * @param {string} refreshToken
//  * @returns {Promise<Object>}
//  */
// const refreshAuth = async (refreshToken) => {
//   try {
//     const refreshTokenDoc = await tokenService.verifyToken(
//       refreshToken,
//       tokenTypes.REFRESH,
//     );
//     const user = await userService.getUserById(refreshTokenDoc.user);
//     if (!user) {
//       throw new Error();
//     }
//     await refreshTokenDoc.remove();
//     return tokenService.generateAuthTokens({ userData: user });
//   } catch (error) {
//     logger.error(
//       'TO DEBUG >==> file: auth.service.js:95 >==> refreshAuth >==> error:',
//       error.message,
//     );
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
//   }
// };

// /**
//  * Reset password
//  * @param {string} resetPasswordToken
//  * @param {string} newPassword
//  * @returns {Promise}
//  */
// const resetPassword = async (resetPasswordToken, newPassword) => {
//   try {
//     const resetPasswordTokenDoc = await tokenService.verifyToken(
//       resetPasswordToken,
//       tokenTypes.RESET_PASSWORD,
//     );
//     const user = await userService.getUserById(resetPasswordTokenDoc.user);
//     if (!user) {
//       throw new Error();
//     }
//     await userService.updateById(user.id, { password: newPassword });
//     await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
//   }
// };

// /**
//  * Verify email
//  * @param {string} verifyEmailToken
//  * @returns {Promise}
//  */
// const verifyEmail = async (verifyEmailToken) => {
//   try {
//     let userFromToken = null;

//     try {
//       userFromToken = await jwt.verify(verifyEmailToken, config.jwt.secret);
//     } catch (err) {
//       return new UnAuthorizedError();
//     }

//     const user = await userRepository.findById(userFromToken.body.id);
//     if (user.is_active === true) {
//       return new ResponseDataSuccess('Account is activated');
//     }

//     await tokenRepository.clearTokenByUserId(user.id);
//     await userRepository.activeById(user.id, {
//       is_active: true,
//     });

//     return new ResponseDataSuccess('Account activation successful');
//   } catch (error) {
//     logger.error('AN_ERROR_OCCURRED_WHILE_VERIFY_EMAIL', error.message);
//     return new InternalServerError();
//   }
// };

// const changePassword = async (id, body, isAdminEvent = true) => {
//   try {
//     const accountName = body.modified_by;
//     const userId = body.user_id;

//     if (isAdminEvent) {
//       const adminRole = await roleRepository.findAdminRoleId();
//       if (adminRole) {
//         const isAdminAccount = await userRoleRepository.findByUserIdAndRoleId(
//           userId,
//           adminRole.id,
//         );
//         if (!isAdminAccount) {
//           return new BadRequestServerError(
//             'You must have an administrator role when you want to change the password for a member.',
//           );
//         }
//       }
//     }

//     const user = await userRepository.findPasswordById(id, isAdminEvent);
//     if (!user) {
//       return new NotFoundError();
//     }

//     if (user?.username) {
//       if (
//         body.new_password.toLowerCase().includes(user.username.toLowerCase())
//       ) {
//         return new BadRequestServerError(
//           ErrorMessage.USER_IS_NOT_CONTANT_THE_PASSWORD,
//         );
//       }
//     }

//     if (!isAdminEvent) {
//       const isPasswordMatch = await passwordHelper.isPasswordMatch(
//         body.password,
//         user.password,
//       );

//       if (!isPasswordMatch) {
//         return new BadRequestServerError('Password is incorrect');
//       }
//     }

//     await userRepository.updateById(id, {
//       password: await passwordHelper.hashPassword(body.new_password),
//       modified_by: accountName,
//       modified_time: helper.getCurrentTime(),
//     });
//     return new ResponseDataSuccess();
//   } catch (e) {
//     logger.error(
//       'TO DEBUG >==> file: auth.service.js:221 >==> changePassword >==> e:',
//       e.message,
//     );
//     return new InternalServerError();
//   }
// };

module.exports = {
  login,
  loginByRFIDCode,
  //   verifyEmail,
  //   resetPassword,
  //   logout,
  //   refreshAuth,
  //   changePassword,
};
