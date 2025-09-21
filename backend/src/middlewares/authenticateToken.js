const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
// const tokenService = require('../services/token.service');
// const userRepository = require('../repositories/user.repository');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const azureAccessHeader = req.headers.access_authorization;
  const azureRefreshHeader = req.headers.refresh_authorization;

  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: 'Unauthorized',
    });
  }

  jwt.verify(token, config.jwt.secret, async (err, user) => {
    // if (err) {
    //   return res.status(httpStatus.FORBIDDEN).send({
    //     message: 'Forbidden',
    //   });
    // }

    // const username = user.body.dataValues
    //   ? user.body.dataValues.username
    //   : user.body.username;

    // const matchedUser = await userRepository.findByUsername(username);
    // try {
    //   const tokenInfo = await tokenService.findTokenByUserId(
    //     matchedUser.dataValues.id,
    //   );
    //   if (!tokenInfo) {
    //     return res.status(httpStatus.FORBIDDEN).send({
    //       message: 'Forbidden',
    //     });
    //   }
    //   if (!tokenInfo.token) {
    //     return res.status(httpStatus.FORBIDDEN).send({
    //       message: 'Session expired, please login again',
    //     });
    //   }
    // } catch (e) {
    //   console.error('Error fetching role and permission:', e);
    // }

    // if (azureRefreshHeader) {
    //   req.headers.azure = {
    //     access_token: azureAccessHeader,
    //     refresh_token: azureRefreshHeader,
    //     username: matchedUser.dataValues.username,
    //   };
    // }

    // req.headers.userId = matchedUser.dataValues.id;
    // req.headers.email = matchedUser.dataValues.email;
    // req.headers.account_name = matchedUser.dataValues.username;
    // req.headers.employees_id = matchedUser.dataValues.employeeId;
    next();
  });
};

module.exports = authenticateToken;
